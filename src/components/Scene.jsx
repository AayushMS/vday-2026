import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import CameraController from './CameraController';
import PolaroidGroup from './PolaroidGroup';
import Particles from './Particles';
import { useAppState } from '../hooks/useAppState';
import { polaroids } from '../data/content';

export default function Scene() {
  const { state, dispatch } = useAppState();

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 18], fov: 50, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(135deg, #2A2119 0%, #1A1410 50%, #2A1F1A 100%)',
        }}
        onPointerMissed={() => {
          if (state.selectedPolaroid !== null) {
            dispatch({ type: 'DISMISS_POLAROID', totalPolaroids: polaroids.length });
          }
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} color="#FFF5EE" />
          <pointLight position={[5, 5, 5]} intensity={0.8} color="#FFE4C9" />
          <pointLight position={[-5, -3, 3]} intensity={0.4} color="#E8D5C4" />
          <PolaroidGroup />
          <Particles />
          <CameraController />
        </Suspense>
      </Canvas>

      {state.showFinalPrompt && state.phase === 'exploring' && (
        <div
          className="final-prompt"
          onClick={() => dispatch({ type: 'SHOW_CLOSING' })}
          onTouchEnd={(e) => {
            e.preventDefault();
            dispatch({ type: 'SHOW_CLOSING' });
          }}
        >
          <p>i have something to tell you...</p>
        </div>
      )}
    </>
  );
}
