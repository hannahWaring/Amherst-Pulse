import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CreatePin from '../components/pins/CreatePin';
import CreateCollection from '../components/collections/CreateCollection';

const collections = [
  {
    id: 1,
    title: 'Hiking Events',
    rso: 'UMOC',
    description: 'Upcoming events with UMOC.',
    image: '/isometric-3d-map.png',
  },
  {
    id: 2,
    title: 'Math Events',
    rso: 'Recreational Math Club',
    description: 'Lectures and PSETs.',
    image: '/isometric-3d-map.png',
  },
  {
    id: 3,
    title: 'Best Views',

    description: 'Outdoor spots with a great view.',
    image: '/isometric-3d-map.png',
  },
  
];

export default function ViewCollections() {
  const [isCreatePinOpen, setIsCreatePinOpen] = useState(false);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#F8F9FE]">
      <div className="shrink-0">
        <Navbar />
      </div>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          onCreatePin={() => setIsCreatePinOpen(true)}
          onCreateCollection={() => setIsCreateCollectionOpen(true)}
        />

        <section className="min-h-0 min-w-0 flex-1 overflow-y-auto p-6 md:p-10" aria-labelledby="collections-heading">
          <div className="mx-auto max-w-4xl pb-6">
            <Typography id="collections-heading" component="h1" variant="h5" sx={{ fontWeight: 700, color: '#1f2757' }}>
              My Collections
            </Typography>

            <div className="mt-6 flex flex-col gap-4">
              {collections.map((collection) => (
                <Card
                  key={collection.id}
                  sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, borderRadius: 3 }}
                >
                  <CardMedia
                    component="img"
                    image={collection.image}
                    alt={collection.title}
                    sx={{ width: { xs: '100%', sm: 200 }, height: { xs: 180, sm: 160 }, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3 }}>
                    <Typography component="h2" variant="h6" sx={{ fontWeight: 700, color: '#1f2757' }}>
                      {collection.title}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mt: 0.5, color: '#6b4df6', fontWeight: 600 }}>
                      {collection.rso}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary', lineHeight: 1.6 }}>
                      {collection.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {isCreatePinOpen && <CreatePin onClose={() => setIsCreatePinOpen(false)} />}
        {isCreateCollectionOpen && <CreateCollection onClose={() => setIsCreateCollectionOpen(false)} />}
      </div>
    </main>
  );
}
