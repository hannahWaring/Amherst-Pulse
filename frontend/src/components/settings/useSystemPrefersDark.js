import { useSyncExternalStore } from 'react';

const darkQuery = '(prefers-color-scheme: dark)';

function subscribe(callback) {
  const mediaQuery = window.matchMedia(darkQuery);
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getSnapshot() {
  return window.matchMedia(darkQuery).matches;
}

export default function useSystemPrefersDark() {
  return useSyncExternalStore(subscribe, getSnapshot);
}
