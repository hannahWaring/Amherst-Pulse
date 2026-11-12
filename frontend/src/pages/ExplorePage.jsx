import React, { useState } from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CreatePin from '../components/pins/CreatePin';
import CreateCollection from '../components/collections/CreateCollection';
import { publicCollections } from '../data/publicCollections';


export default function ExplorePage() {
  const [isCreatePinOpen, setIsCreatePinOpen] = useState(false);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const query = searchQuery.trim().toLowerCase();
  const filteredCollections = publicCollections.filter(
    (collection) =>
      collection.title.toLowerCase().includes(query) ||
      (collection.rso ?? '').toLowerCase().includes(query)
  );

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

        <section className="min-h-0 min-w-0 flex-1 overflow-y-auto p-6 md:p-10" aria-labelledby="explore-heading">
          <div className="mx-auto max-w-6xl pb-6">
            <Typography id="explore-heading" component="h1" variant="h5" sx={{ fontWeight: 700, color: '#1f2757' }}>
              Explore Collections
            </Typography>

            {/* Search bar */}
            <div className="mt-6 flex w-full max-w-lg items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <Search className="h-5 w-5 text-slate-400" />
              <input
                type="text"
                aria-label="Search public collections"
                placeholder="Search collections or RSOs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Collections grid */}
            {filteredCollections.length === 0 ? (
              <p className="mt-10 text-center text-sm font-medium text-slate-500">
                No collections found
              </p>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCollections.map((collection) => (
                  <Card key={collection.id} sx={{ borderRadius: 3 }}>
                    <CardActionArea
                      component="a"
                      href={`/collections/${collection.id}`}
                      sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-start' }}
                    >
                    <CardMedia
                      component="img"
                      image={collection.image}
                      alt={collection.title}
                      sx={{ height: 160, objectFit: 'cover' }}
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Typography component="h2" variant="h6" sx={{ fontWeight: 700, color: '#1f2757' }}>
                        {collection.title}
                      </Typography>
                      {collection.rso && (
                        <Typography variant="subtitle2" sx={{ mt: 0.5, color: '#6b4df6', fontWeight: 600 }}>
                          {collection.rso}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ mt: 1.5, color: 'text.secondary', lineHeight: 1.6 }}>
                        {collection.description}
                      </Typography>
                    </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {isCreatePinOpen && <CreatePin onClose={() => setIsCreatePinOpen(false)} />}
        {isCreateCollectionOpen && <CreateCollection onClose={() => setIsCreateCollectionOpen(false)} />}
      </div>
    </main>
  );
}
