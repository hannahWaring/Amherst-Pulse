import React, {useState} from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MapGGAPI from '../components/map_gg_api';
import CreatePin from '../components/pins/CreatePin';
import CreateCollection from '../components/collections/CreateCollection';
import MyPins from './MyPins';
import { publicCollections } from '../data/publicCollections';

export default function DefaultPage({
    isMyPinOpen,
    accessToken,
    apiBaseUrl
}) {
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

        // createPin function to Create a Pin -> using POST
    async function createPin(newPin) {
        if (!apiBaseUrl || !accessToken) {
        throw new Error('API connection or login is not available.');
    }

    const response = await fetch(`${apiBaseUrl}/pins`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: newPin.label,
            description: newPin.description,
        }),
    });

    if (!response.ok) {
        throw new Error(`Could not create pin (${response.status}).`);
    }

    return response.json();
}
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
                {isMyPinOpen
                ? <MyPins
                    accessToken={accessToken}
                    apiBaseUrl={apiBaseUrl}
                />
                : <MapGGAPI pins={visiblePins} />}
           </div>

            {/*Create Pin Modal*/}
            {isCreatePinOpen && (
                <CreatePin
                onClose = { () => setIsCreatePinOpen(false)}
                onSave={createPin} />
            )}


            {/*Create Collection Modal*/}
            {isCreateCollectionOpen && (
                <CreateCollection
                    onClose={() => setIsCreateCollectionOpen(false)}
                />
            )}
        </div>
        </main>
    );

}
