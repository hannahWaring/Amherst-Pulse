import React, {useState} from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MapGGAPI from '../components/map_gg_api';
import {Plus} from 'lucide-react';
import CreatePin from '../components/pins/CreatePin';
import CreateCollection from '../components/collections/CreateCollection';
import MyPins from './MyPins';

export default function DefaultPage({isMyPinOpen}) {
    // set const variables to turn on create pin
    const [isCreatePinOpen, setIsCreatePinOpen] = useState(false);
    const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);
    const [onHome] = useState(false);

    return (
        <main className = "min-h-screen bg-[#F8F9FE] ">
            <Navbar />

            <div className = "flex">
                <Sidebar 
                    onCreatePin = {() => setIsCreatePinOpen(true)}
                    onCreateCollection = {() => setIsCreateCollectionOpen(true)}
                    onMyPins={() => {
    window.history.pushState({}, '', '/MyPins');
    window.dispatchEvent(new PopStateEvent('popstate'));
}}
isMyPinOpen={isMyPinOpen}
onHome={() => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
}}
                    />


            {/*Create Pin Modal*/}
            {isCreatePinOpen && (
                <CreatePin 
                onClose = { () => setIsCreatePinOpen(false)} />
            )}
            <div className = "flex flex-1 items-center justify-center">
                {isMyPinOpen ? <MyPins /> : <MapGGAPI />}
            </div>
                       
        
                
             
            {/*Create Collection Modal*/}
            {isCreateCollectionOpen && (
                <CreateCollection 
                onClose = { () => setIsCreateCollectionOpen(false)} 
                />
            )}
        </div>
        </main>
    );

}