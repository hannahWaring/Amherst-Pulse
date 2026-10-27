import React from 'react';
import {House, MapPin, Folder, Plus} from 'lucide-react';

const menuItems = [
    {label: 'Home', icon: House, route: "/home"},
    {label: 'My Pins', icon: MapPin, route: "/pins"},
    {label: 'Collections', icon: Folder, route: "/collections"}
];

export default function Sidebar({onCreatePin, onCreateCollection}) {
    const currentPath = window.location.pathname;

    return (
        <aside className="w-64 min-h-[calc(100vh-4rem)] shrink-0 border-r border-slate-200 bg-white p-4">
            <nav className = "flex flex-col gap-2">
            {menuItems.map((item) => {
                const Icon = item.icon;
                // label with icon
                return  (
                    <a
                    href={item.route}
                    key={item.label}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                       currentPath === item.route || (item.label === 'Home' && currentPath === '/')
                       ? 'bg-violet-100 text-violet-700'
                       : 'text-slate-600'
                    }`}
                    > 
                    {/* label */}
                       <Icon className="h-5 w-5" />
                       {item.label}
                    </a>
                );

            })}
        </nav>
        
{/* Pin button*/}
<div className="mt-5 border-t border-slate-100 pt-5">
  <button
    type="button"
    onClick={onCreatePin}
    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-md shadow-violet-200 hover:from-violet-700 hover:to-purple-700"
  >
    <Plus className="h-5 w-5" />
    Create Pin
  </button>
  {/* Create Collection */}
  <button
    type="button"
    onClick={onCreateCollection}
    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 font-semibold text-white shadow-md shadow-violet-200 hover:from-violet-700 hover:to-purple-700 mt-2"
  >
    <Plus className="h-5 w-5" />
    Create Collection
  </button>
</div>


            <div className = "mt-10">
                 <h3 className="mb-4 text-sm font-bold text-[#1f2757]">
                    Filters
                 </h3>

                 <label className = "mb-2 block text-xs font-semibold text-slate-600">
                    RSO/Orrganization
                 </label>

                 <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
                    <option> All RSOs</option>
                 </select>
            </div>

            {/*Collections */}
            <div className = "mt-8">
                <h3 className="mb-4 text-sm font-bold text-[#1f2757]">
                    Collections
                </h3>

                {[
                    {id: "study", title: "Study spots", color: "bg-red-100"},
                    {id: "events", title: "Club events", color: "bg-blue-100"},
                ].map((collection) => (
                    <label
                        key={collection.id}
      className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-slate-700"
                    >
                        <input type = "checkbox" defaultChecked />
                        <span
                            className="h-3 w-3 rounded-sm"
                            style={{ backgroundColor: collection.color }}
                        />
                        {collection.title}
                    </label>
                ))}
            </div>
        </aside>
    );
}
