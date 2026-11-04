import React, {useState} from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MapGGAPI from '../components/map_gg_api';
import {Plus} from 'lucide-react';
import CreatePin from '../components/pins/CreatePin';
import CreateCollection from '../components/collections/CreateCollection';
import { publicCollections } from '../data/publicCollections';

export default function DefaultPage() {
    // set const variables to turn on create pin
    const [isCreatePinOpen, setIsCreatePinOpen] = useState(false);
    const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
    const [selectedCollectionIds, setSelectedCollectionIds] = useState(
        () => publicCollections.map((collection) => collection.id)
    );
    const [selectedRso, setSelectedRso] = useState('');

    const visiblePins = publicCollections
        .filter((collection) => selectedCollectionIds.includes(collection.id))
        .filter((collection) => !selectedRso || collection.rso === selectedRso)
        .flatMap((collection) => collection.pins.map((pin) => ({
            id: `${collection.id}-${pin.id}`,
            latitude: pin.lat,
            longitude: pin.lng,
            color: collection.color,
        })));

    return (
        <main className = "min-h-screen bg-[#F8F9FE] ">
            <Navbar />

            <div className = "flex">
                <Sidebar 
                    onCreatePin = {() => setIsCreatePinOpen(true)}
                    onCreateCollection = {() => setIsCreateCollectionOpen(true)}
                    selectedCollectionIds={selectedCollectionIds}
                    onCollectionToggle={(collectionId) => setSelectedCollectionIds((current) =>
                        current.includes(collectionId)
                            ? current.filter((id) => id !== collectionId)
                            : [...current, collectionId]
                    )}
                    selectedRso={selectedRso}
                    onRsoChange={setSelectedRso}
                    />

            <div className = "flex flex-1 items-center justify-center">
                <MapGGAPI pins={visiblePins} />
           </div>

            {/*Create Pin Modal*/}
            {isCreatePinOpen && (
                <CreatePin 
                onClose = { () => setIsCreatePinOpen(false)} />
            )}
            {/*Create Collection Modal*/}
            {isCreateCollectionOpen && (
                <CreateCollection 
                onClose = { () => setIsCreateCollectionOpen(false)} />
            )}
            </div>
        </main>
    );

}
