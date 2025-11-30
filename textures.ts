import { TextureLoader, NearestFilter, RepeatWrapping } from 'three';
import { useLoader } from '@react-three/fiber';

// Helper to generate a simple noisy texture as a data URI
const createTextureUrl = (color: string, noise = true, pattern: 'none' | 'bricks' | 'planks' = 'none') => {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Base color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 64, 64);

  if (noise) {
    // Add simple noise
    const imageData = ctx.getImageData(0, 0, 64, 64);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const grain = (Math.random() - 0.5) * 30;
      data[i] = Math.min(255, Math.max(0, data[i] + grain));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
    }
    ctx.putImageData(imageData, 0, 0);
  }

  // Patterns
  if (pattern === 'bricks') {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    // Horizontal lines
    for (let y = 0; y < 64; y += 16) {
      ctx.fillRect(0, y, 64, 2);
    }
    // Vertical lines
    for (let y = 0; y < 64; y += 16) {
      const offset = (y / 16) % 2 === 0 ? 0 : 16;
      for (let x = offset; x < 64; x += 32) {
        ctx.fillRect(x, y, 2, 16);
      }
    }
  } else if (pattern === 'planks') {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    // Horizontal plank lines
    for (let y = 0; y < 64; y += 16) {
      ctx.fillRect(0, y, 64, 2);
    }
  }

  // Add a border for block definition
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 4;
  ctx.strokeRect(0, 0, 64, 64);

  return canvas.toDataURL();
};

export const textureUrlMap = {
  dirt: createTextureUrl('#5d4037'),
  grass: createTextureUrl('#4caf50'),
  glass: createTextureUrl('#88ccff', false),
  wood: createTextureUrl('#d7ccc8'),
  log: createTextureUrl('#3e2723'),
  diamond: createTextureUrl('#00bcd4'),
  stone: createTextureUrl('#757575'),
  planks: createTextureUrl('#e0c097', true, 'planks'),
  brick: createTextureUrl('#8d6e63', true, 'bricks'),
  cobblestone: createTextureUrl('#616161', true, 'bricks') // Recycling brick pattern for structure but different color
};

export const useTextures = () => {
  const textures = useLoader(TextureLoader, Object.values(textureUrlMap));

  textures.forEach((texture) => {
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
  });

  const textureObj: Record<string, any> = {};
  Object.keys(textureUrlMap).forEach((key, index) => {
      textureObj[key] = textures[index];
  });

  return textureObj as Record<keyof typeof textureUrlMap, any>;
};