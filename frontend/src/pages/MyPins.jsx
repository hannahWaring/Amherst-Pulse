    import React, {useState} from 'react';
    import {Search, Pencil} from 'lucide-react';
    import CreatePin from '../components/pins/CreatePin';

    const initialPins = [
        {label: 'Pin name 1', image : `/isometric-3d-map.png `, time : `10pm - 11pm`, key: `Pin 1`}, 
        {label: 'Pin name 2', image : `/isometric-3d-map.png `, time : `5am - 7am`, key: `Pin 2`},
        {label: 'Pin name 3', image : `/isometric-3d-map.png `, time : `Tuesday - Thursday`, key: `Pin 3`},
        {label: 'Pin name 4', image : `/isometric-3d-map.png `, time : `October 5th 5pm`, key: `Pin 4`}, 
        {label: 'Pin name 5', image : `/isometric-3d-map.png `, time : `2026 October 27th `, key: `Pin 5`},
        {label: 'Pin name 6', image : `/isometric-3d-map.png `, time : `2026 October 27th 9pm - 11pm`, key: `Pin 6`}

    ];
    export default function MyPins() {
        const [search, setSearch] = useState('');
        const [editingPin, setEditingPin] = useState(null);
        const [pins, setPins] = useState(initialPins);
        const filteredPins = pins.filter((pin) =>
            pin.label.toLowerCase().includes(search.toLowerCase())
        );

        return (
            <section className="w-full self-start p-10">
    <h1 className="mb-6 text-2xl font-bold text-[#1f2757]">
        My Pins
    </h1>
        <div className="mb-6 flex max-w-xl items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <Search className="h-5 w-5 shrink-0 text-slate-400" />
        <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search my pins"
            className="w-full bg-transparent text-sm text-slate-700 outline-none"
        />
    </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                   {filteredPins.map((pin) => {
                                               return (
                                                   <div
    key={pin.key}
    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
>
    <img
        src={pin.image}
        alt={pin.label}
        className="h-44 w-full bg-violet-50 object-cover"
    />

    <div className="p-6">
    <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold text-[#1f2757]">
            {pin.label}
        </h2>

        <button
            type="button"
            onClick={() => setEditingPin(pin)}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            aria-label={`Edit ${pin.label}`}
        >
            <Pencil className="h-4 w-4" />
            Edit
        </button>
    </div>

    <p className="mt-3 text-sm text-slate-500">
        {pin.date || pin.startTime || pin.endTime
    ? [
        pin.date && new Date(`${pin.date}T00:00:00`).toLocaleDateString(
            'en-US',
            {month: 'short', day: 'numeric', year: 'numeric'}
        ),
        [pin.startTime, pin.endTime]
            .filter(Boolean)
            .map((time) =>
                new Date(`2000-01-01T${time}`).toLocaleTimeString(
                    'en-US',
                    {hour: 'numeric', minute: '2-digit'}
                )
            )
            .join(' - '),
    ].filter(Boolean).join(' · ')
    : pin.time}
    </p>
</div>
</div>
                                               )
                                           })}
            </div>
            {editingPin && (
    <CreatePin
        mode="edit"
        pin={editingPin}
        onClose={() => setEditingPin(null)}
        onSave={(updatedPin) => {
        setPins((currentPins) =>
            currentPins.map((pin) =>
                pin.key === updatedPin.key ? updatedPin : pin
            )
        );
    }}
    />
)}
            </section>
        );
    }
