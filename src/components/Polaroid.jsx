import { useRef, useState, useMemo, useEffect } from 'react';
import { useTexture, Text } from '@react-three/drei';
import { useSpring, animated, to } from '@react-spring/three';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useAppState } from '../hooks/useAppState';

const AnimatedGroup = animated.group;

const BORDER = 0.15;
const BOTTOM_BORDER = 0.4;
const CARD_DEPTH = 0.02;

function getPolaroidDimensions(orientation) {
  const photoW = orientation === 'landscape' ? 1.6 : 1.2;
  const photoH = orientation === 'landscape' ? 1.2 : 1.6;
  const cardW = photoW + BORDER * 2;
  const cardH = photoH + BORDER + BOTTOM_BORDER;
  return { photoW, photoH, cardW, cardH };
}

export default function Polaroid({ data, position, rotation, floatConfig, index = 0 }) {
  const groupRef = useRef();
  const innerRef = useRef();
  const { state, dispatch } = useAppState();
  const { viewport } = useThree();
  const texture = useTexture(data.photo);
  const isSelected = state.selectedPolaroid === data.id;
  const isAnySelected = state.selectedPolaroid !== null;
  const dims = useMemo(() => getPolaroidDimensions(data.orientation), [data.orientation]);

  texture.colorSpace = THREE.SRGBColorSpace;

  const [hovered, setHovered] = useState(false);

  // Bring selected polaroid closer on mobile (camera is further back)
  const selectedZ = viewport.width < 7 ? 12 : 8;
  const selectedScale = viewport.width < 7 ? 2.2 : 1.8;

  // Float animation (applied to inner ref, reset when selected)
  useFrame(({ clock }) => {
    if (!innerRef.current) return;
    if (isSelected) {
      // Smoothly reset float offset when selected
      innerRef.current.position.y *= 0.9;
      innerRef.current.rotation.x *= 0.9;
      innerRef.current.rotation.z *= 0.9;
      return;
    }
    const t = clock.getElapsedTime();
    const { speed, amplitude, rotationAmplitude, offset } = floatConfig;

    innerRef.current.position.y = Math.sin((t + offset) * speed) * amplitude;
    innerRef.current.rotation.x = Math.sin((t + offset) * speed * 0.7) * rotationAmplitude;
    innerRef.current.rotation.z = Math.cos((t + offset) * speed * 0.5) * rotationAmplitude;
  });

  // Spring for selection/flip
  const springs = useSpring({
    posX: isSelected ? 0 : position[0],
    posY: isSelected ? 0 : position[1],
    posZ: isSelected ? selectedZ : position[2],
    rotY: isSelected && state.isFlipped ? Math.PI : 0,
    scale: isSelected ? selectedScale : 1,
    opacity: isAnySelected && !isSelected ? 0.3 : 1,
    config: { mass: 1, tension: 170, friction: 26 },
  });

  // Staggered entrance animation
  const entranceSpring = useSpring({
    scale: state.phase === 'exploring' || state.phase === 'viewing' ? 1 : 0,
    config: { mass: 1, tension: 120, friction: 14 },
    delay: index * 200,
  });

  // Typewriter caption reveal
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    if (isSelected && state.isFlipped) {
      setVisibleChars(0);
      const interval = setInterval(() => {
        setVisibleChars(prev => {
          if (prev >= data.caption.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 40);
      return () => clearInterval(interval);
    } else {
      setVisibleChars(0);
    }
  }, [isSelected, state.isFlipped, data.caption.length]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (isSelected) {
      dispatch({ type: 'FLIP_POLAROID' });
    } else if (!isAnySelected) {
      dispatch({ type: 'SELECT_POLAROID', id: data.id });
    }
  };

  const emissiveIntensity = hovered && !isAnySelected ? 0.15 : 0;

  return (
    <AnimatedGroup
      ref={groupRef}
      position-x={springs.posX}
      position-y={springs.posY}
      position-z={springs.posZ}
      rotation-y={springs.rotY}
      scale={to([springs.scale, entranceSpring.scale], (s, e) => s * e)}
    >
      <group
        ref={innerRef}
        rotation={rotation}
        onClick={handleClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        {/* White card body */}
        <mesh>
          <boxGeometry args={[dims.cardW, dims.cardH, CARD_DEPTH]} />
          <animated.meshStandardMaterial
            color="#FEFEFA"
            roughness={0.3}
            emissive="#FFE4C9"
            emissiveIntensity={emissiveIntensity}
            transparent
            opacity={springs.opacity}
          />
        </mesh>

        {/* Photo on front face */}
        <mesh position={[0, (BOTTOM_BORDER - BORDER) / 2, CARD_DEPTH / 2 + 0.001]}>
          <planeGeometry args={[dims.photoW, dims.photoH]} />
          <animated.meshBasicMaterial map={texture} transparent opacity={springs.opacity} />
        </mesh>

        {/* Date on front face (bottom-right of border) */}
        {data.date && (
          <Text
            position={[dims.cardW / 2 - 0.15, -(dims.cardH / 2 - 0.15), CARD_DEPTH / 2 + 0.001]}
            fontSize={0.08}
            anchorX="right"
            anchorY="middle"
            color="#8B7D75"
            font="/fonts/Caveat-Regular.ttf"
          >
            {data.date}
          </Text>
        )}

        {/* Caption on back face */}
        <group position={[0, 0, -(CARD_DEPTH / 2 + 0.001)]} rotation={[0, Math.PI, 0]}>
          <Text
            fontSize={0.12}
            maxWidth={dims.cardW - 0.3}
            textAlign="center"
            anchorX="center"
            anchorY="middle"
            color="#5C4033"
            font="/fonts/Caveat-Regular.ttf"
          >
            {data.caption.slice(0, visibleChars)}
          </Text>
        </group>
      </group>
    </AnimatedGroup>
  );
}
