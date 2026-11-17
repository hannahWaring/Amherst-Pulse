// Placeholder private collections until the backend serves them.
// These do not show on Explore; they only show for their owner and the people they are shared with.
// Coordinates are approximate.
export const privateCollections = [
  {
    id: 101,
    ownerUsername: 'alexkim',
    visibility: 'private',
    members: [
      { username: 'janedoe', role: 'collaborator' },
      { username: 'priya_r', role: 'viewer' },
    ],
    color: '#10B981',
    title: 'Dorm Floor Hangouts',
    description: 'Spots our floor likes to meet up at.',
    image: '/isometric-3d-map.png',
    pins: [
      { id: 1, name: 'Hampshire Dining Hall', location: 'Southwest', lat: 42.3836, lng: -72.5302 },
      { id: 2, name: 'Southwest Courts', location: 'Southwest', lat: 42.3822, lng: -72.5288 },
    ],
  },
  {
    id: 102,
    ownerUsername: 'marcus.l',
    visibility: 'private',
    members: [
      { username: 'janedoe', role: 'viewer' },
      { username: 'chen.w', role: 'collaborator' },
    ],
    color: '#6366F1',
    title: 'Group Project Meetups',
    description: 'Where our project group meets each week.',
    image: '/isometric-3d-map.png',
    pins: [
      { id: 1, name: 'CS Building Lobby', location: 'Computer Science Building', lat: 42.3951, lng: -72.5311 },
      { id: 2, name: 'Learning Commons', location: 'W.E.B. Du Bois Library', lat: 42.3897, lng: -72.5283 },
    ],
  },
  {
    id: 103,
    ownerUsername: 'janedoe',
    visibility: 'private',
    members: [
      { username: 'alexkim', role: 'collaborator' },
      { username: 'taylor.m', role: 'viewer' },
    ],
    color: '#F97316',
    title: 'Weekend Plans',
    description: 'Places to check out this weekend.',
    image: '/isometric-3d-map.png',
    pins: [
      { id: 1, name: 'Amherst Farmers Market', location: 'Amherst Town Common', lat: 42.3765, lng: -72.5197 },
      { id: 2, name: "Puffer's Pond", location: 'North Amherst', lat: 42.4114, lng: -72.5014 },
    ],
  },
];
