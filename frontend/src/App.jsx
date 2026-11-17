import React, {useEffect, useState} from 'react';
import WelcomePage from './pages/Welcomepage';
import DefaultPage from './pages/DefaultPage';
import ViewCollections from './pages/ViewCollections';
import SettingsPage from './pages/SettingsPage';
import ExplorePage from './pages/ExplorePage';
import CollectionPage from './pages/CollectionPage';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (!isStarted && path === '/') {
    return (
    <WelcomePage 
    onGetStarted = { () => setIsStarted(true)} />
  );

  }
  if (path === '/collections') return <ViewCollections />;
  if (path === '/settings') return <SettingsPage />;
  if (path === '/explore') return <ExplorePage />;
  const collectionMatch = path.match(/^\/collections\/(\d+)$/);
  if (collectionMatch) return <CollectionPage collectionId={Number(collectionMatch[1])} />;
  if (path === '/home') return <DefaultPage />;
  return <DefaultPage />
  
}
