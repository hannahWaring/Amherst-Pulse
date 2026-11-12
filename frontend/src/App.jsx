import React, {useState, useEffect} from 'react';
import WelcomePage from './pages/Welcomepage';
import DefaultPage from './pages/DefaultPage';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  if (!isStarted && path === '/') {
    return (
      <WelcomePage
        onGetStarted={() => setIsStarted(true)}
      />
    );

  }
  return <DefaultPage isMyPinOpen={path === '/MyPins'} />;
}