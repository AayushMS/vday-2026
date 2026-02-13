import { AppStateProvider, useAppState } from './hooks/useAppState';
import LandingPage from './components/LandingPage';
import Scene from './components/Scene';
import FinalMessage from './components/FinalMessage';
import './App.css';

function AppContent() {
  const { state } = useAppState();

  return (
    <div className="app-container">
      {(state.phase === 'landing' || state.phase === 'entering') && <LandingPage />}
      {state.phase !== 'landing' && state.phase !== 'closing' && <Scene />}
      {state.phase === 'closing' && <FinalMessage />}
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
}
