import { createContext } from 'react';

export const LayoutContext = createContext('Default');

export const rowSpacing = {
  Compact: 'py-2',
  Default: 'py-4',
  Comfortable: 'py-6',
};
