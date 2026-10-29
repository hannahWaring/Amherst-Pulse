import { useState } from 'react';
import { X } from 'lucide-react';

const passwordFields = [
  { id: 'current', label: 'Current password' },
  { id: 'new', label: 'New password' },
  { id: 'confirm', label: 'Confirm new password' },
];

export default function ChangePasswordModal({ onClose }) {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#161b22]"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1f2757] dark:text-white">Change password</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          {passwordFields.map((field) => (
            <label key={field.id} className="block text-sm font-semibold text-[#1f2757] dark:text-slate-100">
              {field.label}
              <input
                type="password"
                value={passwords[field.id]}
                onChange={(event) =>
                  setPasswords((current) => ({ ...current, [field.id]: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-700 outline-none focus:border-violet-500 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-slate-100"
              />
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Update password
          </button>
        </div>
      </form>
    </div>
  );
}
