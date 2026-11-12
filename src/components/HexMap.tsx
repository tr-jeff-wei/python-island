import React, { useEffect, useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Territory } from '../types/game';
import {
  axialToIsometric,
  getIsometricHexPoints,
  ISO_SCALE,
} from '../utils/hexMath';
import { FACTION_INFO } from '../data/initialMap';
import {
  ENEMY_ATTACK_ANIMATION_CYCLES,
  ENEMY_ATTACK_ANIMATION_DURATION_MS,
  ENEMY_ATTACK_CYCLE_DURATION_MS,
} from '../utils/enemyAttack';
import {
  getTerritoryTileImage,
  getTerritoryBuildingLayers,
  getTerritoryDecoration,
  FACTION_ALIENS,
} from '../utils/hexAssets';
import { soundManager } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';
import {
  Crown,
  Pickaxe,
  BookOpen,
  ShieldAlert,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Layers,
} from 'lucide-react';

export const HexMap: React.FC = () => {
  const {
    territories,
    selectedTerritory,
    setSelectedTerritory,
    isAdjacentToPlayer,
    activeEnemyAttack,
  } = useGame();
  const { t } = useLanguage();

  // Pan and Zoom state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 420, y: 240 }); // Centered around origin
  const [isDragging, setIsDragging] = useState(false);
  const [enemyAttackProgress, setEnemyAttackProgress] = useState(0);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!activeEnemyAttack || activeEnemyAttack.phase !== 'approaching') {
      setEnemyAttackProgress(0);
      return;
    }

    let frameId = 0;
    let startTime: number | null = null;
    setEnemyAttackProgress(0);

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min(
        (timestamp - startTime) / ENEMY_ATTACK_ANIMATION_DURATION_MS,
        1
      );
      setEnemyAttackProgress(progress);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [activeEnemyAttack?.originId, activeEnemyAttack?.targetId, activeEnemyAttack?.phase]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    panStartRef.current = { ...pan };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(2.0, Math.max(0.5, prev + delta)));
  };

  const resetView = () => {
    soundManager.playClick();
    setZoom(1);
    setPan({ x: 420, y: 240 });
  };

  const handleSelectHex = (terr: Territory, e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    setSelectedTerritory(terr);
  };

  // Sort territories from back-to-front (isometric painter's algorithm)
  const sortedTerritories = [...territories].sort((a, b) => {
    if (a.r !== b.r) return a.r - b.r;
    return a.q - b.q;
  });

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-slate-950 flex flex-col rounded-xl border border-slate-800 shadow-2xl select-none">
      {/* Map Header Status Bar */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-slate-700/60 shadow-lg text-xs font-medium text-slate-200 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{t('六角戰略地圖 · 2.5D 等角領地視界')}</span>
          <span className="text-slate-500 font-mono text-[10px]">({territories.length} {t('塊領地')})</span>
        </div>
      </div>

      {/* Floating Zoom & Center Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-lg border border-slate-700/60 shadow-lg">
        <button
          onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
          title={t('放大')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z - 0.15))}
          title={t('縮小')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={resetView}
          title={t('重設視角')}
          className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* SVG Canvas for Isometric Hexagons */}
      <div
        className={`w-full h-full flex-1 cursor-grab ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg className="w-full h-full">
          <defs>
            <pattern id="iso-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="0.8" />
            </pattern>

            <filter id="hex-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="attack-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <marker
              id="enemy-attack-arrow"
              markerWidth="20"
              markerHeight="20"
              refX="16"
              refY="10"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <path d="M 0 0 L 20 10 L 0 20 z" fill="#fb7185" />
            </marker>
          </defs>

          <rect width="100%" height="100%" fill="url(#iso-grid)" />

          {/* Isometric World Container */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {sortedTerritories.map((terr) => {
              const { x, y, cx, cy, width, height } = axialToIsometric(terr.q, terr.r);
              const isSelected = selectedTerritory?.id === terr.id;
              const isPlayer = terr.ownerId === 'player';
              const attackable = !isPlayer && isAdjacentToPlayer(terr);
              const faction = FACTION_INFO[terr.ownerId] || FACTION_INFO.neutral;

              // Assets by faction tile:
              // 玩家 -> tileGrass, 中立領地 -> tileSand, 赤紅軍團 -> tileLava
              const tileImg = getTerritoryTileImage(terr);
              const buildingLayers = getTerritoryBuildingLayers(terr);
              const decorationImg = getTerritoryDecoration(terr);

              // Polygon coordinates for top facet
              const topFacetPts = getIsometricHexPoints(cx, cy, ISO_SCALE);
              const pulseFacetPts = getIsometricHexPoints(cx, cy, ISO_SCALE, 4);

              // Miniature scaled building sizes (~40-45% scale)
              const roofWidth = 65 * ISO_SCALE * 0.5;
              const roofHeight = 92 * ISO_SCALE * 0.5;
              const roofX = cx - roofWidth / 2;
              const roofY = cy - roofHeight * 0.66;

              const ringWidth = width * 0.30;
              const ringHeight = height * 0.30;
              const ringX = cx - ringWidth / 2;
              const ringY = cy - ringHeight * 0.55;

              const sandWidth = width * 0.8;
              const sandHeight = height * 0.6;
              const sandX = cx - sandWidth / 2;
              const sandY = cy - sandHeight / 2;

              return (
                <g
                  key={terr.id}
                  onClick={(e) => handleSelectHex(terr, e)}
                  className="cursor-pointer transition-transform duration-150 group"
                >


                  {/* 1. Base Isometric 3D Hex Tile Image (Grass, Sand, Lava) */}
                  <image
                    href={tileImg}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    preserveAspectRatio="none"
                    className="transition-all duration-200 group-hover:brightness-110 drop-shadow-sm"
                  />

                  {/* 2. Top-Facet Boundary & Subtle Faction Tint */}
                  <polygon
                    points={topFacetPts}
                    fill={
                      isSelected
                        ? 'rgba(56, 189, 248, 0.28)'
                        : isPlayer
                          ? 'rgba(34, 197, 94, 0.12)'
                          : terr.ownerId === 'enemy_red'
                            ? 'rgba(239, 68, 68, 0.14)'
                            : 'rgba(255, 255, 255, 0.04)'
                    }
                    stroke={
                      isSelected
                        ? '#38bdf8'
                        : attackable
                          ? '#fbbf24'
                          : faction.strokeColor
                    }
                    strokeWidth={isSelected ? '3.5' : attackable ? '2.5' : '1.5'}
                    filter={isSelected ? 'url(#hex-glow)' : undefined}
                    className="transition-all duration-200"
                  />

                  {/* 3. Miniature Wall Ring if present */}
                  {buildingLayers.ring && buildingLayers.ring.includes('scifi_hangar') && (
                    <image
                      href={buildingLayers.ring}
                      x={ringX}
                      y={ringY}
                      width={ringWidth}
                      height={ringHeight}
                      preserveAspectRatio="none"
                      className="pointer-events-none drop-shadow-sm"
                    />
                  )}
                  {buildingLayers.ring && !buildingLayers.ring.includes('scifi_hangar') && (
                    <image
                      href={buildingLayers.ring}
                      x={sandX}
                      y={sandY}
                      width={sandWidth}
                      height={sandHeight}
                      preserveAspectRatio="none"
                      className="pointer-events-none drop-shadow-sm"
                    />
                  )}                  
                  {/* 3.1 Miniature in sand ground if present */}
                  {buildingLayers.ring && buildingLayers.ring.includes('sand') && (
                    <image
                      href={buildingLayers.ring}
                      x={sandX}
                      y={sandY}
                      width={sandWidth}
                      height={sandHeight}
                      preserveAspectRatio="none"
                      className="pointer-events-none drop-shadow-sm"
                    />
                  )}

                  {/* 3.1 Miniature turret if present */}
                  {buildingLayers.turret && (
                    <image
                      href={buildingLayers.turret2}
                      x={cx - 35}
                      y={cy - 50}
                      width={75}
                      height={75}
                      preserveAspectRatio="xMidYMid meet"
                      className="pointer-events-none drop-shadow-sm"
                    />
                  )}
                  {buildingLayers.turret && (
                    <image
                      href={buildingLayers.turret}
                      x={cx - 14}
                      y={cy - 20}
                      width={40}
                      height={40}
                      preserveAspectRatio="xMidYMid meet"
                      className="pointer-events-none drop-shadow-sm"
                    />
                  )}

                  {/* 3.1 Miniature turret if present */}
                  {buildingLayers.factory && (<image
                    href={buildingLayers.factory2}
                    x={cx - 12}
                    y={cy - 40}
                    width={42 * 0.5}
                    height={76 * 0.5}
                    preserveAspectRatio="xMidYMid meet"
                    className="pointer-events-none drop-shadow-sm"
                  />)
                  }
                  {buildingLayers.factory && (<image
                    href={buildingLayers.factory2}
                    x={cx - 25}
                    y={cy - 27}
                    width={42 * 0.5}
                    height={76 * 0.5}
                    preserveAspectRatio="xMidYMid meet"
                    className="pointer-events-none drop-shadow-sm"
                  />)
                  }
                  {buildingLayers.factory && (
                    <image
                      href={buildingLayers.factory}
                      x={cx - 4}
                      y={cy - 28}
                      width={70 * 0.5}
                      height={88 * 0.5}
                      preserveAspectRatio="xMidYMid meet"
                      className="pointer-events-none drop-shadow-sm"
                    />
                  )}
                  {/* 3.2 Miniature shield if present */}
                  {buildingLayers.shield && (<image
                    href={buildingLayers.shield}
                    x={cx - 22}
                    y={cy - 45}
                    width={58 * 0.3}
                    height={108 * 0.3}
                    preserveAspectRatio="xMidYMid meet"
                    className="pointer-events-none drop-shadow-sm"
                  />)
                  }
                  {buildingLayers.shield && (<image
                    href={buildingLayers.shield}
                    x={cx + 10}
                    y={cy - 40}
                    width={58 * 0.3}
                    height={108 * 0.3}
                    preserveAspectRatio="xMidYMid meet"
                    className="pointer-events-none drop-shadow-sm"
                  />)
                  }
                  {buildingLayers.shield && (<image
                    href={buildingLayers.shield2}
                    x={cx - 8}
                    y={cy - 24}
                    width={58 * 0.3}
                    height={108 * 0.3}
                    preserveAspectRatio="xMidYMid meet"
                    className="pointer-events-none drop-shadow-sm"
                  />)
                  }
                  {buildingLayers.shield && (<image
                    href={buildingLayers.shield}
                    x={cx - 27}
                    y={cy - 15}
                    width={58 * 0.3}
                    height={108 * 0.3}
                    preserveAspectRatio="xMidYMid meet"
                    className="pointer-events-none drop-shadow-sm"
                  />)
                  }
                  {buildingLayers.shield && (<image
                    href={buildingLayers.shield}
                    x={cx + 5}
                    y={cy - 7}
                    width={58 * 0.3}
                    height={108 * 0.3}
                    preserveAspectRatio="xMidYMid meet"
                    className="pointer-events-none drop-shadow-sm"
                  />)
                  }
                  {/* 3.3 Miniature institute if present */}
                  {buildingLayers.institute && (<image
                    href={buildingLayers.institute}
                    x={cx - 25}
                    y={cy - 30}
                    width={96 * 0.6}
                    height={78 * 0.6}
                    preserveAspectRatio="xMidYMid meet"
                    className="pointer-events-none drop-shadow-sm"
                  />)
                  }
            

                  {/* 5. Miniature Building Roof / Tower Structure */}
                  {buildingLayers.roof && buildingLayers.roof != 'X' && (
                    <image
                      href={buildingLayers.roof}
                      x={roofX}
                      y={roofY}
                      width={roofWidth}
                      height={roofHeight}
                      preserveAspectRatio="xMidYMid meet"
                      className="pointer-events-none drop-shadow-lg"
                    />
                  )}

       

                  {/* 7. Player Alien Figure: ONLY on the territory last clicked/operated by the player */}
                  {isSelected && (
                    <image
                      href={FACTION_ALIENS.player} 
                      x={cx + 7}
                      y={cy - 20}
                      width={22}
                      height={32}
                      preserveAspectRatio="xMidYMid meet"
                      className="pointer-events-none drop-shadow-xl character-bounce"
                    />
                  )}

        

                  {/* 9. Level Battery Meter (電量表條槓: Lv.1=1條, Lv.2=2條...) */}
                  <g transform={`translate(${cx - 32}, ${cy - 8})`} className="pointer-events-none select-none">
                    {/* Outer Battery Shell */}
                    <rect
                      x="-7"
                      y="-12"
                      width="12"
                      height="25"
                      rx="2.5"
                      fill="rgba(15, 23, 42, 0.92)"
                      stroke={
                        isSelected
                          ? '#38bdf8'
                          : attackable
                            ? '#fbbf24'
                            : isPlayer
                              ? '#22c55e'
                              : terr.ownerId === 'enemy_red'
                                ? '#f43f5e'
                                : '#94a3b8'
                      }
                      strokeWidth="1"
                      className="drop-shadow-sm"
                    />

                    {/* 5 Battery Energy Segments */}
                    {[0, 1, 2, 3, 4].map((barIdx) => {
                      const isFilled = barIdx < terr.level;
                      const barY = -10 + barIdx * 4.2;
                      return (
                        <rect
                          key={barIdx}
                          x="-5"
                          y={barY}
                          width="8"
                          height="3"
                          rx="0.8"
                          fill={
                            isFilled
                              ? isPlayer
                                ? '#22c55e'
                                : terr.ownerId === 'enemy_red'
                                  ? '#ef4444'
                                  : '#f59e0b'
                              : 'rgba(255, 255, 255, 0.12)'
                          }
                        />
                      );
                    })}
                  </g>

                  {/* Outer Attackable Pulsing Ring */}
                  {attackable && (
                    <polygon
                      points={pulseFacetPts}
                      fill="none"
                      stroke="#245dfb"
                      strokeWidth="3"
                      strokeDasharray="6,4"
                      filter="url(#attack-glow)"
                      className="animate-pulse opacity-95"
                    />
                  )}

                  {/* 10. Defense HP Bar if damaged */}
                  {terr.defenseHealth < terr.maxDefenseHealth && (
                    <g transform={`translate(${cx - 16}, ${cy + 25})`}>
                      <rect x="0" y="0" width="32" height="3" rx="1.5" fill="rgba(15, 23, 42, 0.9)" />
                      <rect
                        x="0"
                        y="0"
                        width={Math.max(2, (terr.defenseHealth / terr.maxDefenseHealth) * 32)}
                        height="3"
                        rx="1.5"
                        fill="#ef4444"
                      />
                    </g>
                  )}

                  
                </g>
              );
            })}
            {activeEnemyAttack && (() => {
              const origin = territories.find((territory) => territory.id === activeEnemyAttack.originId);
              const target = territories.find((territory) => territory.id === activeEnemyAttack.targetId);
              if (!origin || !target) return null;

              const start = axialToIsometric(origin.q, origin.r);
              const end = axialToIsometric(target.q, target.r);
              const path = `M ${start.cx} ${start.cy} L ${end.cx} ${end.cy}`;
              const alienImage =  FACTION_ALIENS.enemy_red;
              const cycleProgress = enemyAttackProgress >= 1
                ? 1
                : (enemyAttackProgress * ENEMY_ATTACK_ANIMATION_CYCLES) % 1;
              const easedProgress = cycleProgress * cycleProgress * (3 - 2 * cycleProgress);
              const personX = start.cx + (end.cx - start.cx) * easedProgress;
              const personY = start.cy + (end.cy - start.cy) * easedProgress;

              return (
                <g key={`enemy-attack-${activeEnemyAttack.originId}-${activeEnemyAttack.targetId}`} pointerEvents="none">
                  {activeEnemyAttack.phase === 'approaching' ? (
                    <>
                      <path
                        d={path}
                        fill="none"
                        stroke="#fb7185"
                        strokeWidth="5"
                        strokeDasharray="9 8"
                        strokeLinecap="round"
                        opacity="0.9"
                        markerEnd="url(#enemy-attack-arrow)"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="68"
                          to="0"
                          dur={`${ENEMY_ATTACK_CYCLE_DURATION_MS / 1000}s`}
                          repeatCount={ENEMY_ATTACK_ANIMATION_CYCLES}
                          fill="freeze"
                        />
                      </path>
                      <image
                        href={alienImage}
                        x={personX - 17}
                        y={personY - 29}
                        width="34"
                        height="44"
                        preserveAspectRatio="xMidYMid meet"
                        className="drop-shadow-xl"
                      />
                    </>
                  ) : (
                    <>
                      <circle cx={end.cx} cy={end.cy} r="37" fill="rgba(244, 63, 94, 0.18)" stroke="#fb7185" strokeWidth="3" className="animate-ping" />
                      <image
                        href={alienImage}
                        x={end.cx - 17}
                        y={end.cy - 29}
                        width="34"
                        height="44"
                        preserveAspectRatio="xMidYMid meet"
                        className="drop-shadow-xl character-bounce"
                      />
                      <text
                        x={end.cx}
                        y={end.cy - 38}
                        fill="#fecdd3"
                        fontSize="14"
                        fontWeight="bold"
                        textAnchor="middle"
                        paintOrder="stroke"
                        stroke="#4c0519"
                        strokeWidth="3"
                      >
                        {t('敵方佔領')}
                      </text>
                    </>
                  )}
                </g>
              );
            })()}
          </g>
        </svg>
      </div>

      {/* Map Legend Footer */}
      <div className="bg-slate-900/95 border-t border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-600 border border-emerald-400"></span>
            <span className="text-slate-200 font-medium">{t('玩家領地 (tileGrass)')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-amber-600 border border-amber-400"></span>
            <span className="text-amber-200 font-medium">{t('中立領地 (tileSand)')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-rose-700 border border-rose-400"></span>
            <span className="text-rose-200 font-medium">{t('赤紅軍團 (tileLava)')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded border-2 border-dashed border-amber-400 bg-amber-950/40"></span>
            <span className="text-amber-300 font-semibold">{t('可攻打領地 (相鄰)')}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Layers size={13} className="text-slate-400" />
            {t('點擊土地查看詳情 · 拖曳地圖 · 滾輪縮放')}
          </span>
        </div>
      </div>
    </div>
  );
};
