import Polaroid from './Polaroid';
import { polaroids } from '../data/content';

const positions = [
  [-3.5, 1.5, -1],
  [0, 2.5, 0.5],
  [3.5, 1.5, -0.5],
  [-2.5, -0.5, 1],
  [0.5, 0, -1.5],
  [3, -0.5, 0.5],
  [-3, -2.5, 0],
  [0, -2, 1],
  [2.5, -2.5, -1],
];

const rotations = [
  [0.05, -0.1, 0.08],
  [-0.03, 0.05, -0.04],
  [0.04, 0.15, -0.06],
  [-0.06, -0.08, 0.03],
  [0.02, 0.12, 0.05],
  [-0.04, -0.15, -0.07],
  [0.07, 0.06, 0.04],
  [-0.05, -0.03, -0.08],
  [0.03, 0.1, 0.02],
];

function getFloatConfig(index) {
  return {
    speed: 0.4 + (index * 0.037) % 0.2,
    amplitude: 0.1 + (index * 0.023) % 0.1,
    rotationAmplitude: 0.03 + (index * 0.011) % 0.04,
    offset: index * 2.3,
  };
}

export default function PolaroidGroup() {
  return (
    <group>
      {polaroids.map((data, i) => (
        <Polaroid
          key={data.id}
          data={data}
          position={positions[i]}
          rotation={rotations[i]}
          floatConfig={getFloatConfig(i)}
          index={i}
        />
      ))}
    </group>
  );
}
