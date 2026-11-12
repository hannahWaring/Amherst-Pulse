import React, {useState} from 'react';
import WelcomePage from './pages/Welcomepage';
import DefaultPage from './pages/DefaultPage';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  if (!isStarted) {
    return (
    <WelcomePage 
    onGetStarted = { () => setIsStarted(true)} />
  );

  }
  return <DefaultPage />
  
}