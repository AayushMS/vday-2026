import { useSpring, animated } from '@react-spring/web';
import { closingMessage } from '../data/content';

export default function FinalMessage() {
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 2500 },
  });

  return (
    <animated.div
      style={{
        ...fadeIn,
        position: 'fixed',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2A2119 0%, #1A1410 100%)',
        fontFamily: "'Caveat', cursive",
        color: '#FEFEFA',
        padding: '2rem',
        textAlign: 'center',
        zIndex: 10,
      }}
    >
      <h2 style={{
        fontSize: 'clamp(1.8rem, 6vw, 2.5rem)',
        marginBottom: '1.5rem',
        color: '#FFE4C9',
      }}>
        {closingMessage.title}
      </h2>
      <p style={{
        fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)',
        maxWidth: '500px',
        lineHeight: 1.8,
        color: '#F5E6E0',
        padding: '0 1rem',
      }}>
        {closingMessage.body}
      </p>
      <p style={{
        fontSize: 'clamp(1rem, 3vw, 1.3rem)',
        marginTop: '2rem',
        color: '#D4A88C',
      }}>
        {closingMessage.signature}
      </p>
    </animated.div>
  );
}
