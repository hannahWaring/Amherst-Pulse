import React from 'react';
import { MapPin, Search, Bell, UserCircle } from 'lucide-react';

export default function Navbar() {
    return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-[#30363d] dark:bg-[#161b22]">

        {/* Logo */}
        <div className = "flex items-center gap-2">
            <div className = "flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500">
                <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className = "text-xl font-bold text-[#1f2757] dark:text-white" >
                Campus <span className="text-[#6b4df6]">Pulze</span>
            </span>
        </div>

        {/*Search*/}
              <div className="mx-6 flex w-full max-w-lg items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2 dark:border-[#30363d] dark:bg-[#0d1117]">
                <Search className="h-5 w-5 text-slate-400" />
                <input 
                type = "text"
                placeholder = "Search pins, collections or RSOs.."
                className = "w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 dark:text-slate-200"
              />
              </div>

              {/*Account*/}
              <div className = "flex items-center gap-5">
                <button type="button" aria-label = "Notifications">
                    <Bell className = "h-5 w-5 text-slate-600 dark:text-slate-300" />
                </button>
                <a href="/settings" aria-label = "Settings">
                    <UserCircle className = "h-8 w-8 text-violet-600 dark:text-violet-400" />
                </a>
              </div>
              </header>
    );
}
