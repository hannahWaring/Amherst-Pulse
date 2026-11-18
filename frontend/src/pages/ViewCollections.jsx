import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CreatePin from '../components/pins/CreatePin';
import CreateCollection from '../components/collections/CreateCollection';
import { createCollection, listMyCollections, listSharedCollections, toCollectionView } from '../api/collections';
import { publicCollections } from '../data/publicCollections';

export default function ViewCollections() {
  const [isCreatePinOpen, setIsCreatePinOpen] = useState(false);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [collections, setCollections] = useState(publicCollections.slice(0, 3));

  useEffect(() => {
    let active = true;
    Promise.all([listMyCollections(), listSharedCollections()])
      .then(([owned, shared]) => {
        if (!active) return;
        const unique = new Map([...owned, ...shared].map((item) => [item.id, toCollectionView(item)]));
        setCollections([...unique.values()]);
      })
      .catch(() => {
        // Keep the demo collections visible until a valid development session/backend is available.
      });
    return () => { active = false; };
  }, []);

  const handleCreateCollection = async (values) => {
    const created = await createCollection({
      title: values.title,
      description: values.description || null,
      visibility: values.visibility,
      viewer_can_add_pins: false,
    });
    setCollections((current) => [toCollectionView(created), ...current]);
    setIsCreateCollectionOpen(false);
  };

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
                  component="a"
                  href={`/collections/${collection.id}?from=collections`}
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
        {isCreateCollectionOpen && (
          <CreateCollection
            onClose={() => setIsCreateCollectionOpen(false)}
            onSave={handleCreateCollection}
          />
        )}
      </div>
    </main>
  );
}
