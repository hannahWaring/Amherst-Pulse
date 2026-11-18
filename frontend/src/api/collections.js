const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Temporary development session. Replace this stand-in when frontend auth is connected.
const session = {
  user: {
    id: import.meta.env.VITE_DEMO_USER_ID ?? "00000000-0000-4000-8000-000000000001",
  },
  access_token: import.meta.env.VITE_DEMO_ACCESS_TOKEN ?? "development-access-token",
};

async function request(path, { method = "GET", body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (response.status === 204) return null;

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.error?.message ?? result?.error ?? `Request failed (${response.status})`);
  }
  return result;
}

export const collectionSession = session;

export function toCollectionView(row, pins = []) {
  return {
    id: row.id,
    ownerId: row.owner_id,
    ownerUsername: row.owner_id === session.user.id ? "you" : "",
    title: row.title,
    rso: row.rso ?? "",
    description: row.description ?? "",
    image: row.image ?? "/isometric-3d-map.png",
    visibility: row.visibility ?? "private",
    viewer_can_add_pins: row.viewer_can_add_pins ?? false,
    pins: pins.map((pin) => ({
      id: pin.id,
      name: pin.title,
      location: pin.location_name ?? "",
      lat: pin.latitude,
      lng: pin.longitude,
    })),
  };
}

export function listMyCollections() {
  return request(`/collections/user/${session.user.id}`);
}

export function listSharedCollections() {
  return request(`/collections/user/${session.user.id}/shared`);
}

export function listPublicCollections() {
  return request("/collections");
}

export function getCollection(id) {
  return request(`/collections/${encodeURIComponent(id)}`);
}

export function getCollectionPins(id) {
  return request(`/pins/collection/${encodeURIComponent(id)}`);
}

export function createCollection(input) {
  return request("/collections", { method: "POST", body: input });
}

export function updateCollection(id, input) {
  return request(`/collections/${encodeURIComponent(id)}`, { method: "PATCH", body: input });
}

export function deleteCollection(id) {
  return request(`/collections/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export function addPinToCollection(collectionId, pinId) {
  return request(`/collections/${encodeURIComponent(collectionId)}/addPin`, {
    method: "POST",
    body: { pin_id: pinId },
  });
}

export function removePinFromCollection(collectionId, pinId) {
  return request(
    `/collections/${encodeURIComponent(collectionId)}/deletePin/${encodeURIComponent(pinId)}`,
    { method: "DELETE" },
  );
}
