import React, { useState } from "react";
import {
  Upload,
  NotebookText,
  X,
  ImagePlus,
  Search,
  ArrowRight,
} from "lucide-react";

const phases = ["Basic Info", "Add Pins", "Sharing"];

export default function CreateCollection({ onClose }) {
  //handline phases
  const [phase, setPhase] = useState(0);
  const handleNext = () => {
    if (phase < phases.length - 1) setPhase((prevPhase) => prevPhase + 1);
  };
  const handleCancel = () => {
    setPhase(0); // Reset to the first phase
    onClose(); // Close the modal
  };
  const handleSave = () => {
    //send to DB Here
    setPhase(0); // Reset to the first phase
    onClose(); // Close the modal
  };
  //Ai-gen code ^^ check
  {
    /* handle phase rendering */
  }
  const renderPhaseContent = () => {
    switch (phase) {
      case 0:
        return (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Location -left */}
            <div className="rounded-2xl bg-[#F8F6FF] p-5">
              <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-violet-200 bg-white">
                <Upload className="h-10 w-10 text-violet-500" />
              </div>

              <p className="mt-3 text-xs text-slate-400">
                Upload a cover photo for your collection.
              </p>
            </div>

            {/* RIGHT — Pin Details */}
            <div className="flex flex-col gap-5 py-2">
              {/*title */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f2757]">
                  Pin Title <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Study Spots on Campus"
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
                  placeholder="What's your collection all about?"
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>
          </div>
        );
      case 1:
        return <div>Add Pins Content</div>;
      case 2:
        return <div>Sharing Content</div>;
      default:
        return <div>Unknown Phase</div>;
    }
  };

  // title left
  const [title, setTitle] = useState("");
  // description o the right
  const [description, setDescription] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl">
        {/* Header*/}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NotebookText className="h-6 w-6 text-violin-600" />
            <div className="text-left">
              <h2 className="text-2xl font-bold text-[#1f2757]">
                Create New Collection
              </h2>
              <p className="text-sm text-slate-500">
                Create a collection of pins!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Modal"
            className="rounded-lg-p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/*Phases Navigation visual*/}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {phases.map((phase, index) => (
            <div key={phase} className="flex flex9col gap-3">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    index === 0
                      ? "bg-violet-600 text-white"
                      : "bg-violet-50 text-slate-400"
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-sm font-medium ${
                    index == 0 ? "text-violet-700" : "text-slate-400"
                  }`}
                >
                  {phase}
                </span>
              </div>

              <div
                className={`h-1 rounded-full ${
                  index === 0 ? "bg-violet-600" : "bg-violet-100"
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
            onClick={onClose}
            className="rounded-xl px-5 py-3 text-sm font-medium text-slate-500 hover:bg-slate-100"
          >
            Cancel
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
