import React from 'react';
import { usePlane } from '@react-three/cannon';
import { useTextures } from '../textures';
import { useStore } from '../store';
import { RepeatWrapping } from 'three';

export const Ground = () => {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -0.5, 0],
  }));

  const { grass } = useTextures();
  const { addCube } = useStore();

  // Configure grass texture for tiling on ground
  grass.wrapS = RepeatWrapping;
  grass.wrapT = RepeatWrapping;
  grass.repeat.set(100, 100);

  return (
    <mesh
      ref={ref as any}
      onClick={(e) => {
        e.stopPropagation();
        // Place a block on top of the ground at the clicked integer coordinate
        // e.point is precise, but cubes are at integers. 
        // We usually round to nearest 0.5 offset, but here we just align to grid.
        addCube(Math.round(e.point.x), 0, Math.round(e.point.z));
      }}
    >
      <planeGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial attach="material" map={grass} />
    </mesh>
  );
};