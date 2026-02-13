import { useFrame } from '@react-three/fiber';

export function useFloat(groupRef, { speed = 0.5, amplitude = 0.15, rotationAmplitude = 0.05, offset = 0 }, isDisabled = false) {
  useFrame(({ clock }) => {
    if (!groupRef.current || isDisabled) return;
    const t = clock.getElapsedTime();

    groupRef.current.position.y += Math.sin((t + offset) * speed) * amplitude * 0.01;
    groupRef.current.rotation.x = Math.sin((t + offset) * speed * 0.7) * rotationAmplitude;
    groupRef.current.rotation.z = Math.cos((t + offset) * speed * 0.5) * rotationAmplitude;
  });
}
