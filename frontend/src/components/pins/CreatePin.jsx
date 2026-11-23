import React, {useState} from 'react';
import {MapPin, X, ImagePlus, Search, ArrowRight, Globe2, LockKeyhole} from 'lucide-react';



const phases = [
    'Basic Info',
    'Time'
]

export default function CreatePin({onClose, mode = 'create', pin, onSave}) {
    // title left
    const isEditing = mode === 'edit';
    const [title, setTitle] = useState(pin?.label ?? '');
    const [description, setDescription] = useState(pin?.description ?? '');
    const [Phase, setPhase] = useState(0);
    const [startTime, setStartTime] = useState(pin?.startTime ?? '');
    const [date, setDate] = useState(pin?.date ?? '');
    const [endDate, setEndDate] = useState(pin?.endDate ?? pin?.date ?? '');
    const [endTime, setEndTime] = useState(pin?.endTime ?? '');
    // save used here to save pin changes (edit Pin modal)
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const hasUnsavedChanges =
    title !== (pin?.label ?? '') ||
    description !== (pin?.description ?? '') ||
    date !== (pin?.date ?? '') ||
    endDate !== (pin?.endDate ?? pin?.date ?? '') ||
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
            <div className = "max-h-[calc(100dvh-2rem)] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">

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

        <div className = "mt-6 grid grid-cols-2 gap-4">
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
    <div className="mb-4 flex flex-wrap gap-4">
    <div>
        <label htmlFor="pin-start-date" className="mb-1 block">
            Start date
        </label>
        <input
            id="pin-start-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
        />
    </div>

    <div>
        <label htmlFor="pin-end-date" className="mb-1 block">
            End date
        </label>
        <input
            id="pin-end-date"
            type="date"
            value={endDate}
            min={date || undefined}
            onChange={(e) => setEndDate(e.target.value)}
        />
    </div>
</div>

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
{saveError && (
    <p role="alert" className="mt-4 text-sm text-red-600">
        {saveError}
    </p>
)}

{/* Footer */}
<div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">


  <button
    type = "button"
    onClick = {() => {
      if (Phase > 0) {setPhase(Phase-1);}
    }}
className={`rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white ${
    Phase === 0 ? 'invisible' : ''
}`}
  >
    Back
  </button>

<div className="ml-auto flex items-center gap-3">
  {Phase < phases.length - 1 && (
    <button
    type="button"
    onClick={() => {
        setPhase(Phase + 1);
    }}
    className="flex items-center gap-2 rounded-xl border border-violet-600 px-6 py-3 text-sm font-semibold text-violet-600 hover:bg-violet-50"
>
    Next
    <ArrowRight className="h-4 w-4" />
    </button>
  )}

        {isEditing && (
            <button
                type="button"
                disabled={saving}
                onClick={ async () => {
                    setSaving(true);
                    setSaveError('');

                    try {
                if (!onSave) {
                    throw new Error('Saving is not connected yet.');
                }

                await onSave({
                    ...pin,
                    label: title,
                    description,
                    date,
                    startTime,
                    endTime,
                    endDate
                });

                onClose();
            } catch (err) {
                setSaveError(err.message);
            } finally {
                setSaving(false);
            }
        }}
                className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white"
            >
                Save Changes
            </button>
        )}
      </div>

        {!isEditing && Phase === phases.length - 1 && (
          // wait for onSSave -> callback POST from parent component
            <button
    type="button"
    disabled={saving}
    onClick={async () => {
        if (saving) return;

        setSaving(true);
        setSaveError('');

        try {
            if (!onSave) {
                throw new Error('Creating pins is not connected yet.');
            }

            await onSave({
                label: title,
                description,
                date,
                startTime,
                endTime,
                endDate
            });

            onClose();
        } catch (err) {
            setSaveError(err.message);
        } finally {
            setSaving(false);
        }
    }}
    className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
>
    {saving ? 'Creating...' : 'Create'}
</button>
        )}
    </div>
</div>
    </div>
    );
}