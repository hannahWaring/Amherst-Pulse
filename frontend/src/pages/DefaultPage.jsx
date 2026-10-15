import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MapGGAPI from '../components/map_gg_api';
export default function DefaultPage() {
    return (
        <main className = "min-h-screen bg-[#F8F9FE] ">
            <Navbar />

            <div className = "flex">
                <Sidebar />

            <div className = "flex flex-1 items-center justify-center">
                <MapGGAPI />
            </div>
            </div>
        </main>
    );

}