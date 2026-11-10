import { beforeEach, describe, expect, jest, test } from '@jest/globals';
type Fn = (...args: any[]) => any;
const collections = {
  create: jest.fn<Fn>(), findAllByOwner: jest.fn<Fn>(), findAllSharedWithUser: jest.fn<Fn>(),
  findById: jest.fn<Fn>(), update: jest.fn<Fn>(), delete: jest.fn<Fn>(),
  findMemberRole: jest.fn<Fn>(), findCollectionPin: jest.fn<Fn>(),
  addPin: jest.fn<Fn>(), removePin: jest.fn<Fn>(),
};
const pins = { findById: jest.fn<Fn>() };
jest.unstable_mockModule('../../src/repositories/collectionRepository.js', () => ({ collectionsRepository: collections }));
jest.unstable_mockModule('../../src/repositories/pinRepository.js', () => ({ pinsRepository: pins }));
const { collectionService, COLLECTION_NOT_FOUND, PIN_NOT_FOUND, PIN_NOT_IN_COLLECTION,
  PIN_ALREADY_IN_COLLECTION, NOT_OWNER_OR_EDITOR } = await import('../../src/services/collectionService.js');
const collection = { id: 'c1', owner_id: 'owner', title: 'Trip' };
const pin = { id: 'p1', creator_id: 'owner', title: 'Coffee' };
const link = { collection_id: 'c1', pin_id: 'p1', added_by: 'owner' };

describe('collectionService', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    collections.findById.mockResolvedValue(collection);
    collections.findMemberRole.mockResolvedValue(null);
    collections.findCollectionPin.mockResolvedValue(null);
    pins.findById.mockResolvedValue(pin);
  });
  test('creates a collection', async () => {
    collections.create.mockResolvedValue(collection);
    await expect(collectionService.createCollection('owner', { title: 'Trip' } as any)).resolves.toEqual(collection);
    expect(collections.create).toHaveBeenCalledWith('owner', { title: 'Trip' });
  });
  test('lists owned and shared collections', async () => {
    collections.findAllByOwner.mockResolvedValue([collection]);
    collections.findAllSharedWithUser.mockResolvedValue([collection]);
    await expect(collectionService.getCollectionsByOwner('owner')).resolves.toEqual([collection]);
    await expect(collectionService.getCollectionsSharedWithUser('member')).resolves.toEqual([collection]);
  });
  test('finds a collection or reports missing', async () => {
    await expect(collectionService.getCollectionById('c1')).resolves.toEqual(collection);
    collections.findById.mockResolvedValue(null);
    await expect(collectionService.getCollectionById('missing')).rejects.toThrow(COLLECTION_NOT_FOUND);
  });
  test('updates an existing collection', async () => {
    collections.update.mockResolvedValue({ ...collection, title: 'New' });
    await expect(collectionService.updateCollection('c1', { title: 'New' })).resolves.toMatchObject({ title: 'New' });
    expect(collections.update).toHaveBeenCalledWith('c1', { title: 'New' });
  });
  test('deletes an existing collection', async () => {
    await expect(collectionService.deleteCollection('c1')).resolves.toBeUndefined();
    expect(collections.delete).toHaveBeenCalledWith('c1');
  });
  test('rejects updating or deleting a nonexistent collection', async () => {
    collections.findById.mockResolvedValue(null);
    await expect(collectionService.updateCollection('missing', { title: 'New' })).rejects.toThrow(COLLECTION_NOT_FOUND);
    await expect(collectionService.deleteCollection('missing')).rejects.toThrow(COLLECTION_NOT_FOUND);
    expect(collections.update).not.toHaveBeenCalled();
    expect(collections.delete).not.toHaveBeenCalled();
  });
  test('owner adds an existing pin', async () => {
    collections.addPin.mockResolvedValue(link);
    await expect(collectionService.addPinToCollection('c1', 'p1', 'owner')).resolves.toEqual(link);
    expect(collections.findMemberRole).not.toHaveBeenCalled();
    expect(collections.addPin).toHaveBeenCalledWith('c1', 'p1', 'owner');
  });
  test('collaborator can add a pin', async () => {
    collections.findMemberRole.mockResolvedValue('collaborator');
    collections.addPin.mockResolvedValue({ ...link, added_by: 'editor' });
    await expect(collectionService.addPinToCollection('c1', 'p1', 'editor')).resolves.toMatchObject({ added_by: 'editor' });
  });
  test.each(['viewer', null])('viewer or nonmember (%s) cannot add', async role => {
    collections.findMemberRole.mockResolvedValue(role);
    await expect(collectionService.addPinToCollection('c1', 'p1', 'other')).rejects.toThrow(NOT_OWNER_OR_EDITOR);
    expect(collections.addPin).not.toHaveBeenCalled();
  });
  test('cannot add to a missing collection', async () => {
    collections.findById.mockResolvedValue(null);
    await expect(collectionService.addPinToCollection('missing', 'p1', 'owner')).rejects.toThrow(COLLECTION_NOT_FOUND);
  });
  test('cannot add a nonexistent pin', async () => {
    pins.findById.mockResolvedValue(null);
    await expect(collectionService.addPinToCollection('c1', 'missing', 'owner')).rejects.toThrow(PIN_NOT_FOUND);
  });
  test('cannot add same pin twice', async () => {
    collections.findCollectionPin.mockResolvedValue(link);
    await expect(collectionService.addPinToCollection('c1', 'p1', 'owner')).rejects.toThrow(PIN_ALREADY_IN_COLLECTION);
    expect(collections.addPin).not.toHaveBeenCalled();
  });
  test('owner can remove linked pin', async () => {
    collections.findCollectionPin.mockResolvedValue(link);
    await expect(collectionService.removePinFromCollection('c1', 'p1', 'owner')).resolves.toBeUndefined();
    expect(collections.removePin).toHaveBeenCalledWith('c1', 'p1');
  });
  test('collaborator can remove linked pin', async () => {
    collections.findMemberRole.mockResolvedValue('collaborator');
    collections.findCollectionPin.mockResolvedValue(link);
    await collectionService.removePinFromCollection('c1', 'p1', 'editor');
    expect(collections.removePin).toHaveBeenCalledWith('c1', 'p1');
  });
  test.each(['viewer', null])('viewer or nonmember (%s) cannot remove', async role => {
    collections.findMemberRole.mockResolvedValue(role);
    collections.findCollectionPin.mockResolvedValue(link);
    await expect(collectionService.removePinFromCollection('c1', 'p1', 'other')).rejects.toThrow(NOT_OWNER_OR_EDITOR);
    expect(collections.removePin).not.toHaveBeenCalled();
  });
  test('cannot remove from missing collection', async () => {
    collections.findById.mockResolvedValue(null);
    await expect(collectionService.removePinFromCollection('missing', 'p1', 'owner')).rejects.toThrow(COLLECTION_NOT_FOUND);
  });
  test('cannot remove a pin not in the collection', async () => {
    await expect(collectionService.removePinFromCollection('c1', 'p1', 'owner')).rejects.toThrow(PIN_NOT_IN_COLLECTION);
    expect(collections.removePin).not.toHaveBeenCalled();
  });
  test('passes through persistence errors', async () => {
    const error = new Error('db failed');
    collections.addPin.mockRejectedValue(error);
    await expect(collectionService.addPinToCollection('c1', 'p1', 'owner')).rejects.toBe(error);
  });
});
