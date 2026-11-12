import React from 'react';
import{APIProvider, Map, Marker, InfoWindow} from '@vis.gl/react-google-maps';

const AMHERST_CENTER = {
    lat: 42.373611,
    lng: -72.519722
};

const colors = [
  '#8B5CF6', 
  '#14B8A6', 
  '#F59E0B',
  '#EC4899',
  '#3B82F6', 
  '#EF4444', 
  '#22C55E',
  '#F97316', 
];

const Pins = 
Array.from({ length: 20 }, (_, i) => ({
  id: i,
  latitude: 42.3732 + (Math.sin(i * 2.4) * 0.012),
  longitude: -72.5199 + (Math.cos(i * 1.8) * 0.015),
  color: colors[i % colors.length],
}));
export default function MapGGAPI() {
    return (
        <APIProvider apiKey = {import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <div className  = "h-full w-full">
                <Map
                    defaultCenter={AMHERST_CENTER}
                    defaultZoom={12}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    className = "h-full w-full"
                >
                    {Pins.map((pin) => (
                        <Marker
                            key={pin.id}
                            position={{ 
                                lat: pin.latitude, 
                                lng: pin.longitude }}
                            icon={{
                                path: "M 0,-20 C -12,-20 -20,-11 -20,0 C -20,13 0,30 0,30 C 0,30 20,13 20,0 C 20,-11 12,-20 0,-20 Z",
                                fillColor: pin.color,
                                fillOpacity: 1,
                                scale: 0.8,
                                strokeColor: 'white',
                                strokeWeight: 2,
                                        anchor: { x: 0, y: 30 },

                            }}
                        />
                                                    
                    ))}
                </Map>

                            </div>
        </APIProvider>
    );
}
