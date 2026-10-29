import { useContext, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { LayoutContext, rowSpacing } from './LayoutContext';

export default function ComingSoonList({ items }) {
  const [clickedItem, setClickedItem] = useState(null);
  const layout = useContext(LayoutContext);

  return (
    <div className="flex flex-col">
      {items.map((item) =>
        item.value ? (
          <div
            key={item.label}
            className={`flex items-center justify-between border-b border-slate-100 last:border-b-0 dark:border-[#30363d] ${rowSpacing[layout]}`}
          >
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">{item.value}</span>
          </div>
        ) : (
          <button
            key={item.label}
            type="button"
            onClick={() => setClickedItem(item.label)}
            className={`flex items-center justify-between border-b border-slate-100 text-left last:border-b-0 dark:border-[#30363d] ${rowSpacing[layout]}`}
          >
            <span className="text-sm font-medium text-slate-700 hover:text-violet-700 dark:text-slate-200 dark:hover:text-violet-300">
              {item.label}
            </span>
            {clickedItem === item.label ? (
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/20 dark:text-violet-400">
                Coming soon
              </span>
            ) : (
              <ChevronRight className="h-4 w-4 text-slate-400" />
            )}
          </button>
        ),
      )}
    </div>
  );
}
