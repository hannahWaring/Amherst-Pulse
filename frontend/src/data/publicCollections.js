// Placeholder data until the backend serves public collections.
// Coordinates are approximate.
export const publicCollections = [
  {
    id: 1,
    title: 'Hiking Events',
    rso: 'UMOC',
    description: 'Upcoming events with UMOC.',
    image: '/isometric-3d-map.png',
    pins: [
      { id: 1, name: 'Mount Norwottuck Trailhead', location: 'Notch Visitor Center', lat: 42.3045, lng: -72.5135 },
      { id: 2, name: "Puffer's Pond Loop", location: 'North Amherst', lat: 42.4114, lng: -72.5014 },
    ],
  },
  {
    id: 2,
    title: 'Math Events',
    rso: 'Recreational Math Club',
    description: 'Lectures and PSETs.',
    image: '/isometric-3d-map.png',
    pins: [
      { id: 1, name: 'Weekly PSET Session', location: 'Lederle Graduate Research Tower', lat: 42.3943, lng: -72.5267 },
      { id: 2, name: 'Guest Lecture', location: 'Integrative Learning Center', lat: 42.3909, lng: -72.5262 },
    ],
  },
  {
    id: 3,
    title: 'Best Views',
    description: 'Outdoor spots with a great view.',
    image: '/isometric-3d-map.png',
    pins: [
      { id: 1, name: 'Top of the Library', location: 'W.E.B. Du Bois Library', lat: 42.3897, lng: -72.5283 },
      { id: 2, name: 'Old Chapel Lawn', location: 'Old Chapel', lat: 42.3888, lng: -72.5287 },
      { id: 3, name: 'Mount Norwottuck Summit', location: 'Holyoke Range', lat: 42.3045, lng: -72.5135 },
    ],
  },
  {
    id: 4,
    title: 'Late Night Study Spots',
    description: 'Places on campus that stay open late.',
    image: '/isometric-3d-map.png',
    pins: [
      { id: 1, name: 'Learning Commons', location: 'W.E.B. Du Bois Library', lat: 42.3897, lng: -72.5283 },
      { id: 2, name: 'Campus Center Lounges', location: 'Campus Center', lat: 42.3915, lng: -72.5272 },
    ],
  },
  {
    id: 5,
    title: 'Coffee Around Amherst',
    description: 'Cafes in town and on campus.',
    image: '/isometric-3d-map.png',
    pins: [
      { id: 1, name: 'Amherst Coffee', location: 'Downtown Amherst', lat: 42.3757, lng: -72.5196 },
      { id: 2, name: 'Share Coffee', location: 'Downtown Amherst', lat: 42.3765, lng: -72.5205 },
      { id: 3, name: 'Campus Center Cafe', location: 'Campus Center', lat: 42.3915, lng: -72.5272 },
    ],
  },
  {
    id: 6,
    title: 'Hackathon Season',
    rso: 'HackUMass',
    description: 'Workshops, info sessions, and hack nights.',
    image: '/isometric-3d-map.png',
    pins: [
      { id: 1, name: 'HackUMass Info Session', location: 'Integrative Learning Center', lat: 42.3909, lng: -72.5262 },
      { id: 2, name: 'Hack Night', location: 'Computer Science Building', lat: 42.3951, lng: -72.5311 },
    ],
  },
];
