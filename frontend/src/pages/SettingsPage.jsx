import { useState } from 'react';
import { Bell, CircleHelp, Info, Palette, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CreatePin from '../components/pins/CreatePin';
import CreateCollection from '../components/collections/CreateCollection';
import AccountTab from '../components/settings/AccountTab';
import NotificationsTab from '../components/settings/NotificationsTab';
import AppearanceTab from '../components/settings/AppearanceTab';
import HelpTab from '../components/settings/HelpTab';
import AboutTab from '../components/settings/AboutTab';
import { LayoutContext } from '../components/settings/LayoutContext';
import { DEFAULT_FONT_SIZE, textSizeVariables } from '../components/settings/fontSize';
import useSystemPrefersDark from '../components/settings/useSystemPrefersDark';

const tabs = [
  { id: 'account', label: 'Account', icon: User, Content: AccountTab },
  { id: 'notifications', label: 'Notifications', icon: Bell, Content: NotificationsTab },
  { id: 'appearance', label: 'Appearance & Accessibility', icon: Palette, Content: AppearanceTab },
  { id: 'help', label: 'Help & Support', icon: CircleHelp, Content: HelpTab },
  { id: 'about', label: 'About', icon: Info, Content: AboutTab },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account');
  const [theme, setTheme] = useState('Light');
  const [layout, setLayout] = useState('Default');
  const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
  const [isCreatePinOpen, setIsCreatePinOpen] = useState(false);
  const [isCreateCollectionOpen, setIsCreateCollectionOpen] = useState(false);

  const systemPrefersDark = useSystemPrefersDark();
  const isDark = theme === 'Dark' || (theme === 'System' && systemPrefersDark);

  const sharedTabProps = {
    theme,
    onThemeChange: setTheme,
    layout,
    onLayoutChange: setLayout,
    fontSize,
    onFontSizeChange: setFontSize,
  };

  return (
    <main
      className={`flex h-screen flex-col overflow-hidden ${
        isDark ? 'dark bg-[#0d1117]' : 'bg-[#F8F9FE]'
      }`}
    >
      <div className="shrink-0">
        <Navbar />
      </div>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        <Sidebar
          onCreatePin={() => setIsCreatePinOpen(true)}
          onCreateCollection={() => setIsCreateCollectionOpen(true)}
        />

        <section
          style={textSizeVariables(fontSize)}
          className="min-h-0 min-w-0 flex-1 overflow-y-auto p-6 md:p-10"
        >
          <div className="mx-auto max-w-5xl pb-6">
            <h1 className="text-2xl font-bold text-[#1f2757] dark:text-white">Settings</h1>

            <div className="mt-6 flex flex-col gap-6 md:flex-row">
              <nav aria-label="Settings sections" className="flex shrink-0 flex-col gap-1 md:w-60">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      aria-current={activeTab === tab.id ? 'page' : undefined}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium ${
                        activeTab === tab.id
                          ? 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#30363d] dark:bg-[#161b22]">
                <LayoutContext.Provider value={layout}>
                  {tabs.map((tab) => {
                    const Content = tab.Content;
                    return (
                      <div key={tab.id} hidden={activeTab !== tab.id}>
                        <h2 className="mb-4 text-xl font-bold text-[#1f2757] dark:text-white">
                          {tab.label}
                        </h2>
                        <Content {...sharedTabProps} />
                      </div>
                    );
                  })}
                </LayoutContext.Provider>
              </div>
            </div>
          </div>
        </section>
      </div>

      {isCreatePinOpen && <CreatePin onClose={() => setIsCreatePinOpen(false)} />}
      {isCreateCollectionOpen && (
        <CreateCollection onClose={() => setIsCreateCollectionOpen(false)} />
      )}
    </main>
  );
}
