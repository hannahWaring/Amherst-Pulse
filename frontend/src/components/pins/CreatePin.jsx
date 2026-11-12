import React, {useState} from 'react';
import {MapPin, X, ImagePlus, Search, ArrowRight, Globe2, LockKeyhole} from 'lucide-react';



const phases = [
    'Basic Info',
    'Time',
    'Sharing'
]

export default function CreatePin({onClose, mode = 'create', pin, onSave}) {
    // title left
    const isEditing = mode === 'edit';
    const [title, setTitle] = useState(pin?.label ?? '');
    const [description, setDescription] = useState(pin?.description ?? '');
    const [visibility, setVisibility] = useState(pin?.visibility ?? 'private');  
    const [Phase, setPhase] = useState(0);
    const [startTime, setStartTime] = useState(pin?.startTime ?? '');
    const [date, setDate] = useState(pin?.date ?? '');
    const [endTime, setEndTime] = useState(pin?.endTime ?? '');
    const hasUnsavedChanges =
    title !== (pin?.label ?? '') ||
    description !== (pin?.description ?? '') ||
    visibility !== (pin?.visibility ?? 'private') ||
    date !== (pin?.date ?? '') ||
    startTime !== (pin?.startTime ?? '') ||
    endTime !== (pin?.endTime ?? '');

const handleClose = () => {
    if (
        !hasUnsavedChanges ||
        window.confirm('You have unsaved changes. Are you sure you want to exit?')
    ) {
        onClose();
    }
};
    // description o the right
    return (
        <div className = "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
            <div className = "w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl">

                {/* Header*/}
                <div className = "flex items-center justify-between">
                    <div className = "flex items-center gap-3">
                    <MapPin className = "h-6 w-6 text-violet-600" />
                    <div className ="text-left">
                        <h2 className = "text-2xl font-bold text-[#1f2757]">
                            {isEditing ? 'Edit Pin' : 'Create New Pin'}
                        </h2>
                    </div>
            </div>
            <button
                type ="button"
                onClick = {handleClose}
                aria-label = "Close Modal"
                className = "rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
                <X className  ="h-5 w-5" />
                </button> 
        </div>
        {/*Phases Navigation*/}
        
        <div className = "mt-6 grid grid-cols-3 gap-4">
            {phases.map((phase, index) => (
                //  key phase is for changing between key states 
                <div key = {phase} className = "flex flex-col gap-3">
                    <div className = "flex items-center gap-2">
                        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
            index === Phase 
            ? 'bg-violet-600 text-white'
            : 'bg-violet-50 text-slate-400'
          }`}
        > 
        {index+1}
        </div>
        <span 
        className = {`text-sm font-medium ${
            index == Phase
            ? 'text-violet-700' 
            : 'text-slate-400'

            }`} 
        >
            {phase}
        </span>
        </div>

        <div
        className={`h-1 rounded-full ${
          index === Phase
          ? 'bg-violet-600' 
          : 'bg-violet-100'
        }`}
      />
    </div>

  ))}
</div>

        
{/* Phase 1 */}
{Phase === 0 && (
<div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

  {/* Location -left */}
  <div className="rounded-2xl bg-[#F8F6FF] p-5">
    <h3 className="mb-3 text-lg font-bold text-[#1f2757]">
      Where is your pin?
    </h3>

    <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-violet-200 bg-white">
      <MapPin className="h-10 w-10 text-violet-500" />
      <p className="text-sm text-slate-500">
        No location selected
      </p>
    </div>

    <label className="mt-5 block text-sm font-semibold text-[#1f2757]">
      Location *
    </label>

    <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
      <Search className="h-5 w-5 text-slate-400" />

      <input
        type="text"
        placeholder="Search or select on map..."
        className="w-full bg-transparent text-sm text-slate-700 outline-none"
      />
    </div>

  </div>

  {/* RIGHT — Pin Details */}
  <div className="flex flex-col gap-5 py-2">
    <div>
      <h3 className="text-lg font-bold text-[#1f2757]">
        Pin description.
      </h3>
    </div>

    {/*title */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#1f2757]">
        Pin Title <span className="text-red-500">*</span>
      </label>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Du Bois library"
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
      />
    </div>

    {/* description */}
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#1f2757]">
        Description
      </label>

      <textarea
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What's happening here?"
        className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
      />
    </div>
  </div>
</div>)}

{/* Phase 2*/}
{Phase ==1 && (
<div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

  {/* Location -left */}
  <div className="rounded-2xl bg-[#F8F6FF] p-5">
    <h3 className="mb-3 text-lg font-bold text-[#1f2757]">
      Event
    </h3>
    {/*dropdown for time... to ... */}
    <input
    type="date"
    value={date}
    onChange={(e) => setDate(e.target.value)}
/>

<div className="flex items-center gap-4">
    <div>
        <label>From Time</label>
        <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
        />
    </div>

    <div>
        <label>To Time</label>
        <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
        />
    </div>
</div>
  </div>
</div>)}

{/* Phase 3*/}
{Phase === 2 && (
    <fieldset className="mt-6">
        <legend className="mb-3 text-sm font-semibold text-[#1f2757]">
            Who can see this pin?
        </legend>

        <div className="flex flex-col gap-3">
            {[
                {
                    value: 'public',
                    label: 'Public',
                    detail: 'Anyone can find and view this pin.',
                    Icon: Globe2,
                },
                {
                    value: 'private',
                    label: 'Private',
                    detail: 'Only you can view this pin.',
                    Icon: LockKeyhole,
                },
            ].map((option) => (
                <label
                    key={option.value}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4"
                >
                    <input
                        type="radio"
                        name="pin-visibility"
                        value={option.value}
                        checked={visibility === option.value}
                        onChange={() => setVisibility(option.value)}
                        className="mt-1 accent-violet-600"
                    />

                    <option.Icon
                        className="mt-0.5 h-5 w-5 shrink-0 text-violet-600"
                        aria-hidden="true"
                    />

                    <span>
                        <span className="block text-sm font-semibold text-[#1f2757]">
                            {option.label}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                            {option.detail}
                        </span>
                    </span>
                </label>
            ))}
        </div>
    </fieldset>
)}

{/* Footer */}
<div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">


  <button
    type = "button"
    onClick = {() => { if (Phase > 0) {setPhase(Phase-1);} }}
className={`rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white ${
    Phase === 0 ? 'invisible' : ''
}`}
  >
    Back
  </button>
    <button
    type="button"
    onClick={() => {
        if (Phase === 2) {
            if (isEditing) {
                onSave?.({
                    ...pin,
                    label: title,
                    description,
                    visibility,
                    date,
                    startTime,
                    endTime
                });
            }
            onClose();
        } else {
            setPhase(Phase + 1);
        }
    }}
    className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white"
>
    {Phase === 2 ? (isEditing ? 'Save Changes' : 'Create') : 'Next'}
    <ArrowRight className="h-4 w-4" />
</button>

</div>


    </div>
    </div>
    );
}