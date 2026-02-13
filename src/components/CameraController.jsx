import { useRef, useEffect } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useAppState } from '../hooks/useAppState';

export default function CameraController() {
  const controlsRef = useRef();
  const { state } = useAppState();
  const { camera, viewport } = useThree();
  const isViewing = state.selectedPolaroid !== null;
  const hasAnimated = useRef(false);

  // Entry dolly animation
  useEffect(() => {
    if (state.phase === 'exploring' && !hasAnimated.current) {
      hasAnimated.current = true;
      camera.position.z = 20;
      const start = Date.now();
      const duration = 2000;
      const targetZ = viewport.width < 6 ? 15 : 12;
      const animate = () => {
        const progress = Math.min((Date.now() - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        camera.position.z = 20 - (20 - targetZ) * eased;
        if (progress < 1) requestAnimationFrame(animate);
      };
      animate();
    }
  }, [state.phase, camera, viewport.width]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={false}
      enableRotate={!isViewing}
      rotateSpeed={0.5}
      minPolarAngle={Math.PI * 0.3}
      maxPolarAngle={Math.PI * 0.7}
      dampingFactor={0.05}
      enableDamping={true}
      makeDefault
    />
  );
}
