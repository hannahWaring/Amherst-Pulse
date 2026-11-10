/**
 * Service-to-service integration tests: real pinService and collectionService
 * operate against the same in-memory repository implementations.
 * This does NOT verify Supabase RLS, SQL foreign keys, or HTTP route wiring.
 * The current app.ts does not mount collectionRoute, so HTTP-level integration
 * should be added after collection routes are registered.
 */
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { Pin } from '../../src/types/pins.js';
import type { Collection } from '../../src/types/collections.js';

const pins = new Map<string, Pin>();
const collections = new Map<string, Collection>();
const links = new Map<string, { collection_id: string; pin_id: string; added_by: string }>();
const members = new Map<string, string>();
let nextPin = 0;
let nextCollection = 0;
const key = (collectionId: string, pinId: string) => `${collectionId}:${pinId}`;

const pinsRepository = {
  create: jest.fn(async (creatorId: string, input: any) => {
    const pin = { ...input, id: `p${++nextPin}`, creator_id: creatorId } as Pin;
    pins.set(pin.id, pin);
    return pin;
  }),
  findById: jest.fn(async (id: string) => pins.get(id) ?? null),
  findAllByCollection: jest.fn(async (id: string) =>
    [...links.values()].filter(link => link.collection_id === id)
      .map(link => pins.get(link.pin_id)).filter((pin): pin is Pin => pin !== undefined)),
  update: jest.fn(async (id: string, input: any) => {
    const updated = { ...pins.get(id)!, ...input };
    pins.set(id, updated);
    return updated;
  }),
  delete: jest.fn(async (id: string) => pins.delete(id)),
};
const collectionsRepository = {
  create: jest.fn(async (ownerId: string, input: any) => {
    const collection = { ...input, id: `c${++nextCollection}`, owner_id: ownerId } as Collection;
    collections.set(collection.id, collection);
    return collection;
  }),
  findById: jest.fn(async (id: string) => collections.get(id) ?? null),
  findAllByOwner: jest.fn(async (id: string) => [...collections.values()].filter(c => c.owner_id === id)),
  findAllSharedWithUser: jest.fn(async (id: string) => [...collections.values()].filter(c => members.has(`${c.id}:${id}`))),
  update: jest.fn(async (id: string, input: any) => {
    const changed = { ...collections.get(id)!, ...input };
    collections.set(id, changed);
    return changed;
  }),
  delete: jest.fn(async (id: string) => { collections.delete(id); }),
  findMemberRole: jest.fn(async (collectionId: string, userId: string) => members.get(`${collectionId}:${userId}`) ?? null),
  findCollectionPin: jest.fn(async (collectionId: string, pinId: string) => links.get(key(collectionId, pinId)) ?? null),
  addPin: jest.fn(async (collectionId: string, pinId: string, userId: string) => {
    const link = { collection_id: collectionId, pin_id: pinId, added_by: userId };
    links.set(key(collectionId, pinId), link);
    return link;
  }),
  removePin: jest.fn(async (collectionId: string, pinId: string) => { links.delete(key(collectionId, pinId)); }),
};
jest.unstable_mockModule('../../src/repositories/pinRepository.js', () => ({ pinsRepository }));
jest.unstable_mockModule('../../src/repositories/collectionRepository.js', () => ({ collectionsRepository }));
const { pinsService } = await import('../../src/services/pinService.js');
const { collectionService } = await import('../../src/services/collectionService.js');

beforeEach(() => {
  pins.clear(); collections.clear(); links.clear(); members.clear();
  nextPin = 0; nextCollection = 0;
  jest.clearAllMocks();
});

describe('pin + collection service integration', () => {
  test('create collection + pin, add, list, update, remove; pin still exists', async () => {
    const collection = await collectionService.createCollection('owner', { title: 'Trip' } as any);
    const pin = await pinsService.createPin('owner', { title: 'Coffee' } as any);
    await expect(pinsService.getPinsByCollection(collection.id)).resolves.toEqual([]);

    const membership = await collectionService.addPinToCollection(collection.id, pin.id, 'owner');
    expect(membership).toMatchObject({ collection_id: collection.id, pin_id: pin.id, added_by: 'owner' });
    await expect(pinsService.getPinsByCollection(collection.id)).resolves.toEqual([pin]);

    const updated = await pinsService.updatePin('owner', pin.id, { title: 'Updated coffee' });
    await expect(pinsService.getPinsByCollection(collection.id)).resolves.toEqual([updated]);

    await collectionService.removePinFromCollection(collection.id, pin.id, 'owner');
    await expect(pinsService.getPinsByCollection(collection.id)).resolves.toEqual([]);
    await expect(pinsService.getPinById(pin.id)).resolves.toEqual(updated);
  });

  test('same pin can be in two collections and removal only affects one', async () => {
    const a = await collectionService.createCollection('owner', { title: 'A' } as any);
    const b = await collectionService.createCollection('owner', { title: 'B' } as any);
    const pin = await pinsService.createPin('owner', { title: 'Shared' } as any);
    await collectionService.addPinToCollection(a.id, pin.id, 'owner');
    await collectionService.addPinToCollection(b.id, pin.id, 'owner');
    await collectionService.removePinFromCollection(a.id, pin.id, 'owner');
    await expect(pinsService.getPinsByCollection(a.id)).resolves.toEqual([]);
    await expect(pinsService.getPinsByCollection(b.id)).resolves.toEqual([pin]);
  });

  test('duplicate pin link is rejected and original remains', async () => {
    const collection = await collectionService.createCollection('owner', { title: 'Trip' } as any);
    const pin = await pinsService.createPin('owner', { title: 'Coffee' } as any);
    await collectionService.addPinToCollection(collection.id, pin.id, 'owner');
    await expect(collectionService.addPinToCollection(collection.id, pin.id, 'owner'))
      .rejects.toThrow('Pin is already in this collection');
    await expect(pinsService.getPinsByCollection(collection.id)).resolves.toEqual([pin]);
  });

  test('collaborator can add/remove, viewer cannot, pin creator still controls editing', async () => {
    const collection = await collectionService.createCollection('owner', { title: 'Trip' } as any);
    const pin = await pinsService.createPin('owner', { title: 'Coffee' } as any);
    members.set(`${collection.id}:editor`, 'collaborator');
    members.set(`${collection.id}:viewer`, 'viewer');
    await expect(collectionService.addPinToCollection(collection.id, pin.id, 'viewer'))
      .rejects.toThrow('Only the owner or an editor');
    await collectionService.addPinToCollection(collection.id, pin.id, 'editor');
    await expect(pinsService.updatePin('editor', pin.id, { title: 'Not allowed' }))
      .rejects.toMatchObject({ statusCode: 403 });
    await expect(collectionService.removePinFromCollection(collection.id, pin.id, 'viewer'))
      .rejects.toThrow('Only the owner or an editor');
    await collectionService.removePinFromCollection(collection.id, pin.id, 'editor');
    await expect(pinsService.getPinById(pin.id)).resolves.toEqual(pin);
  });

  test('cannot add nonexistent pin or add to nonexistent collection', async () => {
    const collection = await collectionService.createCollection('owner', { title: 'Trip' } as any);
    const pin = await pinsService.createPin('owner', { title: 'Coffee' } as any);
    await expect(collectionService.addPinToCollection(collection.id, 'missing', 'owner'))
      .rejects.toThrow('Pin not found');
    await expect(collectionService.addPinToCollection('missing', pin.id, 'owner'))
      .rejects.toThrow('Collection not found');
  });
});
