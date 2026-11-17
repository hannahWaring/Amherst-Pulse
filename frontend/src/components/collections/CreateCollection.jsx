import React, { useRef, useState } from "react";
import {
  Upload,
  NotebookText,
  X,
  Search,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Check,
  Globe2,
  LockKeyhole,
  UserRoundPlus,
} from "lucide-react";
import { publicCollections } from "../../data/publicCollections";

const phases = ["Basic Info", "Add Pins", "Sharing"];

export default function CreateCollection({ onClose, mode = "create", collection, onSave }) {
  const isEditing = mode === "edit";
  const initialValues = useRef({
    title: collection?.title ?? "",
    rso: collection?.rso ?? "",
    description: collection?.description ?? "",
    image: collection?.image ?? "",
    pinKeys: collection?.pins.map((pin) => pin.key ?? `${collection.id}-${pin.id}`) ?? [],
    visibility: collection?.visibility ?? "private",
  }).current;
  const [phase, setPhase] = useState(0);
  const [title, setTitle] = useState(initialValues.title);
  const [rso, setRso] = useState(initialValues.rso);
  const [description, setDescription] = useState(initialValues.description);
  const [image, setImage] = useState(initialValues.image);
  const [pinQuery, setPinQuery] = useState("");
  const [selectedPins, setSelectedPins] = useState(initialValues.pinKeys);
  const [visibility, setVisibility] = useState(initialValues.visibility);
  const [collaboratorQuery, setCollaboratorQuery] = useState("");

  const mockPins = publicCollections.flatMap((collection) =>
    collection.pins.map((pin) => ({
      ...pin,
      key: `${collection.id}-${pin.id}`,
    }))
  );
  const filteredPins = mockPins.filter((pin) =>
    `${pin.name} ${pin.location}`.toLowerCase().includes(pinQuery.trim().toLowerCase())
  );
  const hasUnsavedChanges =
    title !== initialValues.title ||
    rso !== initialValues.rso ||
    description !== initialValues.description ||
    image !== initialValues.image ||
    visibility !== initialValues.visibility ||
    JSON.stringify([...selectedPins].sort()) !== JSON.stringify([...initialValues.pinKeys].sort());

  const handleClose = () => {
    if (!hasUnsavedChanges || window.confirm("You have unsaved changes. Are you sure you want to exit?")) {
      onClose();
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImage(reader.result);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleNext = () => {
    if (phase < phases.length - 1) setPhase((prevPhase) => prevPhase + 1);
  };
  const handleBack = () => {
    setPhase((prevPhase) => prevPhase - 1);
  };
  const handleSave = () => {
    if (isEditing) {
      const pins = selectedPins
        .map((key) => mockPins.find((pin) => pin.key === key))
        .filter(Boolean)
        .map((pin) => ({ ...pin, id: pin.key }));

      onSave?.({
        ...collection,
        title,
        rso,
        description,
        image,
        pins,
        visibility,
      });
    }
    setPhase(0);
    onClose();
  };

  function phase1() {
    return (
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Location -left */}
        <div className="rounded-2xl bg-[#F8F6FF] p-5">
          <label className="relative flex h-48 cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-dashed border-violet-200 bg-white">
            {image ? (
              <img src={image} alt="Collection cover preview" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <Upload className="h-10 w-10 text-violet-500" />
            )}
            <span className="relative rounded-lg bg-white/90 px-3 py-2 text-sm font-medium text-violet-700">
              {image ? "Change cover photo" : "Upload cover photo"}
            </span>
            <input
              type="file"
              accept="image/*"
              aria-label="Upload a collection cover photo"
              onChange={handleImageChange}
              className="sr-only"
            />
          </label>

          <p className="mt-3 text-xs text-slate-400">
            Upload a cover photo for your collection.
          </p>
        </div>

        {/* Collection details */}
        <div className="flex flex-col gap-5 py-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2757]">
              Collection Title <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Study Spots on Campus"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2757]">
              RSO / Organization
            </label>
            <input
              type="text"
              value={rso}
              onChange={(e) => setRso(e.target.value)}
              placeholder="e.g. Hiking Club"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#1f2757]">
              Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's your collection all about?"
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </div>
        </div>
      </div>
    );
  }
  function phase2() {
    return (
      <div className="mt-2">
        <label className="mb-2 block text-sm font-semibold text-[#1f2757]" htmlFor="collection-pin-search">
          Search My Pins
        </label>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            id="collection-pin-search"
            type="search"
            value={pinQuery}
            onChange={(event) => setPinQuery(event.target.value)}
            placeholder="Search pins by name or location..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none"
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">Select pins to add them to this collection.</p>
        <div className="mt-4 grid max-h-64 grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
          {filteredPins.map((pin) => {
            const isSelected = selectedPins.includes(pin.key);
            return (
              <button
                key={pin.key}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedPins((current) =>
                  isSelected ? current.filter((key) => key !== pin.key) : [...current, pin.key]
                )}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                  isSelected ? "border-violet-500 bg-violet-50" : "border-slate-200 bg-white hover:border-violet-300"
                }`}
              >
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[#1f2757]">{pin.name}</span>
                  <span className="mt-1 block text-xs text-slate-500">{pin.location}</span>
                </span>
                {isSelected && <Check className="h-5 w-5 shrink-0 text-violet-600" />}
              </button>
            );
          })}
          {filteredPins.length === 0 && (
            <p className="col-span-full py-6 text-center text-sm text-slate-500">No pins match your search.</p>
          )}
        </div>
        <p className="mt-3 text-sm font-medium text-slate-600">{selectedPins.length} pins selected</p>
      </div>
    );
  }

  function phase3() {
    return (
      <div className="mt-2 grid grid-cols-1 gap-8 md:grid-cols-2">
        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-[#1f2757]">Who can see this collection?</legend>
          <div className="flex flex-col gap-3">
            {[
              { value: "public", label: "Public", detail: "Anyone can find and view this collection.", Icon: Globe2 },
              { value: "private", label: "Private", detail: "Only you and collaborators can view it.", Icon: LockKeyhole },
            ].map((option) => (
              <label key={option.value} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4">
                <input
                  type="radio"
                  name="collection-visibility"
                  value={option.value}
                  checked={visibility === option.value}
                  onChange={() => setVisibility(option.value)}
                  className="mt-1 accent-violet-600"
                />
                <option.Icon className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" aria-hidden="true" />
                <span>
                  <span className="block text-sm font-semibold text-[#1f2757]">{option.label}</span>
                  <span className="mt-1 block text-xs text-slate-500">{option.detail}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="collection-collaborator-search" className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#1f2757]">
            <UserRoundPlus className="h-5 w-5 text-violet-600" aria-hidden="true" />
            Add collaborators
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
            <Search className="h-5 w-5 shrink-0 text-slate-400" />
            <input
              id="collection-collaborator-search"
              type="search"
              value={collaboratorQuery}
              onChange={(event) => setCollaboratorQuery(event.target.value)}
              placeholder="Search by username..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none"
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Username search and collaborator invitations will be connected when user data is available.
          </p>
        </div>
      </div>
    );
  }

  const renderPhaseContent = () => {
    switch (phase) {
      case 0:
        return phase1();
      case 1:
        return phase2();
      case 2:
        return phase3();
      default:
        return <div>Unknown Phase</div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl">
        {/* Header*/}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NotebookText className="h-6 w-6 text-violin-600" />
            <div className="text-left">
              <h2 className="text-2xl font-bold text-[#1f2757]">
                {isEditing ? "Edit Collection" : "Create New Collection"}
              </h2>
              <p className="text-sm text-slate-500">
                {isEditing ? "Update your collection and pins." : "Create a collection of pins!"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close Modal"
            className="rounded-lg-p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/*Phases Navigation visual*/}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {phases.map((phaseName, index) => (
            <div key={phaseName} className="flex flex9col gap-3">
              <button
                type="button"
                onClick={() => setPhase(index)}
                aria-current={index === phase ? "step" : undefined}
                className="flex items-center gap-2 text-left"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    index === phase
                      ? "bg-violet-600 text-white"
                      : "bg-violet-50 text-slate-400"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-sm font-medium ${
                    index === phase ? "text-violet-700" : "text-slate-400"
                  }`}
                >
                  {phaseName}
                </span>
              </button>

              <div
                className={`h-1 rounded-full ${
                  index === phase ? "bg-violet-600" : "bg-violet-100"
                }`}
              />
            </div>
          ))}
        </div>

        {/* Render Based on Phase*/}
        <div className="mt-6">{renderPhaseContent()}</div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={handleBack}
            className={`flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white ${phase === 0 ? "invisible" : ""}`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            hidden={phase === phases.length - 1}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleSave}
            hidden={phase !== phases.length - 1}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white"
          >
            {isEditing ? "Save Changes" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
