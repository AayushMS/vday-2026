import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const PARTICLE_COUNT = 80;

export default function Particles() {
  const meshRef = useRef();
  const heartTexture = useTexture('/textures/heart.png');

  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const posArray = meshRef.current.geometry.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posArray[i * 3 + 1] += 0.002;
      posArray[i * 3] += Math.sin(t * 0.3 + i) * 0.001;
      if (posArray[i * 3 + 1] > 6) posArray[i * 3 + 1] = -6;
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={PARTICLE_COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={heartTexture}
        color="#FFB6C1"
        size={0.08}
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
