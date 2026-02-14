import { useCallback } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useAppState } from '../hooks/useAppState';
import { landingText } from '../data/content';

export default function LandingPage() {
  const { state, dispatch } = useAppState();
  const isExiting = state.phase === 'entering';

  const fadeStyle = useSpring({
    opacity: isExiting ? 0 : 1,
    config: { duration: 1200 },
    onRest: () => {
      if (isExiting) dispatch({ type: 'ENTER_SCENE' });
    },
  });

  const pulseStyle = useSpring({
    from: { opacity: 0.4 },
    to: { opacity: 1 },
    loop: { reverse: true },
    config: { duration: 1500 },
  });

  const floatStyle = useSpring({
    from: { transform: 'translateY(0px)' },
    to: { transform: 'translateY(-8px)' },
    loop: { reverse: true },
    config: { duration: 2000 },
  });

  const handleEnter = useCallback(() => {
    if (state.phase === 'landing') {
      dispatch({ type: 'START_ENTER' });
    }
  }, [state.phase, dispatch]);

  return (
    <animated.div
      style={{
        ...fadeStyle,
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF8F0 0%, #F5E6E0 100%)',
        cursor: 'pointer',
        fontFamily: "'Caveat', cursive",
        zIndex: 10,
      }}
      onClick={handleEnter}
    >
      <animated.h1 style={{
        ...floatStyle,
        fontSize: 'clamp(2.2rem, 8vw, 3.5rem)',
        color: '#5C4033',
        margin: 0,
        letterSpacing: '0.02em',
        padding: '0 1rem',
      }}>
        {landingText.greeting}
      </animated.h1>
      <animated.p style={{
        ...pulseStyle,
        fontSize: 'clamp(1rem, 3.5vw, 1.3rem)',
        color: '#8B7D75',
        marginTop: '2rem',
      }}>
        {landingText.prompt}
      </animated.p>
    </animated.div>
  );
}
