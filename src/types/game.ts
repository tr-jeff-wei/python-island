export type FactionId = 'player' | 'neutral' | 'enemy_red' | 'enemy_purple';

export type BuildingType = 
  | 'coin_factory'        // 金幣工廠
  | 'defense_turret'     // 防禦砲塔
  | 'energy_shield'      // 能量護盾
  | 'knowledge_institute'; // 知識研究所

export interface Building {
  id: string;
  type: BuildingType;
  level: number;
  name: string;
  description: string;
  cost: number;
}

export type TerritoryType = 'standard' | 'mine' | 'academy' | 'fortress' | 'capital';

export interface Territory {
  id: string;
  q: number; // axial q
  r: number; // axial r
  name: string;
  ownerId: FactionId;
  level: number; // 1 to 5
  droneLevel: number; // 1 to 5
  buildings: Building[];
  defenseHealth: number;
  maxDefenseHealth: number;
  resourceRate: number; // base gold / tick
  territoryType: TerritoryType;
  biome?: 'grass' | 'autumn' | 'sand' | 'snow' | 'lava' | 'magic' | 'stone' | 'rock';
  decoration?: 'trees' | 'pines' | 'cactus' | 'rocks' | 'hills' | 'flowers' | 'none';
}

export type QuestionCategory = 'variable' | 'loop' | 'ifelse' | 'inout' | 'str' | 'func';
export type QuestionType = 'single' | 'boolean';

export interface Question {
  id: string;
  category: QuestionCategory;
  difficulty: number; // 1 to 5
  type: QuestionType;
  question: string;
  code: string;
  options: string[];
  correctAnswer: number; // 0-indexed option index
  explanation: string;
  reward: number; // coins reward
}

export interface WrongAnswerEntry {
  question: Question;
  selectedAnswer: number;
  answeredAt: number;
}

export interface PlayerStats {
  totalAnswered: number;
  correctAnswered: number;
  currentStreak: number;
  maxStreak: number;
  totalCoinsEarned: number;
  territoriesCaptured: number;
  categoryStats: Record<QuestionCategory, { answered: number; correct: number }>;
}

export interface Player {
  id: string;
  name: string;
  coins: number;
  health: number;
  maxHealth: number;
  territoryIds: string[];
  stats: PlayerStats;
  soundEnabled: boolean;
}

export interface DroneConfig {
  level: number;
  maxHealth: number;
  attackInterval: number; // in seconds
  projectileSpeed: number; // px per second
  bulletPattern: 'single' | 'double' | 'spread' | 'homing';
  rewardCoins: number;
  name: string;
}

export interface DroneEntity {
  id: string;
  level: number;
  x: number;
  y: number;
  vx: number;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  attackTimer: number;
  attackInterval: number;
  projectileSpeed: number;
  bulletPattern: 'single' | 'double' | 'spread' | 'homing';
  state: 'alive' | 'hit' | 'destroyed';
  hitFlashTime: number;
}

export interface Projectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  isEnemy: boolean;
  isHoming?: boolean;
  targetId?: string;
  color: string;
  trail: { x: number; y: number; alpha: number }[];
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  radius: number;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
}

export interface GameNotification {
  id: string;
  message: string;
  type: 'income' | 'conquest' | 'defense' | 'achievement' | 'warning';
  timestamp: number;
}
