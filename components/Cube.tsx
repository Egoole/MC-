import React, { useState } from 'react';
import { useBox } from '@react-three/cannon';
import { useStore } from '../store';
import { useTextures } from '../textures';

interface CubeProps {
  position: [number, number, number];
  texture: string;
}

export const Cube: React.FC<CubeProps> = ({ position, texture }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ref] = useBox(() => ({ type: 'Static', position }));
  const { addCube, removeCube } = useStore();
  const activeTexture = useTextures()[texture as keyof ReturnType<typeof useTextures>];

  return (
    <mesh
      ref={ref as any}
      onPointerMove={(e) => {
        e.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setIsHovered(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        const clickedFace = Math.floor(e.faceIndex! / 2);
        const { x, y, z } = ref.current!.position;

        if (e.altKey) {
          removeCube(x, y, z);
          return;
        }

        // Determine where to place new block based on face
        if (clickedFace === 0) addCube(x + 1, y, z);
        else if (clickedFace === 1) addCube(x - 1, y, z);
        else if (clickedFace === 2) addCube(x, y + 1, z);
        else if (clickedFace === 3) addCube(x, y - 1, z);
        else if (clickedFace === 4) addCube(x, y, z + 1);
        else if (clickedFace === 5) addCube(x, y, z - 1);
      }}
    >
      <boxGeometry attach="geometry" />
      <meshStandardMaterial
        map={activeTexture}
        attach="material"
        color={isHovered ? 'grey' : 'white'}
        transparent={texture === 'glass'}
        opacity={texture === 'glass' ? 0.6 : 1}
      />
    </mesh>
  );
};