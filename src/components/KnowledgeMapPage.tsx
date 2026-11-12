import React, { useMemo, useRef, useState } from 'react';
import { ArrowLeft, BookOpen, Minus, Plus, RotateCcw, Search } from 'lucide-react';
import knowledgeMap from '../../apcs_knowledge_map.json';
import { BIOME_TILES } from '../utils/hexAssets';
import { axialToIsometric, getIsometricHexPoints, HEX_DIRECTIONS } from '../utils/hexMath';
import { KnowledgeMapNode, layoutKnowledgeNodes } from '../utils/knowledgeMapLayout';

const data = knowledgeMap as {
  title: string;
  description: string;
  categories: Record<string, { name: string; color: string; stroke: string }>;
  nodes: KnowledgeMapNode[];
};

const CATEGORY_TILES = [
  BIOME_TILES.playerGrass,
  BIOME_TILES.neutralSand,
  BIOME_TILES.enemyLava,
];
const TILE_SCALE = 1.05;
const VIEW_WIDTH = 1000;
const VIEW_HEIGHT = 680;

export const KnowledgeMapPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState(data.nodes[0]?.id ?? '');
  const [search, setSearch] = useState('');
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const positions = useMemo(() => layoutKnowledgeNodes(data.nodes), []);
  const nodesById = useMemo(() => new Map(data.nodes.map((node) => [node.id, node])), []);
  const categories = Object.entries(data.categories);
  const selectedNode = nodesById.get(selectedId) ?? data.nodes[0];
  const selectedPosition = selectedNode ? positions.get(selectedNode.id) : undefined;
  const selectedLinks = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    return new Set([...selectedNode.prerequisites, ...selectedNode.nextConcepts]);
  }, [selectedNode]);

  const tilePositions = useMemo(() => data.nodes.map((node, index) => {
    const coordinate = positions.get(node.id)!;
    return {
      node,
      index,
      ...axialToIsometric(coordinate.q, coordinate.r, TILE_SCALE),
    };
  }), [positions]);
  const bounds = useMemo(() => {
    const xs = tilePositions.map(({ x, width }) => [x, x + width]).flat();
    const ys = tilePositions.map(({ y, height }) => [y, y + height]).flat();
    const padding = 35;
    const minX = Math.min(...xs) - padding;
    const maxX = Math.max(...xs) + padding;
    const minY = Math.min(...ys) - padding;
    const maxY = Math.max(...ys) + padding;
    return {
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
      width: maxX - minX,
      height: maxY - minY,
    };
  }, [tilePositions]);
  const fitZoom = Math.min((VIEW_WIDTH - 80) / bounds.width, (VIEW_HEIGHT - 80) / bounds.height);
  const [zoom, setZoom] = useState(fitZoom);

  const searchResults = search.trim()
    ? data.nodes.filter((node) =>
        `${node.id} ${node.name}`.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase())
      ).slice(0, 6)
    : [];
  const directAdjacencyCount = data.nodes.reduce((count, node) => {
    const position = positions.get(node.id)!;
    return count + node.prerequisites.filter((id) => {
      const prerequisitePosition = positions.get(id)!;
      return HEX_DIRECTIONS.some(
        ({ q, r }) => prerequisitePosition.q === position.q + q && prerequisitePosition.r === position.r + r
      );
    }).length;
  }, 0);
  const prerequisiteCount = data.nodes.reduce((count, node) => count + node.prerequisites.length, 0);
  const matchedIds = new Set(searchResults.map((node) => node.id));

  const selectNode = (node: KnowledgeMapNode) => {
    setSelectedId(node.id);
    setSearch('');
  };

  const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
    if (event.button !== 0) return;
    setDragging(true);
    dragStart.current = { x: event.clientX, y: event.clientY };
    panStart.current = pan;
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging) return;
    setPan({
      x: panStart.current.x + (event.clientX - dragStart.current.x) * VIEW_WIDTH / event.currentTarget.clientWidth,
      y: panStart.current.y + (event.clientY - dragStart.current.y) * VIEW_HEIGHT / event.currentTarget.clientHeight,
    });
  };

  const resetView = () => {
    setZoom(fitZoom);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="flex h-screen min-h-[620px] w-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      <header className="flex min-h-[68px] items-center justify-between gap-4 border-b border-slate-800 bg-slate-900 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <img
            src={`${import.meta.env.BASE_URL}assets/aistudio/alienBlue_63396983.png`}
            alt=""
            className="h-9 w-9 object-contain drop-shadow"
          />
          <div>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-extrabold tracking-tight text-white">知識領主</span>
              <span className="text-[10px] font-mono tracking-wider text-slate-400">KNOWLEDGE CONQUEST</span>
            </div>
            <p className="text-xs text-slate-400">APCS 知識六角領地</p>
          </div>
        </div>
        <a
          href={import.meta.env.BASE_URL}
          className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 transition-colors hover:bg-slate-700"
        >
          <ArrowLeft size={15} />
          返回主地圖
        </a>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(460px,1fr)_minmax(320px,auto)] gap-3 overflow-y-auto p-3 lg:grid-cols-[minmax(0,1fr)_320px] lg:grid-rows-1 lg:overflow-hidden">
        <section className="relative flex min-h-[460px] flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl">
          <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-lg border border-slate-700/70 bg-slate-900/90 px-3 py-2 text-xs shadow-lg backdrop-blur">
            <div className="flex items-center gap-2 font-medium text-slate-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              六角知識領地 · APCS 概念地圖
            </div>
            <div className="mt-1 font-mono text-[10px] text-slate-400">
              {data.nodes.length} 塊領地 · 先備相鄰 {directAdjacencyCount}/{prerequisiteCount}
            </div>
          </div>

          <div className="absolute left-3 top-[76px] z-10 w-[min(260px,calc(100%-80px))]">
            <label className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/95 px-3 py-2 shadow-lg">
              <Search size={15} className="shrink-0 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="搜尋概念名稱或代碼"
                className="w-full bg-transparent text-xs text-slate-100 outline-none placeholder:text-slate-500"
                aria-label="搜尋知識概念"
              />
            </label>
            {searchResults.length > 0 && (
              <div className="mt-1 overflow-hidden rounded-lg border border-slate-700 bg-slate-900 shadow-xl">
                {searchResults.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => selectNode(node)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-slate-800"
                  >
                    <span className="font-mono text-sky-300">{node.id}</span>
                    <span className="truncate text-slate-200">{node.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5 rounded-lg border border-slate-700/70 bg-slate-900/90 p-1.5 shadow-lg backdrop-blur">
            <button onClick={() => setZoom((value) => Math.min(2.5, value + 0.15))} title="放大" className="rounded p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white">
              <Plus size={16} />
            </button>
            <button onClick={() => setZoom((value) => Math.max(0.45, value - 0.15))} title="縮小" className="rounded p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white">
              <Minus size={16} />
            </button>
            <button onClick={resetView} title="重設視角" className="rounded p-1.5 text-slate-300 hover:bg-slate-800 hover:text-white">
              <RotateCcw size={15} />
            </button>
          </div>

          <svg
            className={`h-full w-full flex-1 ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={() => setDragging(false)}
            onMouseLeave={() => setDragging(false)}
            onWheel={(event) => {
              setZoom((value) => Math.min(2.5, Math.max(0.45, value + (event.deltaY < 0 ? 0.1 : -0.1))));
            }}
          >
            <defs>
              <pattern id="knowledge-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(51, 65, 85, 0.25)" strokeWidth="0.8" />
              </pattern>
              <filter id="knowledge-glow" x="-35%" y="-35%" width="170%" height="170%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <rect width="100%" height="100%" fill="url(#knowledge-grid)" />
            <g transform={`translate(${VIEW_WIDTH / 2 + pan.x} ${VIEW_HEIGHT / 2 + pan.y}) scale(${zoom}) translate(${-bounds.centerX} ${-bounds.centerY})`}>
              {selectedNode && selectedPosition && tilePositions.map(({ node }) => {
                if (!selectedLinks.has(node.id) || !nodesById.has(node.id)) return null;
                const endpoint = positions.get(node.id)!;
                const target = axialToIsometric(endpoint.q, endpoint.r, TILE_SCALE);
                const source = axialToIsometric(selectedPosition.q, selectedPosition.r, TILE_SCALE);
                const isPrerequisite = selectedNode.prerequisites.includes(node.id);
                const isAdjacent = HEX_DIRECTIONS.some(
                  ({ q, r }) => endpoint.q === selectedPosition.q + q && endpoint.r === selectedPosition.r + r
                );
                if (isAdjacent) return null;
                return (
                  <path
                    key={`link-${node.id}`}
                    d={`M ${source.cx} ${source.cy} Q ${(source.cx + target.cx) / 2} ${(source.cy + target.cy) / 2 - 22} ${target.cx} ${target.cy}`}
                    fill="none"
                    stroke={isPrerequisite ? '#fbbf24' : '#38bdf8'}
                    strokeWidth="2"
                    strokeDasharray="5 5"
                    opacity="0.8"
                    pointerEvents="none"
                  />
                );
              })}

              {tilePositions.map(({ node, index, x, y, cx, cy, width, height }) => {
                const categoryIndex = categories.findIndex(([id]) => id === node.category);
                const category = data.categories[node.category];
                const color = category?.color ?? '#cbd5e1';
                const stroke = category?.stroke ?? '#94a3b8';
                const isSelected = selectedId === node.id;
                const isLinked = selectedLinks.has(node.id);
                const isSearchMatch = matchedIds.has(node.id);
                const title = node.name.length > 6 ? `${node.name.slice(0, 6)}…` : node.name;
                const topPoints = getIsometricHexPoints(cx, cy, TILE_SCALE);
                const tileImage = CATEGORY_TILES[(categoryIndex < 0 ? 0 : categoryIndex) % CATEGORY_TILES.length];
                return (
                  <g
                    key={node.id}
                    onClick={() => selectNode(node)}
                    className="cursor-pointer"
                    role="button"
                    aria-label={`${node.id} ${node.name}`}
                  >
                    <title>{`${node.id}｜${node.name}`}</title>
                    <image href={tileImage} x={x} y={y} width={width} height={height} preserveAspectRatio="none" pointerEvents="none" />
                    <polygon
                      points={topPoints}
                      fill={color}
                      fillOpacity={isSelected ? 0.55 : isLinked ? 0.4 : 0.28}
                      stroke={isSelected ? '#38bdf8' : isLinked ? '#fbbf24' : stroke}
                      strokeWidth={isSelected ? 3.2 : isLinked ? 2.2 : 1.25}
                      filter={isSelected ? 'url(#knowledge-glow)' : undefined}
                    />
                    {isSearchMatch && !isSelected && (
                      <polygon points={getIsometricHexPoints(cx, cy, TILE_SCALE, 3)} fill="none" stroke="#fff" strokeWidth="2.5" strokeDasharray="4 3" />
                    )}
                    <text x={cx} y={cy - 2} textAnchor="middle" fill="#f8fafc" fontSize="8.5" fontWeight="700" className="pointer-events-none" style={{ paintOrder: 'stroke', stroke: '#0f172a', strokeWidth: 2.5 }}>
                      {node.id}
                    </text>
                    <text x={cx} y={cy + 9} textAnchor="middle" fill="white" fontSize="7.5" fontWeight="600" className="pointer-events-none" style={{ paintOrder: 'stroke', stroke: '#0f172a', strokeWidth: 2 }}>
                      {title}
                    </text>
                    <text x={cx} y={cy + 20} textAnchor="middle" fill="#e2e8f0" fontSize="6" className="pointer-events-none" style={{ paintOrder: 'stroke', stroke: '#0f172a', strokeWidth: 1.5 }}>
                      {categories.find(([id]) => id === node.category)?.[1].name ?? `領地 ${index + 1}`}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-lg border border-slate-800/80 bg-slate-900/85 px-3 py-2 text-[10px] text-slate-400">
            拖曳移動 · 滾輪縮放 · 點擊領地查看概念
          </div>
        </section>

        <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-xl">
          <div className="border-b border-slate-800 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <BookOpen size={15} className="text-sky-400" />
              APCS 知識領地
            </div>
            <h1 className="mt-2 text-lg font-bold text-white">{data.title}</h1>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">{data.description}</p>
          </div>

          {selectedNode ? (
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-mono text-xs font-bold text-sky-300">{selectedNode.id}</div>
                  <h2 className="mt-1 text-base font-bold leading-snug text-white">{selectedNode.name}</h2>
                </div>
                <span
                  className="shrink-0 rounded-full border px-2 py-1 text-[10px]"
                  style={{
                    color: data.categories[selectedNode.category]?.color ?? '#cbd5e1',
                    borderColor: data.categories[selectedNode.category]?.stroke ?? '#94a3b8',
                    backgroundColor: `${data.categories[selectedNode.category]?.stroke ?? '#94a3b8'}22`,
                  }}
                >
                  {data.categories[selectedNode.category]?.name ?? selectedNode.category}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{selectedNode.description}</p>

              <div className="mt-5">
                <h3 className="mb-2 text-xs font-semibold text-amber-300">先備概念</h3>
                {selectedNode.prerequisites.length ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.prerequisites.map((id) => {
                      const node = nodesById.get(id)!;
                      return (
                        <button key={id} onClick={() => selectNode(node)} className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-left text-xs text-amber-100 hover:bg-amber-500/20">
                          <span className="mr-1 font-mono text-amber-300">{id}</span>{node.name}
                        </button>
                      );
                    })}
                  </div>
                ) : <p className="text-xs text-slate-500">無先備概念</p>}
              </div>

              <div className="mt-5">
                <h3 className="mb-2 text-xs font-semibold text-sky-300">後續概念</h3>
                {selectedNode.nextConcepts.length ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.nextConcepts.map((id) => {
                      const node = nodesById.get(id)!;
                      return (
                        <button key={id} onClick={() => selectNode(node)} className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-left text-xs text-sky-100 hover:bg-sky-500/20">
                          <span className="mr-1 font-mono text-sky-300">{id}</span>{node.name}
                        </button>
                      );
                    })}
                  </div>
                ) : <p className="text-xs text-slate-500">目前沒有後續概念</p>}
              </div>

              <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <p className="text-[10px] leading-relaxed text-slate-400">
                  六角領地最多只有六個直接鄰位；超出鄰位的先備關係以虛線連結呈現。先備概念在此顯示於目前領地之前。
                </p>
              </div>
            </div>
          ) : null}

          <div className="border-t border-slate-800 p-4">
            <h3 className="mb-3 text-xs font-semibold text-slate-400">知識領域</h3>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {categories.map(([id, category]) => (
                <div key={id} className="flex min-w-0 items-center gap-2 text-[10px] text-slate-300">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-sm border" style={{ backgroundColor: `${category.color}66`, borderColor: category.stroke }} />
                  <span className="truncate">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};
