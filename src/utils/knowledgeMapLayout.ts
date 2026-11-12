import { HexCoord, HEX_DIRECTIONS } from './hexMath';

export interface KnowledgeMapNode {
  id: string;
  name: string;
  category: string;
  description: string;
  prerequisites: string[];
  nextConcepts: string[];
}

export function layoutKnowledgeNodes(nodes: KnowledgeMapNode[]): Map<string, HexCoord> {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  if (nodesById.size !== nodes.length) {
    throw new Error('知識地圖包含重複的節點 ID。');
  }

  const neighbors = new Map<string, Set<string>>();
  for (const node of nodes) {
    neighbors.set(node.id, new Set());
    for (const prerequisiteId of node.prerequisites) {
      if (!nodesById.has(prerequisiteId)) {
        throw new Error(`節點 ${node.id} 的先備概念 ${prerequisiteId} 不存在。`);
      }
      neighbors.get(node.id)!.add(prerequisiteId);
      neighbors.get(prerequisiteId)!.add(node.id);
    }
  }

  const remaining = new Set(nodes.map((node) => node.id));
  const positions = new Map<string, HexCoord>();
  const occupied = new Map<string, string>();
  const positionKey = ({ q, r }: HexCoord) => `${q},${r}`;
  const first = [...nodes].sort(
    (a, b) => neighbors.get(b.id)!.size - neighbors.get(a.id)!.size || a.id.localeCompare(b.id)
  )[0];

  if (!first) return positions;

  positions.set(first.id, { q: 0, r: 0 });
  occupied.set('0,0', first.id);
  remaining.delete(first.id);

  while (remaining.size > 0) {
    const placedIds = new Set(positions.keys());
    const nextId = [...remaining].sort((a, b) => {
      const aPlacedLinks = [...neighbors.get(a)!].filter((id) => placedIds.has(id)).length;
      const bPlacedLinks = [...neighbors.get(b)!].filter((id) => placedIds.has(id)).length;
      return bPlacedLinks - aPlacedLinks
        || neighbors.get(b)!.size - neighbors.get(a)!.size
        || a.localeCompare(b);
    })[0];

    const candidates = new Map<string, HexCoord>();
    for (const { q, r } of positions.values()) {
      for (const direction of HEX_DIRECTIONS) {
        const candidate = { q: q + direction.q, r: r + direction.r };
        if (!occupied.has(positionKey(candidate))) candidates.set(positionKey(candidate), candidate);
      }
    }

    let bestPosition: HexCoord | undefined;
    let bestScore = Number.NEGATIVE_INFINITY;
    for (const candidate of candidates.values()) {
      let linkedNeighbors = 0;
      let occupiedNeighbors = 0;
      for (const direction of HEX_DIRECTIONS) {
        const adjacentId = occupied.get(positionKey({
          q: candidate.q + direction.q,
          r: candidate.r + direction.r,
        }));
        if (adjacentId) {
          occupiedNeighbors += 1;
          if (neighbors.get(nextId)!.has(adjacentId)) linkedNeighbors += 1;
        }
      }

      const score = linkedNeighbors * 100 + occupiedNeighbors * 5
        - (Math.abs(candidate.q) + Math.abs(candidate.r) + Math.abs(candidate.q + candidate.r)) * 0.05;
      if (score > bestScore) {
        bestScore = score;
        bestPosition = candidate;
      }
    }

    if (!bestPosition) throw new Error(`無法為節點 ${nextId} 配置六角領地。`);
    positions.set(nextId, bestPosition);
    occupied.set(positionKey(bestPosition), nextId);
    remaining.delete(nextId);
  }

  return positions;
}
