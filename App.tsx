import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, PointerLockControls, Stars, Html } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import { Ground } from './components/Ground';
import { Player } from './components/Player';
import { Cube } from './components/Cube';
import { UI } from './components/UI';
import { useStore } from './store';

function GameWorld() {
  const cubes = useStore((state) => state.cubes);
  
  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <Stars />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <Physics gravity={[0, -9.8, 0]}>
        <Player />
        <Ground />
        {cubes.map((cube) => (
          <Cube key={cube.key} position={cube.pos} texture={cube.texture} />
        ))}
      </Physics>
      
      <PointerLockControls />
    </>
  );
}

export default function App() {
  return (
    <>
      <div className="w-full h-full bg-slate-900">
        <Canvas shadows camera={{ fov: 45 }}>
          <Suspense fallback={<Html center><div className="text-white">正在加载资源...</div></Html>}>
             <GameWorld />
          </Suspense>
        </Canvas>
        <UI />
      </div>
    </>
  );
}