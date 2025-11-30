import { create } from 'zustand';
import { nanoid } from 'nanoid';

export type BlockType = 'dirt' | 'grass' | 'glass' | 'wood' | 'log' | 'diamond' | 'stone' | 'planks' | 'brick' | 'cobblestone';

interface Cube {
  key: string;
  pos: [number, number, number];
  texture: BlockType;
}

interface GameState {
  texture: BlockType;
  cubes: Cube[];
  isFlying: boolean;
  addCube: (x: number, y: number, z: number) => void;
  removeCube: (x: number, y: number, z: number) => void;
  setTexture: (texture: BlockType) => void;
  toggleFlying: () => void;
  saveWorld: () => void;
  resetWorld: () => void;
}

const getLocalStorage = (key: string) => JSON.parse(window.localStorage.getItem(key) || 'null');
const setLocalStorage = (key: string, value: any) => window.localStorage.setItem(key, JSON.stringify(value));

export const useStore = create<GameState>((set) => ({
  texture: 'grass',
  cubes: getLocalStorage('world') || [
    { key: nanoid(), pos: [2, 0, 0], texture: 'wood' },
    { key: nanoid(), pos: [1, 0, 0], texture: 'wood' },
    { key: nanoid(), pos: [0, 0, 0], texture: 'grass' },
    { key: nanoid(), pos: [-1, 0, 0], texture: 'log' },
    { key: nanoid(), pos: [0, 1, 0], texture: 'dirt' },
  ],
  isFlying: false,
  addCube: (x, y, z) => {
    set((state) => ({
      cubes: [
        ...state.cubes,
        {
          key: nanoid(),
          pos: [x, y, z],
          texture: state.texture,
        },
      ],
    }));
  },
  removeCube: (x, y, z) => {
    set((state) => ({
      cubes: state.cubes.filter((cube) => {
        const [cx, cy, cz] = cube.pos;
        return cx !== x || cy !== y || cz !== z;
      }),
    }));
  },
  setTexture: (texture) => {
    set(() => ({ texture }));
  },
  toggleFlying: () => {
    set((state) => ({ isFlying: !state.isFlying }));
  },
  saveWorld: () => {
    set((state) => {
      setLocalStorage('world', state.cubes);
      return state;
    });
  },
  resetWorld: () => {
    set(() => ({
      cubes: [],
    }));
    setLocalStorage('world', []);
  },
}));