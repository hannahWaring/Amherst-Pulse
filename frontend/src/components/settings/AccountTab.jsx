import { useRef, useState } from 'react';
import { Camera, KeyRound, LogOut, Trash2, UserCircle } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal';
import DeleteAccountModal from './DeleteAccountModal';

const mockUser = {
  name: 'Jane Doe',
  email: 'jane@umass.edu',
  username: 'janedoe',
};

const accountFields = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'email', label: 'Email', type: 'email' },
  { id: 'username', label: 'Username', type: 'text' },
];

const secondaryButton =
  'flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-[#30363d] dark:text-slate-200 dark:hover:bg-white/5';

export default function AccountTab() {
  const fileInputRef = useRef(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [form, setForm] = useState(mockUser);
  const [isSaved, setIsSaved] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    setPhotoUrl(URL.createObjectURL(file));
    event.target.value = '';
  };

  const handleRemovePhoto = () => {
    URL.revokeObjectURL(photoUrl);
    setPhotoUrl(null);
  };

  const handleFieldChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
    setIsSaved(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    setIsSaved(true);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-5">
        {photoUrl ? (
          <img src={photoUrl} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
        ) : (
          <UserCircle className="h-20 w-20 text-violet-600 dark:text-violet-400" />
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            <Camera className="h-4 w-4" />
            Change photo
          </button>
          {photoUrl && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
            >
              Remove photo
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        {accountFields.map((field) => (
          <label key={field.id} className="block text-sm font-semibold text-[#1f2757] dark:text-slate-100">
            {field.label}
            <input
              type={field.type}
              value={form[field.id]}
              onChange={handleFieldChange(field.id)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-normal text-slate-700 outline-none focus:border-violet-500 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-slate-100"
            />
          </label>
        ))}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Save
          </button>
          {isSaved && <span className="text-sm text-slate-500 dark:text-slate-400">Changes saved</span>}
        </div>
      </form>

      <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6 dark:border-[#30363d]">
        <button type="button" onClick={() => setIsPasswordOpen(true)} className={secondaryButton}>
          <KeyRound className="h-4 w-4" />
          Change password
        </button>
        <button type="button" className={secondaryButton}>
          <LogOut className="h-4 w-4" />
          Log out
        </button>
        <button
          type="button"
          onClick={() => setIsDeleteOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-500/40 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
          Delete account
        </button>
      </div>

      {isPasswordOpen && <ChangePasswordModal onClose={() => setIsPasswordOpen(false)} />}
      {isDeleteOpen && <DeleteAccountModal onClose={() => setIsDeleteOpen(false)} />}
    </div>
  );
}
