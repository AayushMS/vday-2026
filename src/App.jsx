import { AppStateProvider, useAppState } from './hooks/useAppState';
import LandingPage from './components/LandingPage';
import Scene from './components/Scene';
import FinalMessage from './components/FinalMessage';
import './App.css';

function AppContent() {
  const { state } = useAppState();
  const showScene = state.phase !== 'landing';

  return (
    <div className="app-container">
      {(state.phase === 'landing' || state.phase === 'entering') && <LandingPage />}
      {showScene && <Scene />}
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
