import { Territory, FactionId, TerritoryType } from '../types/game';

interface RawHexDefinition {
  q: number;
  r: number;
  name: string;
  ownerId: FactionId;
  level: number;
  droneLevel: number;
  territoryType: TerritoryType;
  resourceRate: number;
  biome: 'grass' | 'autumn' | 'sand' | 'snow' | 'lava' | 'magic' | 'stone' | 'rock';
  decoration: 'trees' | 'pines' | 'cactus' | 'rocks' | 'hills' | 'flowers' | 'none';
}

const RAW_MAP: RawHexDefinition[] = [
  // Center & Player Start
  { q: 0, r: 0, name: '智者衛城 (首府)', ownerId: 'player', level: 1, droneLevel: 1, territoryType: 'capital', resourceRate: 15, biome: 'grass', decoration: 'trees' },

  // Ring 1 (Immediate neighbors to player)
  { q: 1, r: 0, name: '青苔林野', ownerId: 'neutral', level: 1, droneLevel: 1, territoryType: 'standard', resourceRate: 10, biome: 'grass', decoration: 'pines' },
  { q: 1, r: -1, name: '鐵砂礦脈', ownerId: 'neutral', level: 1, droneLevel: 1, territoryType: 'mine', resourceRate: 25, biome: 'sand', decoration: 'rocks' },
  { q: 0, r: -1, name: '智慧聖所', ownerId: 'neutral', level: 2, droneLevel: 2, territoryType: 'academy', resourceRate: 12, biome: 'magic', decoration: 'flowers' },
  { q: -1, r: 0, name: '微風丘陵', ownerId: 'neutral', level: 1, droneLevel: 1, territoryType: 'standard', resourceRate: 10, biome: 'autumn', decoration: 'hills' },
  { q: -1, r: 1, name: '石英峽谷', ownerId: 'neutral', level: 2, droneLevel: 2, territoryType: 'standard', resourceRate: 14, biome: 'stone', decoration: 'rocks' },
  { q: 0, r: 1, name: '朝陽草原', ownerId: 'neutral', level: 1, droneLevel: 1, territoryType: 'standard', resourceRate: 10, biome: 'grass', decoration: 'flowers' },

  // Ring 2 (Intermediate challenges)
  { q: 2, r: 0, name: '赤紅先鋒哨站', ownerId: 'enemy_red', level: 2, droneLevel: 2, territoryType: 'fortress', resourceRate: 16, biome: 'lava', decoration: 'none' },
  { q: 2, r: -1, name: '硫磺裂谷', ownerId: 'neutral', level: 2, droneLevel: 2, territoryType: 'mine', resourceRate: 28, biome: 'sand', decoration: 'cactus' },
  { q: 2, r: -2, name: '赤紅核心城塞', ownerId: 'enemy_red', level: 3, droneLevel: 3, territoryType: 'capital', resourceRate: 35, biome: 'lava', decoration: 'rocks' },
  { q: 1, r: -2, name: '高能電晶平原', ownerId: 'neutral', level: 2, droneLevel: 2, territoryType: 'standard', resourceRate: 16, biome: 'magic', decoration: 'hills' },
  { q: 0, r: -2, name: '星象古天文臺', ownerId: 'neutral', level: 3, droneLevel: 3, territoryType: 'academy', resourceRate: 20, biome: 'stone', decoration: 'hills' },
  { q: -1, r: -1, name: '迷霧沼澤', ownerId: 'neutral', level: 2, droneLevel: 2, territoryType: 'standard', resourceRate: 12, biome: 'autumn', decoration: 'pines' },
  { q: -2, r: 0, name: '赤紅巡守站', ownerId: 'enemy_red', level: 2, droneLevel: 2, territoryType: 'fortress', resourceRate: 15, biome: 'lava', decoration: 'none' },
  { q: -2, r: 1, name: '鐵砂礦脈東區', ownerId: 'neutral', level: 3, droneLevel: 3, territoryType: 'mine', resourceRate: 30, biome: 'sand', decoration: 'rocks' },
  { q: -2, r: 2, name: '赤紅先遣堡壘', ownerId: 'enemy_red', level: 4, droneLevel: 4, territoryType: 'capital', resourceRate: 40, biome: 'lava', decoration: 'rocks' },
  { q: -1, r: 2, name: '黃沙古隘道', ownerId: 'neutral', level: 3, droneLevel: 3, territoryType: 'standard', resourceRate: 18, biome: 'sand', decoration: 'cactus' },
  { q: 0, r: 2, name: '泰坦之門', ownerId: 'neutral', level: 3, droneLevel: 3, territoryType: 'fortress', resourceRate: 22, biome: 'sand', decoration: 'rocks' },
  { q: 1, r: 1, name: '荒原綠洲邊界', ownerId: 'neutral', level: 2, droneLevel: 2, territoryType: 'standard', resourceRate: 15, biome: 'sand', decoration: 'trees' },

  // Ring 3 (High level / End-game targets)
  { q: 2, r: -3, name: '烈焰熔爐要塞', ownerId: 'enemy_red', level: 4, droneLevel: 4, territoryType: 'fortress', resourceRate: 45, biome: 'lava', decoration: 'rocks' },
  { q: 0, r: -3, name: '先祖知識聖殿', ownerId: 'neutral', level: 4, droneLevel: 4, territoryType: 'academy', resourceRate: 35, biome: 'sand', decoration: 'hills' },
  { q: -3, r: 2, name: '熔岩熱能工廠', ownerId: 'enemy_red', level: 4, droneLevel: 4, territoryType: 'mine', resourceRate: 50, biome: 'lava', decoration: 'rocks' },
  { q: -3, r: 3, name: '赤曜魔王殿', ownerId: 'enemy_red', level: 5, droneLevel: 5, territoryType: 'fortress', resourceRate: 60, biome: 'lava', decoration: 'none' },
  { q: 0, r: 3, name: '天空之城遺址', ownerId: 'neutral', level: 4, droneLevel: 4, territoryType: 'academy', resourceRate: 40, biome: 'sand', decoration: 'hills' },
  { q: 3, r: -1, name: '赤帝王座', ownerId: 'enemy_red', level: 5, droneLevel: 5, territoryType: 'fortress', resourceRate: 70, biome: 'lava', decoration: 'none' },
  { q: 1, r: 2, name: '神聖知識樞紐', ownerId: 'neutral', level: 5, droneLevel: 5, territoryType: 'capital', resourceRate: 65, biome: 'sand', decoration: 'flowers' },
];

export function createInitialTerritories(): Territory[] {
  return RAW_MAP.map((raw) => {
    const isPlayer = raw.ownerId === 'player';
    return {
      id: `terr_${raw.q}_${raw.r}`,
      q: raw.q,
      r: raw.r,
      name: raw.name,
      ownerId: raw.ownerId,
      level: raw.level,
      droneLevel: raw.droneLevel,
      biome: raw.biome,
      decoration: raw.decoration,
      buildings: isPlayer
        ? [
            {
              id: 'bld_initial_factory',
              type: 'coin_factory',
              level: 1,
              name: '金幣工廠',
              description: '每 5 秒自動產出 +8 金幣',
              cost: 80,
            },
          ]
        : [],
      defenseHealth: raw.level * 100,
      maxDefenseHealth: raw.level * 100,
      resourceRate: raw.resourceRate,
      territoryType: raw.territoryType,
    };
  });
}

export const FACTION_INFO: Record<
  FactionId,
  {
    name: string;
    fillColor: string;
    strokeColor: string;
    glowColor: string;
    textColor: string;
    banner: string;
  }
> = {
  player: {
    name: '玩家領地 (綠草地)',
    fillColor: '#15803d', // Green-700
    strokeColor: '#22c55e', // Green-500
    glowColor: 'rgba(34, 197, 94, 0.4)',
    textColor: '#dcfce7',
    banner: 'bg-emerald-950/80 border-emerald-500 text-emerald-200',
  },
  neutral: {
    name: '中立領地 (黃沙地)',
    fillColor: '#78350f', // Amber-900
    strokeColor: '#f59e0b', // Amber-500
    glowColor: 'rgba(245, 158, 11, 0.3)',
    textColor: '#fef3c7',
    banner: 'bg-amber-950/80 border-amber-600 text-amber-200',
  },
  enemy_red: {
    name: '赤紅軍團 (赤熔岩)',
    fillColor: '#881337', // Rose-900
    strokeColor: '#f43f5e', // Rose-500
    glowColor: 'rgba(244, 63, 94, 0.35)',
    textColor: '#ffe4e6',
    banner: 'bg-rose-950/80 border-rose-500 text-rose-200',
  },
  enemy_purple: {
    name: '赤紅軍團 (赤熔岩)',
    fillColor: '#881337',
    strokeColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.35)',
    textColor: '#ffe4e6',
    banner: 'bg-rose-950/80 border-rose-500 text-rose-200',
  },
};
