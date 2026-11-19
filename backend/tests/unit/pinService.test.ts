
import { beforeEach, describe, expect, jest, test } from '@jest/globals';

type Fn = (...args: any[]) => any;

const repository = {
  create: jest.fn<Fn>(),
  findAllByCollection: jest.fn<Fn>(),
  findById: jest.fn<Fn>(),
  update: jest.fn<Fn>(),
  delete: jest.fn<Fn>(),
  findCollectionIdsByPin: jest.fn<Fn>(),
};

const collectionsRepository = {
  findById: jest.fn(),
  canUserModifyCollection: jest.fn(),
};

jest.unstable_mockModule(
  '../../src/repositories/pinRepository.js',
  () => ({ pinsRepository: repository })
);

jest.unstable_mockModule(
  '../../src/repositories/collectionRepository.js',
  () => ({ collectionsRepository })
);

const { pinsService } = await import('../../src/services/pinService.js');

const pin = { id: 'p1', creator_id: 'owner', title: 'Coffee' };
const expectedPin = { ...pin, is_expired: false };

describe('pinsService', () => {
  beforeEach(() => jest.resetAllMocks());

  test('creates a pin as the supplied creator', async () => {
    repository.create.mockResolvedValue(pin);

    await expect(
      pinsService.createPin('owner', { title: 'Coffee' } as any)
    ).resolves.toEqual(expectedPin);

    expect(repository.create).toHaveBeenCalledWith('owner', {
      title: 'Coffee',
    });
  });

  test('lists pins in a collection, including empty collections', async () => {
    repository.findAllByCollection
      .mockResolvedValueOnce([pin])
      .mockResolvedValueOnce([]);

    await expect(
      pinsService.getPinsByCollection('c1')
    ).resolves.toEqual([expectedPin]);

    await expect(
      pinsService.getPinsByCollection('empty')
    ).resolves.toEqual([]);

    expect(repository.findAllByCollection).toHaveBeenCalledWith('c1');
  });

  test('returns an existing pin', async () => {
    repository.findById.mockResolvedValue(expectedPin);

    await expect(
      pinsService.getPinById('p1')
    ).resolves.toEqual(expectedPin);
  });

  test('returns 404 for a missing pin', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      pinsService.getPinById('missing')
    ).rejects.toMatchObject({
      statusCode: 404,
      message: 'Pin not found',
    });
  });

  test('collaborator can update a pin', async () => {
    repository.findById.mockResolvedValue(pin);
    repository.findCollectionIdsByPin.mockResolvedValue(['c1']);
    collectionsRepository.canUserModifyCollection.mockResolvedValue(true);
    repository.update.mockResolvedValue({ ...pin, title: 'Changed' });

    await expect(
      pinsService.updatePin('collaborator', 'p1', { title: 'Changed' })
    ).resolves.toMatchObject({ title: 'Changed' });
  });

  test('non-collaborator cannot update a pin', async () => {
    repository.findById.mockResolvedValue(pin);
    repository.findCollectionIdsByPin.mockResolvedValue(['c1']);
    collectionsRepository.canUserModifyCollection.mockResolvedValue(false);

    await expect(
      pinsService.updatePin('stranger', 'p1', { title: 'Changed' })
    ).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  test('missing pin cannot be updated', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      pinsService.updatePin('owner', 'missing', { title: 'Changed' })
    ).rejects.toMatchObject({ statusCode: 404 });

    expect(repository.update).not.toHaveBeenCalled();
  });

  test('creator can delete their pin', async () => {
    repository.findById.mockResolvedValue(pin);
    repository.delete.mockResolvedValue(true);

    await expect(
      pinsService.deletePin('owner', 'p1')
    ).resolves.toBeUndefined();

    expect(repository.delete).toHaveBeenCalledWith('p1');
  });

  test('collaborator can delete a pin', async () => {
    repository.findById.mockResolvedValue(pin);
    repository.findCollectionIdsByPin.mockResolvedValue(['c1']);
    collectionsRepository.canUserModifyCollection.mockResolvedValue(true);
    repository.delete.mockResolvedValue(true);

    await expect(
      pinsService.deletePin('collaborator', 'p1')
    ).resolves.toBeUndefined();
  });

  test('missing pin cannot be deleted', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      pinsService.deletePin('owner', 'missing')
    ).rejects.toMatchObject({ statusCode: 404 });

    expect(repository.delete).not.toHaveBeenCalled();
  });

  test('passes through repository failures', async () => {
    const error = new Error('db failed');
    repository.create.mockRejectedValue(error);

    await expect(
      pinsService.createPin('owner', { title: 'Coffee' } as any)
    ).rejects.toBe(error);
  });

  test('non-collaborator cannot delete a pin', async () => {
    repository.findById.mockResolvedValue(pin);
    repository.findCollectionIdsByPin.mockResolvedValue(['c1']);
    collectionsRepository.canUserModifyCollection.mockResolvedValue(false);

    await expect(
      pinsService.deletePin('stranger', 'p1')
    ).rejects.toMatchObject({
      statusCode: 403,
    });
  });
});
