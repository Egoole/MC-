import React, { useEffect, useState } from 'react';
import { useStore, BlockType } from '../store';
import { textureUrlMap } from '../textures';

export const UI = () => {
  const { texture, setTexture, isFlying } = useStore();
  const [showHelp, setShowHelp] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys to switch texture
      if (e.key === '1') setTexture('dirt');
      if (e.key === '2') setTexture('grass');
      if (e.key === '3') setTexture('glass');
      if (e.key === '4') setTexture('wood');
      if (e.key === '5') setTexture('log');
      if (e.key === '6') setTexture('diamond');
      if (e.key === '7') setTexture('stone');
      if (e.key === '8') setTexture('planks');
      if (e.key === '9') setTexture('brick');
      if (e.key === '0') setTexture('cobblestone');
      
      if (e.key === 'h') setShowHelp(prev => !prev);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setTexture]);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
      {/* Top Left: Status */}
      <div className="text-white bg-black/50 p-2 rounded max-w-sm">
        <h1 className="font-bold text-xl mb-1 text-green-400">果冻大爷的 Minecraft</h1>
        <p className="text-xs">飞行: {isFlying ? '开' : '关'}</p>
        <p className="text-xs text-gray-300">按 'H' 切换帮助</p>
      </div>

      {/* Center: Crosshair */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl">
        +
      </div>
      
      {/* Help Modal */}
      {showHelp && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/70 text-white p-4 rounded text-sm pointer-events-auto w-64">
           <h3 className="font-bold border-b border-gray-500 mb-2 pb-1">操作指南</h3>
           <ul className="space-y-1">
             <li><span className="text-yellow-400">W, A, S, D</span> 移动</li>
             <li><span className="text-yellow-400">Space</span> 跳跃</li>
             <li><span className="text-yellow-400">F</span> 开启/关闭飞行 (Shift 下降)</li>
             <li><span className="text-yellow-400">鼠标左键</span> 放置方块</li>
             <li><span className="text-yellow-400">Alt + 左键</span> 移除方块</li>
             <li><span className="text-yellow-400">1-0</span> 选择方块类型</li>
             <li><span className="text-yellow-400">H</span> 隐藏此菜单</li>
             <li className="text-gray-400 text-xs mt-2">点击画面开始游戏 (锁定鼠标)</li>
           </ul>
        </div>
      )}

      {/* Bottom Center: Texture Selector */}
      <div className="flex justify-center gap-2 mb-4 pointer-events-auto flex-wrap px-4">
        {Object.keys(textureUrlMap).map((k) => {
          const t = k as BlockType;
          return (
            <div
              key={t}
              className={`w-10 h-10 md:w-12 md:h-12 border-4 transition-all cursor-pointer bg-gray-800 ${
                texture === t ? 'border-red-500 scale-110' : 'border-gray-600 hover:border-white'
              }`}
              onClick={() => setTexture(t)}
            >
                <img src={textureUrlMap[t]} alt={t} className="w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
            </div>
          );
        })}
      </div>
    </div>
  );
};