// Helpers over the placeholder collection data until the backend serves collections.
import { publicCollections } from './publicCollections';
import { privateCollections } from './privateCollections';

export const allCollections = [...publicCollections, ...privateCollections];

export function findCollectionById(id) {
  return allCollections.find((collection) => collection.id === id);
}

// Returns 'owner', 'collaborator', 'viewer', or null if the user has no access through sharing.
export function getAccessRole(collection, username) {
  if (!collection) return null;
  if (collection.ownerUsername === username) return 'owner';
  const member = collection.members?.find((person) => person.username === username);
  return member?.role ?? null;
}

export function getOwnedCollections(username) {
  return allCollections.filter((collection) => collection.ownerUsername === username);
}

export function getCollectionsSharedWith(username) {
  return allCollections.filter((collection) =>
    collection.members?.some((person) => person.username === username)
  );
}

// Public collections only take collaborators; private ones take collaborators and viewers.
export function getRoleOptions(visibility) {
  return visibility === 'public' ? ['collaborator'] : ['collaborator', 'viewer'];
}
