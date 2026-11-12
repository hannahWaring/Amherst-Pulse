import React, {useState} from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MapGGAPI from '../components/map_gg_api';
import {Plus} from 'lucide-react';
import CreatePin from '../components/pins/CreatePin';
import CreateCollection from '../components/collections/CreateCollection';
export default function DefaultPage() {
    // set const variables to turn on create pin
    const [isCreatePinOpen, setIsCreatePinOpen] = useState(false);
    const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);

    return (
        <main className = "min-h-screen bg-[#F8F9FE] ">
            <Navbar />

            <div className = "flex">
                <Sidebar 
                    onCreatePin = {() => setIsCreatePinOpen(true)}
                    onCreateCollection = {() => setIsCreateCollectionOpen(true)}
                    />

            <div className = "flex flex-1 items-center justify-center">
                <MapGGAPI />
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