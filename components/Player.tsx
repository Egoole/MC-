import React, { useEffect, useRef, useState } from 'react';
import { useSphere } from '@react-three/cannon';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useStore } from '../store';

const JUMP_FORCE = 4;
const SPEED = 4;
const FLY_SPEED = 10;

export const Player = () => {
  const { camera } = useThree();
  const [ref, api] = useSphere(() => ({ 
    mass: 1, 
    type: 'Dynamic', 
    position: [0, 5, 0] 
  }));

  const pos = useRef([0, 0, 0]);
  useEffect(() => api.position.subscribe((p) => (pos.current = p)), [api.position]);

  const vel = useRef([0, 0, 0]);
  useEffect(() => api.velocity.subscribe((v) => (vel.current = v)), [api.velocity]);

  const { isFlying, toggleFlying } = useStore();
  
  // Movement State
  const [movement, setMovement] = useState({
    moveForward: false,
    moveBackward: false,
    moveLeft: false,
    moveRight: false,
    jump: false,
    descend: false // For flying
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': setMovement((m) => ({ ...m, moveForward: true })); break;
        case 'KeyS': setMovement((m) => ({ ...m, moveBackward: true })); break;
        case 'KeyA': setMovement((m) => ({ ...m, moveLeft: true })); break;
        case 'KeyD': setMovement((m) => ({ ...m, moveRight: true })); break;
        case 'Space': setMovement((m) => ({ ...m, jump: true })); break;
        case 'ShiftLeft': setMovement((m) => ({ ...m, descend: true })); break;
        case 'KeyF': toggleFlying(); break;
        default: break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': setMovement((m) => ({ ...m, moveForward: false })); break;
        case 'KeyS': setMovement((m) => ({ ...m, moveBackward: false })); break;
        case 'KeyA': setMovement((m) => ({ ...m, moveLeft: false })); break;
        case 'KeyD': setMovement((m) => ({ ...m, moveRight: false })); break;
        case 'Space': setMovement((m) => ({ ...m, jump: false })); break;
        case 'ShiftLeft': setMovement((m) => ({ ...m, descend: false })); break;
        default: break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [toggleFlying]);

  useFrame(() => {
    if (!ref.current) return;

    // Current position
    const position = new Vector3(pos.current[0], pos.current[1], pos.current[2]);

    // Force First Person Camera
    camera.position.copy(position);

    const direction = new Vector3();
    const frontVector = new Vector3(
      0,
      0,
      Number(movement.moveBackward) - Number(movement.moveForward)
    );
    const sideVector = new Vector3(
      Number(movement.moveLeft) - Number(movement.moveRight),
      0,
      0
    );

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(isFlying ? FLY_SPEED : SPEED)
      .applyEuler(camera.rotation);

    if (isFlying) {
      // Fly Mode: Control absolute velocity
      api.mass.set(0); // Zero gravity
      
      let verticalSpeed = 0;
      if (movement.jump) verticalSpeed = FLY_SPEED;
      if (movement.descend) verticalSpeed = -FLY_SPEED;

      api.velocity.set(direction.x, verticalSpeed, direction.z);
    } else {
      // Walk Mode: Control X/Z velocity, preserve Y (gravity) unless jumping
      api.mass.set(1);
      
      api.velocity.set(direction.x, vel.current[1], direction.z);

      // Jump if on ground (roughly)
      if (movement.jump && Math.abs(vel.current[1]) < 0.05) {
        api.velocity.set(vel.current[0], JUMP_FORCE, vel.current[2]);
      }
    }
  });

  return (
    <mesh ref={ref as any} />
  );
};