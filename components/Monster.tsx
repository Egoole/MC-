import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import { Vector3 } from 'three';

// Simple "Zombie" that jumps towards player
export const Monster = ({ position }: { position: [number, number, number] }) => {
  const [ref, api] = useBox(() => ({ mass: 1, position, args: [1, 2, 1] }));
  const [dead, setDead] = useState(false);
  const time = useRef(0);

  useFrame((state) => {
    if (dead) return;
    
    time.current += 0.01;
    
    // Get player position roughly (assuming player is near 0,5,0 or we could use store, 
    // but simplified AI just jumps randomly towards center/player start for now 
    // to avoid complex dependency injection in this snippet)
    // A better way is to track player pos in store, but let's make it just hop around aggressively.
    
    // Simple AI: Hop periodically
    if (Math.random() < 0.02) {
       api.velocity.set(
         (Math.random() - 0.5) * 5, 
         4, 
         (Math.random() - 0.5) * 5
       );
    }
  });

  if (dead) return null;

  return (
    <mesh 
        ref={ref as any}
        onClick={(e) => {
            e.stopPropagation();
            setDead(true); // "Kill" the monster
        }}
    >
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="green" />
      {/* Eyes */}
      <mesh position={[0.2, 0.5, 0.51]}>
         <planeGeometry args={[0.2, 0.2]} />
         <meshBasicMaterial color="black" />
      </mesh>
      <mesh position={[-0.2, 0.5, 0.51]}>
         <planeGeometry args={[0.2, 0.2]} />
         <meshBasicMaterial color="black" />
      </mesh>
    </mesh>
  );
};