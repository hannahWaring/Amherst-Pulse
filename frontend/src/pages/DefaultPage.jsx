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
    const [isMyPinOpen, setIsMyPinOpen] = useState(false);
    const [onHome] = useState(false);
    const pins = [
        {label: 'Pin name 1', image : ` `, time : `10pm - 11pm`, key: `Pin 1`}, 
        {label: 'Pin name 2', image : ` `, time : `5am - 7am`, key: `Pin 2`},
        {label: 'Pin name 3', image : ` `, time : `Tuesday - Thursday`, key: `Pin 3`},
        {label: 'Pin name 4', image : ` `, time : `October 5th 5pm`, key: `Pin 4`}, 
        {label: 'Pin name 5', image : ` `, time : `2026 October 27th `, key: `Pin 5`},
        {label: 'Pin name 6', image : ` `, time : `2026 October 27th 9pm - 11pm`, key: `Pin 6`}

    ];


    return (
        <main className = "min-h-screen bg-[#F8F9FE] ">
            <Navbar />

            <div className = "flex">
                <Sidebar 
                    onCreatePin = {() => setIsCreatePinOpen(true)}
                    onCreateCollection = {() => setIsCreateCollectionOpen(true)}
                    onMyPins={() => setIsMyPinOpen(true) }
                    isMyPinOpen = {isMyPinOpen}
                    onHome = {() => setIsMyPinOpen(false) }
                    />


            {/*Create Pin Modal*/}
            {isCreatePinOpen && (
                <CreatePin 
                onClose = { () => setIsCreatePinOpen(false)} />
            )}
            <div className = "flex flex-1 items-center justify-center">{
            isMyPinOpen 
                ? (
                    <div
                    className='grid grid-cols-3 gap-4 w-full max-w-4xl'
                    >
                        {pins.map((pin) => {
                            return (
                                <div  key = {pin.label} className = "bg-white rounded-xl p-4 aspect-square">
                                    <img src = {pin.image} alt = {pin.key}/>
                                    <p className = "">
                                        {pin.label}
                                    </p>
                                    <p className = "text-sm">
                                    {pin.time}
                                    </p>
                                </div>
                            )
                        })}
                        
                        </div>
                )
                :   
                <MapGGAPI />
                       
        
                
            } </div>
            {/*Create Collection Modal*/}
            {isCreateCollectionOpen && (
                <CreateCollection 
                onClose = { () => setIsCreateCollectionOpen(false)} />
            )}
            </div>
        </main>
    );

}