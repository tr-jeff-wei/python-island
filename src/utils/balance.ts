import { DroneConfig, BuildingType } from '../types/game';

// Drone balance parameters for Levels 1 to 5 (strictly matching and expanding requirements)
export const DRONE_CONFIGS: Record<number, DroneConfig> = {
  1: {
    level: 1,
    name: '偵察巡邏無人機 (Lv.1)',
    maxHealth: 1, // 1 homing missile needed
    attackInterval: 10, // 10s per shot
    projectileSpeed: 140,
    bulletPattern: 'single',
    rewardCoins: 50,
  },
  2: {
    level: 2,
    name: '輕型戰術無人機 (Lv.2)',
    maxHealth: 2, // 2 homing missiles needed
    attackInterval: 8, // 8s per shot
    projectileSpeed: 170,
    bulletPattern: 'double',
    rewardCoins: 100,
  },
  3: {
    level: 3,
    name: '突擊防禦無人機 (Lv.3)',
    maxHealth: 3, // 3 homing missiles needed
    attackInterval: 6, // 6s per shot
    projectileSpeed: 200,
    bulletPattern: 'spread',
    rewardCoins: 180,
  },
  4: {
    level: 4,
    name: '重裝要塞無人機 (Lv.4)',
    maxHealth: 4, // 4 homing missiles needed
    attackInterval: 4, // 4s per shot
    projectileSpeed: 230,
    bulletPattern: 'spread',
    rewardCoins: 300,
  },
  5: {
    level: 5,
    name: '先鋒霸主戰略無人機 (Lv.5)',
    maxHealth: 5, // 5 homing missiles needed
    attackInterval: 3, // 3s per shot
    projectileSpeed: 260,
    bulletPattern: 'homing',
    rewardCoins: 500,
  },
};

// Building details & upgrade costs
export const BUILDING_TEMPLATES: Record<
  BuildingType,
  {
    name: string;
    description: string;
    baseCost: number;
    costMultiplier: number;
    maxLevel: number;
    effectDescription: (level: number) => string;
  }
> = {
  coin_factory: {
    name: '金幣工廠',
    description: '每隔 5 秒自動產出金幣，擴張經濟版圖。',
    baseCost: 80,
    costMultiplier: 1.6,
    maxLevel: 5,
    effectDescription: (lvl) => `每 5 秒自動產出 +${lvl * 8} 金幣`,
  },
  defense_turret: {
    name: '防禦砲塔',
    description: '戰鬥時對敵方無人機進行協同砲擊，並減少玩家受到的傷害。',
    baseCost: 120,
    costMultiplier: 1.8,
    maxLevel: 5,
    effectDescription: (lvl) => `戰鬥傷害減免 ${(lvl * 8)}%，每 ${(12 - lvl)} 秒自動砲擊敵方 1 次`,
  },
  energy_shield: {
    name: '能量護盾',
    description: '高能防護力場，吸收戰鬥時被攻擊彈擊中的損耗。',
    baseCost: 100,
    costMultiplier: 1.5,
    maxLevel: 5,
    effectDescription: (lvl) => `戰鬥初始獲得 ${lvl * 35} 點吸收護盾值`,
  },
  knowledge_institute: {
    name: '知識研究所',
    description: '研究答題科技，提升答題所獲得的金幣與連續答對加成。',
    baseCost: 110,
    costMultiplier: 1.6,
    maxLevel: 5,
    effectDescription: (lvl) => `答題金幣獎勵提升 +${lvl * 25}%，連擊加成倍率 +0.2x`,
  },
};

// Calculate cost for building upgrade
export function getBuildingCost(type: BuildingType, currentLevel: number): number {
  const tpl = BUILDING_TEMPLATES[type];
  if (currentLevel === 0) return tpl.baseCost;
  return Math.round(tpl.baseCost * Math.pow(tpl.costMultiplier, currentLevel));
}

// Calculate quiz coin reward with streak and knowledge institute bonus
export function calculateQuizReward(
  baseReward: number,
  streak: number,
  instituteBonusPercent: number
): { coins: number; bonus: number } {
  // Streak bonus: +10% per streak level (up to +100%)
  const streakBonusRatio = Math.min(1.0, (streak - 1) * 0.1);
  const instituteMultiplier = 1 + instituteBonusPercent / 100;
  const rawReward = baseReward * (1 + streakBonusRatio) * instituteMultiplier;
  const coins = Math.round(rawReward);
  const bonus = coins - baseReward;
  return { coins, bonus: Math.max(0, bonus) };
}
