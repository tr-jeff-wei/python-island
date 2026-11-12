import { FactionId, Territory } from '../types/game';

const withBasePath = <T,>(value: T): T => {
  if (typeof value === 'string') {
    return `${import.meta.env.BASE_URL}${value.replace(/^\/+/, '')}` as T;
  }
  if (Array.isArray(value)) return value.map(withBasePath) as T;
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, withBasePath(item)])
    ) as T;
  }
  return value;
};

// Base Biome Hex Tile Assets
export const BIOME_TILES = withBasePath({
  playerGrass: '/assets/aistudio/tileGrass_ecfc9be2.png',
  playerGrassFull: '/assets/aistudio/tileGrass_full_d7c66c9e.png',
  neutralSand: '/assets/aistudio/tileSand_d5acc931.png',
  neutralSandFull: '/assets/aistudio/tileSand_full_29c532dc.png',
  enemyLava: '/assets/aistudio/tileLava_4339afc6.png',
  enemyLavaFull: '/assets/aistudio/tileLava_full_d8a2c5e8.png',
});

// Miniature Structure Sprites (Roofs, Rings, Gates)
export const STRUCTURE_ASSETS = withBasePath({
  // Turrets
  turret: '/assets/Objects/turret_medium.png',
  turret2: '/assets/Objects/wall_corner.png',
  // Factory
  factory: '/assets/Objects/scifi_corner.png',
  factory2: '/assets/Objects/sillo2.png',
  // Shields
  shield: '/assets/Objects/skyscraper_glass.png',
  shield2: '/assets/Objects/dish.png',
  // Institute
  institute: '/assets/Objects/oldBuilding.png',

  // Player & Enemy Bases
  playerBase: '/assets/Objects/scifi_hangar.png',
  enemyBase: '/assets/Objects/farm.png',
  
  // Roofs
  redRoofPointy: '/assets/aistudio/redRoofPointy_89bdeca7.png',
  redRoofTall: '/assets/aistudio/redRoofTall_98aa0c65.png',
  redRoofShort: '/assets/aistudio/woodRoofRounded_d01e18af.png',
  stoneRoofTall: '/assets/aistudio/stoneRoofTall_0880e2ba.png',
  stoneRoofPointy: '/assets/aistudio/stoneRoofRounded_8a7cb85a.png',
  sandRoofTall: '/assets/aistudio/sandRoofTall_60e59393.png',
  sandRoofPointy: '/assets/aistudio/tileSand_tile_9fa13554.png',
  woodRoofPointy: '/assets/aistudio/woodRoofPointy_19304816.png',

  // Walls & Rings
  stoneRing: '/assets/aistudio/stoneDoorWindowBlinds_c5df8f02.png',
  rockRing: '/assets/aistudio/rockRing_c4f12e32.png',
  sandRing: '/assets/aistudio/sandRing_679a6f63.png',
  woodRing: '/assets/aistudio/woodDoorWindowBlindsMirror_14dea1e7.png',

  // Gates & Doors
  stoneGateLeft: '/assets/aistudio/stoneGateLeft_948fddb0.png',
  rockGateLeft: '/assets/aistudio/rockGateLeft_1b921f17.png',
  gate: '/assets/aistudio/gate_8cddd5be.png',
  door: '/assets/aistudio/door_b8f23633.png',
  // Sand ground tiles
  sandGround: '/assets/Tiles/Terrain/Sand/sand_12.png',
  sandGround1: '/assets/Tiles/Terrain/Sand/sand_13.png',
  sandGround2: '/assets/Tiles/Terrain/Sand/sand_14.png',
  sandGround3: '/assets/Tiles/Terrain/Sand/sand_15.png',
  sandGround4: '/assets/Tiles/Terrain/Sand/sand_16.png',
  sandGround5: '/assets/Tiles/Terrain/Sand/sand_17.png',
  sandGround6: '/assets/Tiles/Terrain/Sand/sand_18.png',
  sandGround7: '/assets/Tiles/Terrain/Sand/sand_19.png',

  // enemies
  enemyRing1: '/assets/Tiles/Sci-fi/scifi_base.png',
  enemyRing2: '/assets/Tiles/Sci-fi/scifi_cargo.png',
  enemyRing3: '/assets/Tiles/Sci-fi/scifi_living.png',
  enemyRing4: '/assets/Tiles/Sci-fi/scifi_port.png'
  
});

// Nature & Environment Props
export const DECORATION_ASSETS = withBasePath({
  trees: {
    grass: '/assets/aistudio/treeGreen_high_72bc10ca.png',
    sand: '/assets/aistudio/treeCactus_1_c7bda061.png',
    lava: '/assets/aistudio/rockDirt_moss1_f496fe2f.png',
  },
  pines: {
    grass: '/assets/aistudio/pineGreen_high_e4194537.png',
    sand: '/assets/aistudio/treeCactus_2_733493c9.png',
  },
  cactus: '/assets/aistudio/treeCactus_1_c7bda061.png',
  hills: {
    grass: '/assets/aistudio/hillGrass_fd70ea89.png',
    sand: '/assets/aistudio/hillSand_048be56d.png',
  },
  rocks: {
    grass: '/assets/aistudio/rockStone_moss1_36d78c0c.png',
    sand: '/assets/aistudio/rockDirt_b83e6fbe.png',
    lava: '/assets/aistudio/rockStone_7ec72549.png',
  },
  flowers: {
    red: '/assets/aistudio/flowerRed_6f4183ae.png',
    blue: '/assets/aistudio/flowerBlue_b58911fa.png',
    bush: '/assets/aistudio/bushGrass_ced2fd0a.png',
  },
});

// Faction Alien Avatars
export const FACTION_ALIENS: Record<string, string> = withBasePath({
  player: '/assets/aistudio/alienGreen_6156c614.png', // 玩家：藍色外星人
  enemy_red: '/assets/aistudio/alienPink_28ccb24d.png', // 赤紅軍團：米紅外星戰將
  enemy_purple: '/assets/aistudio/alienPink_28ccb24d.png', // 兼容fallback
  neutral: '/assets/aistudio/alienGreen_6156c614.png', // 中立領地：綠色守護精靈
});

export const BOSS_ALIEN = withBasePath('/assets/aistudio/alienYellow_5b626454.png'); // 高階中立泰坦守護者

/**
 * 依據勢力嚴格區分六角土地外觀：
 * - 玩家：tileGrass (綠草地)
 * - 中立領地：tileSand (黃沙地)
 * - 赤紅軍團：tileLava (赤熔岩)
 */
export function getTerritoryTileImage(terr: Territory): string {
  if (terr.ownerId === 'player') {
    // return terr.territoryType === 'capital' || terr.territoryType === 'fortress'
    //   ? BIOME_TILES.playerGrassFull
    //   : BIOME_TILES.playerGrass;
    return BIOME_TILES.playerGrass;
  }
  if (terr.ownerId === 'enemy_red' || terr.ownerId === 'enemy_purple') {
    // return terr.territoryType === 'capital' || terr.territoryType === 'fortress'
    //   ? BIOME_TILES.enemyLavaFull
    //   : BIOME_TILES.enemyLava;
    return BIOME_TILES.enemyLava;
  }
  // 中立領地：tileSand
  // return terr.territoryType === 'capital' || terr.territoryType === 'fortress'
  //   ? BIOME_TILES.neutralSandFull
  //   : BIOME_TILES.neutralSand;
  return BIOME_TILES.neutralSand;
}

/**
 * 回傳領地上的小型建築層（縮小比例）
 */
export function getTerritoryBuildingLayers(terr: Territory): {
  turret?: string;
  turret2?: string;
  ring?: string;
  roof?: string;
  gate?: string;
  factory?: string;
  factory2?: string;
  shield?: string;
  shield2?: string;
  institute?: string;
} {
  const isPlayer = terr.ownerId === 'player';
  const isRed = terr.ownerId === 'enemy_red' || terr.ownerId === 'enemy_purple';
  let hasTurret = false;
  let hasFactory = false;
  let hasShield = false;
  let hasInstitute = false;

  if (terr.buildings) {
    hasTurret = terr.buildings.some((b) => b.type === 'defense_turret');
    hasFactory = terr.buildings.some((b) => b.type === 'coin_factory');
    hasShield = terr.buildings.some((b) => b.type === 'energy_shield');
    hasInstitute = terr.buildings.some((b) => b.type === 'knowledge_institute');
  }

  if (hasTurret) {
    return {
      turret: STRUCTURE_ASSETS.turret,
      turret2: STRUCTURE_ASSETS.turret2
    };
  }
  if (hasFactory ) {
    return {
      factory: STRUCTURE_ASSETS.factory,
      factory2: STRUCTURE_ASSETS.factory2
    };
  }
  if (hasShield) {
    return {
      shield: STRUCTURE_ASSETS.shield,
      shield2: STRUCTURE_ASSETS.shield2
    };
  }
  if (hasInstitute) {
    return {
      institute: STRUCTURE_ASSETS.institute,
    };
  }

  let sandsgrounds = [
    STRUCTURE_ASSETS.sandGround,
    STRUCTURE_ASSETS.sandGround1,
    STRUCTURE_ASSETS.sandGround2,
    STRUCTURE_ASSETS.sandGround3,
    STRUCTURE_ASSETS.sandGround4,
    STRUCTURE_ASSETS.sandGround5,
    STRUCTURE_ASSETS.sandGround6
  ];
  let sandIndex = (Math.abs(terr.q) + Math.abs(terr.r)*2) % sandsgrounds.length;
  let sandGround = sandsgrounds[sandIndex];

  let enemyRings = [
    STRUCTURE_ASSETS.enemyRing1,
    STRUCTURE_ASSETS.enemyRing2,
    STRUCTURE_ASSETS.enemyRing3,
    STRUCTURE_ASSETS.enemyRing4
  ];
  let enemyRingIndex = (Math.abs(terr.q) + Math.abs(terr.r)*2) % enemyRings.length;
  let enemyRing = enemyRings[enemyRingIndex];
  
  return {
      
      ring: isRed ? enemyRing : isPlayer ? STRUCTURE_ASSETS.playerBase : sandGround
  };
  

}

/**
 * 回傳縮小比例的自然裝飾品
 */
export function getTerritoryDecoration(terr: Territory): string | null {
  const isPlayer = terr.ownerId === 'player';
  const isRed = terr.ownerId === 'enemy_red' || terr.ownerId === 'enemy_purple';
  const deco = terr.decoration || 'none';
  let hasTurret = false;
  let hasFactory = false;
  let hasShield = false;
  let hasInstitute = false;

  if (terr.buildings) {
    hasTurret = terr.buildings.some((b) => b.type === 'defense_turret');
    hasFactory = terr.buildings.some((b) => b.type === 'coin_factory');
    hasShield = terr.buildings.some((b) => b.type === 'energy_shield');
    hasInstitute = terr.buildings.some((b) => b.type === 'knowledge_institute');
  }
  if (isPlayer) {
    if (hasTurret || hasFactory || hasShield || hasInstitute) {
      return null; // 玩家建築所在的土地不顯示自然裝飾品
    }
    if (deco === 'pines') return DECORATION_ASSETS.pines.grass;
    if (deco === 'flowers') return DECORATION_ASSETS.flowers.red;
    if (deco === 'hills') return DECORATION_ASSETS.hills.grass;
    if (deco === 'rocks') return DECORATION_ASSETS.rocks.grass;
    return DECORATION_ASSETS.trees.grass;
  }

  if (isRed) {
    if (deco === 'rocks' || deco === 'none') return DECORATION_ASSETS.rocks.lava;
    return DECORATION_ASSETS.rocks.lava;
  }

  // 中立土地 (Sand)
  if (deco === 'cactus') return DECORATION_ASSETS.cactus;
  if (deco === 'hills') return DECORATION_ASSETS.hills.sand;
  if (deco === 'rocks') return DECORATION_ASSETS.rocks.sand;
  if (deco === 'trees') return DECORATION_ASSETS.trees.sand;
  return DECORATION_ASSETS.cactus;
}

/**
 * 回傳勢力角色外星人形象
 */
export function getTerritoryAlien(terr: Territory): string {
  if (terr.ownerId === 'neutral' && terr.level >= 4) {
    return BOSS_ALIEN;
  }
  return FACTION_ALIENS[terr.ownerId] || FACTION_ALIENS.neutral;
}
