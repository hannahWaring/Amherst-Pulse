import { useState } from 'react';
import Toggle from './Toggle';
import SettingRow from './SettingRow';
import { DEFAULT_FONT_SIZE } from './fontSize';

const themeOptions = ['Light', 'Dark', 'System'];
const layoutOptions = ['Compact', 'Default', 'Comfortable'];
const SNAP_DISTANCE = 0.75;

function OptionPicker({ options, selected, onSelect, label }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-xl bg-slate-100 p-1 dark:bg-[#0d1117]">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={selected === option}
          onClick={() => onSelect(option)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            selected === option
              ? 'bg-white text-violet-700 shadow-sm dark:bg-[#30363d] dark:text-violet-400'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default function AppearanceTab({
  theme,
  onThemeChange,
  layout,
  onLayoutChange,
  fontSize,
  onFontSizeChange,
}) {
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleFontSizeChange = (event) => {
    const value = Number(event.target.value);
    const isNearDefault = Math.abs(value - DEFAULT_FONT_SIZE) < SNAP_DISTANCE;
    onFontSizeChange(isNearDefault ? DEFAULT_FONT_SIZE : Math.round(value));
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Appearance</h3>
        <SettingRow label="Theme">
          <OptionPicker options={themeOptions} selected={theme} onSelect={onThemeChange} label="Theme" />
        </SettingRow>
        <SettingRow label="Layout">
          <OptionPicker options={layoutOptions} selected={layout} onSelect={onLayoutChange} label="Layout" />
        </SettingRow>
      </div>

      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Accessibility</h3>
        <SettingRow label="Font size">
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="12"
              max="20"
              step="0.1"
              list="font-size-default"
              value={fontSize}
              onChange={handleFontSizeChange}
              aria-label="Font size"
              className="w-40 accent-violet-600"
            />
            <datalist id="font-size-default">
              <option value={DEFAULT_FONT_SIZE} />
            </datalist>
            <span className="w-10 text-right text-sm text-slate-500 dark:text-slate-400">{fontSize}px</span>
          </div>
        </SettingRow>
        <SettingRow label="High contrast">
          <Toggle label="High contrast" checked={highContrast} onChange={setHighContrast} />
        </SettingRow>
        <SettingRow label="Reduced motion">
          <Toggle label="Reduced motion" checked={reducedMotion} onChange={setReducedMotion} />
        </SettingRow>
      </div>
    </div>
  );
}
