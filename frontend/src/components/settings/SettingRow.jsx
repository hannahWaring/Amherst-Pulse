import { useContext } from 'react';
import { LayoutContext, rowSpacing } from './LayoutContext';

export default function SettingRow({ label, children }) {
  const layout = useContext(LayoutContext);

  return (
    <div
      className={`flex items-center justify-between gap-4 border-b border-slate-100 last:border-b-0 dark:border-[#30363d] ${rowSpacing[layout]}`}
    >
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      {children}
    </div>
  );
}
