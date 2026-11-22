    import React, {useState, useEffect} from 'react';
    import {Search, Pencil} from 'lucide-react';
    import CreatePin from '../components/pins/CreatePin';

    //replace initialPins with fetched data
    // const initialPins = [
    // {
    //     label: 'Pin name 1',
    //     image: '/isometric-3d-map.png',
    //     date: '2026-11-22',
//         startTime: '22:00',
//         endTime: '23:00',
//         key: 'Pin 1',
//     },
//     {
//         label: 'Pin name 2',
//         image: '/isometric-3d-map.png',
//         date: '2026-11-23',
//         startTime: '05:00',
//         endTime: '07:00',
//         key: 'Pin 2',
//     },
//     {
//         label: 'Pin name 3',
//         image: '/isometric-3d-map.png',
//         date: '2026-11-24',
//         startTime: '14:00',
//         endTime: '16:00',
//         key: 'Pin 3',
//     },
//     {
//         label: 'Pin name 4',
//         image: '/isometric-3d-map.png',
//         date: '2026-11-25',
//         startTime: '17:00',
//         endTime: '18:00',
//         key: 'Pin 4',
//     },
//     {
//         label: 'Pin name 5',
//         image: '/isometric-3d-map.png',
//         date: '2026-11-26',
//         startTime: '10:00',
//         endTime: '12:00',
//         key: 'Pin 5',
//     },
//     {
//         label: 'Pin name 6',
//         image: '/isometric-3d-map.png',
//         date: '2026-11-27',
//         startTime: '21:00',
//         endTime: '23:00',
//         key: 'Pin 6',
//     },
// ];

            // apiBaseUrl is the base URL for the API
            // accessToken used for auth
  export default function MyPins({accessToken, apiBaseUrl}) {
    const [search, setSearch] = useState('');
    const [editingPin, setEditingPin] = useState(null);
    const [pins, setPins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const filteredPins = pins.filter((pin) =>
        pin.label.toLowerCase().includes(search.toLowerCase())
    );



// effect to fetch pins
useEffect(() => {
    const controller = new AbortController();

    setPins([]);
    setError('');

    if (!apiBaseUrl || !accessToken) {
        setLoading(false);
        return () => controller.abort();
    }
        // send token to endpoints using GET/pins/mine

     async function fetchMyPins(signal) {
    const response = await fetch(`${apiBaseUrl}/pins/mine`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        signal,
    });

    if (!response.ok) {
        throw new Error(`Could not load pins (${response.status}).`);
    }

    const data = await response.json();

const pad = (value) => String(value).padStart(2, '0');
// change time to user local time
return data.map((pin) => {
    const start = pin.starts_at ? new Date(pin.starts_at) : null;
    const end = pin.ends_at ? new Date(pin.ends_at) : null;

    return {
        ...pin,
        key: pin.id,
        label: pin.title,
        image: '/isometric-3d-map.png',
        date: start
            ? `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`
            : '',
        startTime: start
            ? `${pad(start.getHours())}:${pad(start.getMinutes())}`
            : '',
        endTime: end
            ? `${pad(end.getHours())}:${pad(end.getMinutes())}`
            : '',
    };

});
}

    async function loadPins() {
        setLoading(true);
try {
            const result = await fetchMyPins(controller.signal);

            if (!controller.signal.aborted) {
                setPins(result);
            }
        } catch (err) {
        if (!controller.signal.aborted) {
            setError(err.message);
            }
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false);
            }
        }
    }

    loadPins();

    return () => controller.abort();
}, [apiBaseUrl, accessToken]);

// savepin function (for update pin) -> using PATCH /pinID
    async function savePin(updatedPin) {
        if (!apiBaseUrl || !accessToken) {
            throw new Error('API connection or login is not available.');
        }

const response = await fetch(
        `${apiBaseUrl}/pins/${updatedPin.id}`,
        {
                    method: 'PATCH',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
            },
                body: JSON.stringify({
                    title: updatedPin.label,
                    description: updatedPin.description,
            }),
        }
    );

    if (!response.ok) {
        throw new Error(`Could not save pin (${response.status}).`);
    }

    const savedPin = await response.json();

    setPins((currentPins) =>
        currentPins.map((pin) =>
            pin.id === savedPin.id
                ? {...pin, ...savedPin, label: savedPin.title}
                : pin
        )
    );
}
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
    {loading && (
        <p className="mb-6 text-slate-500">Loading pins...</p>
    )}

    {error && (
        <p role="alert" className="mb-6 text-red-600">
            {error}
        </p>
    )}

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
        onSave={savePin}
    />
)}
            </section>
        );
    }
