import { createContext, useContext, useReducer, useMemo } from 'react';

const AppStateContext = createContext();

const initialState = {
  phase: 'landing',        // landing | entering | exploring | viewing | closing
  selectedPolaroid: null,
  isFlipped: false,
  viewedPolaroids: [],
  showFinalPrompt: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'START_ENTER':
      return { ...state, phase: 'entering' };
    case 'ENTER_SCENE':
      return { ...state, phase: 'exploring' };
    case 'SELECT_POLAROID':
      return {
        ...state,
        phase: 'viewing',
        selectedPolaroid: action.id,
        isFlipped: false,
      };
    case 'FLIP_POLAROID':
      return { ...state, isFlipped: !state.isFlipped };
    case 'DISMISS_POLAROID': {
      const viewed = state.viewedPolaroids.includes(state.selectedPolaroid)
        ? state.viewedPolaroids
        : [...state.viewedPolaroids, state.selectedPolaroid];
      const threshold = Math.min(action.totalPolaroids, 5);
      return {
        ...state,
        phase: 'exploring',
        selectedPolaroid: null,
        isFlipped: false,
        viewedPolaroids: viewed,
        showFinalPrompt: viewed.length >= threshold || state.showFinalPrompt,
      };
    }
    case 'SHOW_CLOSING':
      return { ...state, phase: 'closing' };
    default:
      return state;
  }
}

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}
