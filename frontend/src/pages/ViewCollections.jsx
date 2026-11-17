import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Chip, Tab, Tabs, Typography } from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CreatePin from '../components/pins/CreatePin';
import CreateCollection from '../components/collections/CreateCollection';
import { getCollectionsSharedWith, getOwnedCollections, getAccessRole } from '../data/collections';
import { currentUsername } from '../data/mockUsers';

export default function ViewCollections() {
  const [isCreatePinOpen, setIsCreatePinOpen] = useState(false);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(() =>
    new URLSearchParams(window.location.search).get('tab') === 'shared' ? 'shared' : 'owned'
  );

  const isSharedTab = activeTab === 'shared';
  const collections = isSharedTab
    ? getCollectionsSharedWith(currentUsername)
    : getOwnedCollections(currentUsername);

  const handleTabChange = (_event, newTab) => {
    setActiveTab(newTab);
    const url = newTab === 'shared' ? '/collections?tab=shared' : '/collections';
    window.history.replaceState(null, '', url);
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

            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="Collection lists"
              sx={{
                mt: 3,
                borderBottom: 1,
                borderColor: 'divider',
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 },
                '& .MuiTab-root.Mui-selected': { color: '#6b4df6' },
                '& .MuiTabs-indicator': { backgroundColor: '#6b4df6' },
              }}
            >
              <Tab label="My Collections" value="owned" id="tab-owned" aria-controls="tabpanel-collections" />
              <Tab label="Shared with me" value="shared" id="tab-shared" aria-controls="tabpanel-collections" />
            </Tabs>

            <div
              id="tabpanel-collections"
              role="tabpanel"
              aria-labelledby={isSharedTab ? 'tab-shared' : 'tab-owned'}
              className="mt-6 flex flex-col gap-4"
            >
              {collections.length === 0 && (
                <p className="py-10 text-center text-sm font-medium text-slate-500">
                  {isSharedTab ? 'No collections have been shared with you yet.' : "You haven't made any collections yet."}
                </p>
              )}
              {collections.map((collection) => (
                <Card
                  key={collection.id}
                  component="a"
                  href={`/collections/${collection.id}?from=${isSharedTab ? 'shared' : 'collections'}`}
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
                    {isSharedTab && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Shared by @{collection.ownerUsername}
                        </Typography>
                        <Chip
                          size="small"
                          label={getAccessRole(collection, currentUsername) === 'viewer' ? 'Viewer' : 'Collaborator'}
                          sx={{ bgcolor: '#ede9fe', color: '#6d28d9', fontWeight: 600 }}
                        />
                      </div>
                    )}
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
