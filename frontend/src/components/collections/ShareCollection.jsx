import { useState } from "react";
import { Check, Globe2, Link2, LockKeyhole, X } from "lucide-react";
import PeopleWithAccess from "./PeopleWithAccess";

// Share dialog for one collection (mocked: changes only live in the placeholder data).
export default function ShareCollection({ collection, currentUsername, onClose, onSave }) {
  const initialMembers = collection.members ?? [];
  const [members, setMembers] = useState(initialMembers);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const hasUnsavedChanges = JSON.stringify(members) !== JSON.stringify(initialMembers);
  const isPublic = collection.visibility === "public";
  const collectionLink = `${window.location.origin}/collections/${collection.id}`;

  const handleClose = () => {
    if (!hasUnsavedChanges || window.confirm("You have unsaved changes. Are you sure you want to exit?")) {
      onClose();
    }
  };

  const handleDone = () => {
    onSave?.({ ...collection, members });
    onClose();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(collectionLink);
      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", collectionLink);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-collection-heading"
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 id="share-collection-heading" className="truncate text-2xl font-bold text-[#1f2757]">
              Share "{collection.title}"
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              {isPublic ? (
                <Globe2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              ) : (
                <LockKeyhole className="h-4 w-4 shrink-0" aria-hidden="true" />
              )}
              {isPublic
                ? "Public: anyone can find and view it. Add collaborators to let them edit."
                : "Private: only people added here can open it."}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close share dialog"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6">
          <PeopleWithAccess
            ownerUsername={collection.ownerUsername}
            members={members}
            onMembersChange={setMembers}
            visibility={collection.visibility}
            currentUsername={currentUsername}
          />
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-2 rounded-xl border border-violet-200 px-4 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-50"
          >
            {isLinkCopied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            {isLinkCopied ? "Link copied" : "Copy link"}
          </button>
          <button
            type="button"
            onClick={handleDone}
            className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
