import React, {useState} from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MapGGAPI from '../components/map_gg_api';
import {Plus} from 'lucide-react';
import CreatePin from '../components/pins/CreatePin';
export default function DefaultPage() {
    // set const variables to turn on create pin
    const [isCreatePinOpen, setIsCreatePinOpen] = useState(false);
    return (
        <main className = "min-h-screen bg-[#F8F9FE] ">
            <Navbar />

            <div className = "flex">
                <Sidebar onCreatePin = {() => setIsCreatePinOpen(true)}/>

            <div className = "flex flex-1 items-center justify-center">
                <MapGGAPI />

                {/* Create Pin button
                <button
                type = "button"
                onClick = { () => setIsCreatePinOpen(true)}
                    className="absolute right-6 top-6 z-10 flex items-center gap-2 rounded-xl bg-[#6B4DF6] px-5 py-3 font-semibold text-white shadow-lg hover:bg-[#5938D5]"
                >
                    <Plus className = "h-5 w-5" />
                    Create Pin
                </button> */}
           </div>

            {/*Create Pin Modal*/}
            {isCreatePinOpen && (
                <CreatePin 
                onClose = { () => setIsCreatePinOpen(false)} />
            )}
            </div>
        </main>
    );

}