import { useState } from 'react';
import Toggle from './Toggle';
import SettingRow from './SettingRow';

const notificationOptions = [
  { id: 'push', label: 'Push notifications' },
  { id: 'email', label: 'Email notifications' },
  { id: 'eventReminders', label: 'Event reminders' },
  { id: 'clubUpdates', label: 'Club/event updates' },
  { id: 'announcements', label: 'Announcements' },
];

const frequencyOptions = ['Instant', 'Daily summary', 'Weekly summary'];

export default function NotificationsTab() {
  const [enabled, setEnabled] = useState({
    push: true,
    email: true,
    eventReminders: true,
    clubUpdates: true,
    announcements: true,
  });
  const [frequency, setFrequency] = useState('Instant');

  return (
    <div className="flex flex-col">
      {notificationOptions.map((option) => (
        <SettingRow key={option.id} label={option.label}>
          <Toggle
            label={option.label}
            checked={enabled[option.id]}
            onChange={(value) => setEnabled((current) => ({ ...current, [option.id]: value }))}
          />
        </SettingRow>
      ))}
      <SettingRow label="Notification frequency">
        <select
          value={frequency}
          onChange={(event) => setFrequency(event.target.value)}
          aria-label="Notification frequency"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-[#30363d] dark:bg-[#0d1117] dark:text-slate-200"
        >
          {frequencyOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </SettingRow>
    </div>
  );
}
