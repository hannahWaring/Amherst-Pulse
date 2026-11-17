import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { ArrowLeft, Eye, MapPin, Pencil, Share2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MapGGAPI from '../components/map_gg_api';
import CreatePin from '../components/pins/CreatePin';
import CreateCollection from '../components/collections/CreateCollection';
import ShareCollection from '../components/collections/ShareCollection';
import { findCollectionById, getAccessRole } from '../data/collections';
import { currentUsername } from '../data/mockUsers';

export default function CollectionPage({ collectionId }) {
  const [isCreatePinOpen, setIsCreatePinOpen] = useState(false);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
  const [isEditCollectionOpen, setIsEditCollectionOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [collection, setCollection] = useState(() => findCollectionById(collectionId));

  useEffect(() => {
    setCollection(findCollectionById(collectionId));
  }, [collectionId]);

  // Owner and collaborators can edit and share; viewers can only view.
  const accessRole = getAccessRole(collection, currentUsername);
  const canEditCollection = accessRole === 'owner' || accessRole === 'collaborator';
  const canShareCollection = canEditCollection;
  const from = new URLSearchParams(window.location.search).get('from');
  const backHref = from === 'shared'
    ? '/collections?tab=shared'
    : from === 'collections'
      ? '/collections'
      : '/explore';
  const backLabel = from === 'shared'
    ? 'Back to Shared with me'
    : from === 'collections'
      ? 'Back to My Collections'
      : 'Back to Explore';

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

        <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
          {/* Left side: back link, header, pins */}
          <div className="p-6 md:p-10 lg:min-h-0 lg:w-1/2 lg:overflow-y-auto">
            {/* Back to Explore */}
            <a
              href={backHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#6b4df6] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </a>

            {!collection ? (
              <p className="mt-10 text-center text-sm font-medium text-slate-500">
                Collection not found
              </p>
            ) : (
              <>
                {/* Header */}
                <Card
                  sx={{ mt: 3, display: 'flex', flexDirection: { xs: 'column', xl: 'row' }, borderRadius: 3 }}
                >
                  <CardMedia
                    component="img"
                    image={collection.image}
                    alt={collection.title}
                    sx={{ width: { xs: '100%', xl: 240 }, height: { xs: 180, xl: 'auto' }, objectFit: 'cover' }}
                  />
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3, flex: 1 }}>
                    <div className="flex items-start justify-between gap-3">
                      <Typography component="h1" variant="h5" sx={{ fontWeight: 700, color: '#1f2757' }}>
                        {collection.title}
                      </Typography>
                      <div className="flex shrink-0 items-center gap-2">
                        {canShareCollection && (
                          <button
                            type="button"
                            onClick={() => setIsShareOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                            aria-label="Share collection"
                          >
                            <Share2 className="h-4 w-4" aria-hidden="true" />
                            Share
                          </button>
                        )}
                        {canEditCollection && (
                          <button
                            type="button"
                            onClick={() => setIsEditCollectionOpen(true)}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            aria-label="Edit collection"
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                            Edit
                          </button>
                        )}
                        {accessRole === 'viewer' && (
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
                            <Eye className="h-4 w-4" aria-hidden="true" />
                            View only
                          </span>
                        )}
                      </div>
                    </div>
                    {(accessRole === 'collaborator' || accessRole === 'viewer') && (
                      <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                        Shared by @{collection.ownerUsername}
                      </Typography>
                    )}
                    {collection.rso && (
                      <Typography variant="subtitle1" sx={{ mt: 0.5, color: '#6b4df6', fontWeight: 600 }}>
                        {collection.rso}
                      </Typography>
                    )}
                    <Typography variant="body1" sx={{ mt: 1.5, color: 'text.secondary', lineHeight: 1.6 }}>
                      {collection.description}
                    </Typography>
                  </CardContent>
                </Card>

                {/* Pins list */}
                <div className="mt-6">
                  <Typography component="h2" variant="h6" sx={{ fontWeight: 700, color: '#1f2757' }}>
                    Pins ({collection.pins.length})
                  </Typography>
                  <ul className="mt-3 flex flex-col gap-3">
                    {collection.pins.map((pin) => (
                      <li
                        key={pin.id}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <MapPin className="h-5 w-5 shrink-0 text-[#6b4df6]" />
                        <div>
                          <p className="text-sm font-semibold text-[#1f2757]">{pin.name}</p>
                          <p className="text-xs text-slate-500">{pin.location}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* Right side: full-height map with this collection's pins */}
          {collection && (
            <div className="h-96 shrink-0 border-t border-slate-200 lg:h-auto lg:flex-1 lg:border-l lg:border-t-0">
              <MapGGAPI
                pins={collection.pins.map((pin) => ({
                  id: pin.id,
                  latitude: pin.lat,
                  longitude: pin.lng,
                  color: '#6b4df6',
                }))}
              />
            </div>
          )}
        </section>

        {isCreatePinOpen && <CreatePin onClose={() => setIsCreatePinOpen(false)} />}
        {isCreateCollectionOpen && <CreateCollection onClose={() => setIsCreateCollectionOpen(false)} />}
        {isShareOpen && collection && (
          <ShareCollection
            collection={collection}
            currentUsername={currentUsername}
            onClose={() => setIsShareOpen(false)}
            onSave={(updatedCollection) => {
              Object.assign(collection, updatedCollection);
              setCollection(updatedCollection);
            }}
          />
        )}
        {isEditCollectionOpen && collection && (
          <CreateCollection
            mode="edit"
            collection={collection}
            onClose={() => setIsEditCollectionOpen(false)}
            onSave={(updatedCollection) => {
              Object.assign(collection, updatedCollection);
              setCollection(updatedCollection);
            }}
          />
        )}
      </div>
    </main>
  );
}
