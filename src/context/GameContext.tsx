import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Territory, Player, BuildingType, QuestionCategory, GameNotification, FactionId, Question, WrongAnswerEntry } from '../types/game';
import { createInitialTerritories } from '../data/initialMap';
import { areHexesAdjacent } from '../utils/hexMath';
import { BUILDING_TEMPLATES, getBuildingCost, DRONE_CONFIGS } from '../utils/balance';
import { ENEMY_ATTACK_ANIMATION_DURATION_MS } from '../utils/enemyAttack';
import { soundManager } from '../utils/audio';

const STORAGE_KEY_TERRITORIES = 'knowledge_conquest_territories_v2';
const STORAGE_KEY_PLAYER = 'knowledge_conquest_player_v2';
const STORAGE_KEY_WRONG_ANSWERS = 'knowledge_conquest_wrong_answers_v1';
const ENEMY_ATTACK_INTERVAL = 10;
const ENEMY_CAPTURE_ANIMATION_MS = 2000;

const isWrongAnswerEntry = (value: unknown): value is WrongAnswerEntry => {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('question' in value) ||
    !('answeredAt' in value) ||
    !('selectedAnswer' in value)
  ) return false;
  const question = value.question;
  return (
    typeof value.answeredAt === 'number' &&
    Number.isFinite(value.answeredAt) &&
    typeof value.selectedAnswer === 'number' &&
    Number.isInteger(value.selectedAnswer) &&
    typeof question === 'object' &&
    question !== null &&
    'options' in question &&
    Array.isArray(question.options) &&
    value.selectedAnswer >= 0 &&
    value.selectedAnswer < question.options.length
  );
};

interface EnemyAttackAnimation {
  originId: string;
  targetId: string;
  factionId: FactionId;
  phase: 'approaching' | 'captured';
}

interface GameContextType {
  territories: Territory[];
  player: Player;
  selectedTerritory: Territory | null;
  setSelectedTerritory: (t: Territory | null) => void;
  isAdjacentToPlayer: (t: Territory) => boolean;
  activeBattleTerritory: Territory | null;
  activeBattleMode: 'player' | { type: 'enemy'; factionId: FactionId } | null;
  activeEnemyAttack: EnemyAttackAnimation | null;
  enemyAttackCountdown: number;
  startBattle: (t: Territory) => void;
  endBattle: (victory: boolean) => void;
  buildFacility: (territoryId: string, type: BuildingType) => { success: boolean; message: string };
  upgradeFacility: (territoryId: string, buildingId: string) => { success: boolean; message: string };
  repairTerritory: (territoryId: string) => { success: boolean; message: string };
  wrongAnswers: WrongAnswerEntry[];
  recordAnswer: (
    correct: boolean,
    category: QuestionCategory,
    rewardCoins: number,
    question: Question,
    selectedAnswer: number
  ) => void;
  clearWrongAnswers: () => void;
  keepRecentWrongAnswers: () => void;
  notifications: GameNotification[];
  dismissNotification: (id: string) => void;
  addNotification: (message: string, type: GameNotification['type']) => void;
  resetGame: () => void;
  toggleSound: () => void;
  addCoins: (amount: number, reason: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_PLAYER: Player = {
  id: 'player_1',
  name: '智者指揮官',
  coins: 250, // Starting gold for initial exploration/upgrades
  health: 100,
  maxHealth: 100,
  territoryIds: ['terr_0_0'],
  stats: {
    totalAnswered: 0,
    correctAnswered: 0,
    currentStreak: 0,
    maxStreak: 0,
    totalCoinsEarned: 250,
    territoriesCaptured: 1,
    categoryStats: {
      variable: { answered: 0, correct: 0 },
      loop: { answered: 0, correct: 0 },
      ifelse: { answered: 0, correct: 0 },
      inout: { answered: 0, correct: 0 },
      str: { answered: 0, correct: 0 },
      func: { answered: 0, correct: 0 },
    },
  },
  soundEnabled: true,
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state from LocalStorage or defaults
  const [territories, setTerritories] = useState<Territory[]>(() => {
    if (typeof window === 'undefined') return createInitialTerritories();
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TERRITORIES);
      if (saved) {
        const savedTerritories = JSON.parse(saved) as Territory[];
        return savedTerritories.map((territory) => {
          const facility = territory.buildings?.find((building) => building.type in BUILDING_TEMPLATES);
          if (!facility) return { ...territory, buildings: [] };

          const level = Math.min(BUILDING_TEMPLATES[facility.type].maxLevel, Math.max(1, facility.level));
          const template = BUILDING_TEMPLATES[facility.type];
          const synchronizedFacility = {
            ...facility,
            level,
            description: template.effectDescription(level),
            cost: getBuildingCost(facility.type, level),
          };

          return { ...territory, level, buildings: [synchronizedFacility] };
        });
      }
    } catch (e) {
      console.error('Failed to load saved territories', e);
    }
    return createInitialTerritories();
  });

  const [player, setPlayer] = useState<Player>(() => {
    if (typeof window === 'undefined') return INITIAL_PLAYER;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAYER);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load saved player', e);
    }
    return INITIAL_PLAYER;
  });

  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswerEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WRONG_ANSWERS);
      if (!saved) return [];
      const entries: unknown = JSON.parse(saved);
      return Array.isArray(entries)
        ? entries.filter(isWrongAnswerEntry).sort((a, b) => b.answeredAt - a.answeredAt)
        : [];
    } catch (e) {
      console.error('Failed to load wrong answer history', e);
      return [];
    }
  });

  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string | null>('terr_0_0');
  const [activeBattleTerritoryId, setActiveBattleTerritoryId] = useState<string | null>(null);
  const [activeBattleMode, setActiveBattleMode] = useState<
    'player' | { type: 'enemy'; factionId: FactionId } | null
  >(null);
  const [activeEnemyAttack, setActiveEnemyAttack] = useState<EnemyAttackAnimation | null>(null);
  const [enemyAttackCountdown, setEnemyAttackCountdown] = useState(ENEMY_ATTACK_INTERVAL);
  const [notifications, setNotifications] = useState<GameNotification[]>([]);
  const enemyAttackTimeoutRef = useRef<number | null>(null);
  const captureAnimationTimeoutRef = useRef<number | null>(null);
  const enemyAttackCountdownRef = useRef(ENEMY_ATTACK_INTERVAL);

  useEffect(() => {
    return () => {
      if (enemyAttackTimeoutRef.current !== null) window.clearTimeout(enemyAttackTimeoutRef.current);
      if (captureAnimationTimeoutRef.current !== null) window.clearTimeout(captureAnimationTimeoutRef.current);
    };
  }, []);

  // Synchronize soundManager enabled state
  useEffect(() => {
    soundManager.enabled = player.soundEnabled;
  }, [player.soundEnabled]);

  // Persist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TERRITORIES, JSON.stringify(territories));
    } catch (e) {
      console.error('Failed to persist territories', e);
    }
  }, [territories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLAYER, JSON.stringify(player));
    } catch (e) {
      console.error('Failed to persist player', e);
    }
  }, [player]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_WRONG_ANSWERS, JSON.stringify(wrongAnswers));
    } catch (e) {
      console.error('Failed to persist wrong answer history', e);
    }
  }, [wrongAnswers]);

  const addNotification = useCallback((message: string, type: GameNotification['type']) => {
    const newNotif: GameNotification = {
      id: `notif_${Date.now()}_${Math.random()}`,
      message,
      type,
      timestamp: Date.now(),
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 4)]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Compute selected territory
  const selectedTerritory = useMemo(() => {
    if (!selectedTerritoryId) return null;
    return territories.find((t) => t.id === selectedTerritoryId) || null;
  }, [territories, selectedTerritoryId]);

  const setSelectedTerritory = useCallback((t: Territory | null) => {
    setSelectedTerritoryId(t ? t.id : null);
  }, []);

  const activeBattleTerritory = useMemo(() => {
    if (!activeBattleTerritoryId) return null;
    return territories.find((t) => t.id === activeBattleTerritoryId) || null;
  }, [territories, activeBattleTerritoryId]);

  const startEnemyAttack = useCallback(() => {
    const enemyOrigins = territories
      .filter((territory) => territory.ownerId === 'enemy_red' || territory.ownerId === 'enemy_purple')
      .map((origin) => ({
        origin,
        targets: territories.filter(
          (target) =>
            (target.ownerId === 'neutral' || target.ownerId === 'player') &&
            areHexesAdjacent({ q: origin.q, r: origin.r }, { q: target.q, r: target.r })
        ),
      }))
      .filter(({ targets }) => targets.length > 0);

    if (enemyOrigins.length === 0) return;

    const { origin, targets } = enemyOrigins[Math.floor(Math.random() * enemyOrigins.length)];
    const target = targets[Math.floor(Math.random() * targets.length)];
    enemyAttackCountdownRef.current = ENEMY_ATTACK_INTERVAL;
    setEnemyAttackCountdown(ENEMY_ATTACK_INTERVAL);
    setSelectedTerritoryId(target.id);
    setActiveEnemyAttack({
      originId: origin.id,
      targetId: target.id,
      factionId: origin.ownerId,
      phase: 'approaching',
    });

    enemyAttackTimeoutRef.current = window.setTimeout(() => {
      if (target.ownerId === 'player') {
        setActiveEnemyAttack(null);
        setActiveBattleMode({ type: 'enemy', factionId: origin.ownerId });
        setActiveBattleTerritoryId(target.id);
        return;
      }

      setTerritories((prev) =>
        prev.map((territory) =>
          territory.id === target.id ? { ...territory, ownerId: origin.ownerId } : territory
        )
      );
      setActiveEnemyAttack((attack) => (attack ? { ...attack, phase: 'captured' } : null));
      soundManager.playDamage();
      addNotification(`敵軍攻佔了【${target.name}】！`, 'warning');
      captureAnimationTimeoutRef.current = window.setTimeout(() => setActiveEnemyAttack(null), ENEMY_CAPTURE_ANIMATION_MS);
    }, ENEMY_ATTACK_ANIMATION_DURATION_MS);
  }, [territories, addNotification]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (activeBattleTerritoryId || activeEnemyAttack) return;

      if (enemyAttackCountdownRef.current <= 1) {
        enemyAttackCountdownRef.current = ENEMY_ATTACK_INTERVAL;
        setEnemyAttackCountdown(ENEMY_ATTACK_INTERVAL);
        startEnemyAttack();
        return;
      }

      enemyAttackCountdownRef.current -= 1;
      setEnemyAttackCountdown(enemyAttackCountdownRef.current);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeBattleTerritoryId, activeEnemyAttack, startEnemyAttack]);

  // Check if given territory is adjacent to ANY player owned territory
  const isAdjacentToPlayer = useCallback(
    (target: Territory): boolean => {
      if (target.ownerId === 'player') return true;
      const playerTerritories = territories.filter((t) => t.ownerId === 'player');
      return playerTerritories.some((pt) => areHexesAdjacent({ q: pt.q, r: pt.r }, { q: target.q, r: target.r }));
    },
    [territories]
  );

  // Add coins helper
  const addCoins = useCallback(
    (amount: number, reason: string) => {
      setPlayer((prev) => ({
        ...prev,
        coins: prev.coins + amount,
        stats: {
          ...prev.stats,
          totalCoinsEarned: prev.stats.totalCoinsEarned + (amount > 0 ? amount : 0),
        },
      }));
      if (amount > 0) {
        addNotification(`獲得 +${amount} 金幣 (${reason})`, 'income');
      }
    },
    [addNotification]
  );

  // Periodic resource generation every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      let incomeSum = 0;
      setTerritories((prevTerritories) => {
        return prevTerritories.map((terr) => {
          if (terr.ownerId !== 'player') return terr;
          let terrIncome = terr.resourceRate;
          // Add income from Coin Factory buildings
          terr.buildings.forEach((b) => {
            if (b.type === 'coin_factory') {
              terrIncome += b.level * 8;
            }
          });
          incomeSum += terrIncome;
          return terr;
        });
      });

      if (incomeSum > 0) {
        setPlayer((prev) => ({
          ...prev,
          coins: prev.coins + incomeSum,
          stats: {
            ...prev.stats,
            totalCoinsEarned: prev.stats.totalCoinsEarned + incomeSum,
          },
        }));
      }
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  // Start battle on target territory
  const startBattle = useCallback(
    (target: Territory) => {
      if (activeEnemyAttack) {
        soundManager.playWrong();
        addNotification('請先完成目前的敵軍突襲！', 'warning');
        return;
      }
      if (!isAdjacentToPlayer(target) && target.ownerId !== 'player') {
        soundManager.playWrong();
        addNotification('無法攻擊：必須先佔領與該土地相鄰的領地！', 'warning');
        return;
      }
      soundManager.playClick();
      enemyAttackCountdownRef.current = ENEMY_ATTACK_INTERVAL;
      setEnemyAttackCountdown(ENEMY_ATTACK_INTERVAL);
      setActiveBattleMode('player');
      setActiveBattleTerritoryId(target.id);
    },
    [isAdjacentToPlayer, activeEnemyAttack, addNotification]
  );

  // End battle callback
  const endBattle = useCallback(
    (victory: boolean) => {
      if (!activeBattleTerritoryId) return;
      const targetId = activeBattleTerritoryId;
      setActiveBattleTerritoryId(null);

      if (activeBattleMode && activeBattleMode !== 'player') {
        setActiveBattleMode(null);
        const targetTerritory = territories.find((territory) => territory.id === targetId);

        if (victory) {
          soundManager.playVictory();
          addNotification(`防守成功！你答對了，敵軍未能攻佔【${targetTerritory?.name || '未知領地'}】。`, 'defense');
          return;
        }

        setTerritories((prev) =>
          prev.map((territory) =>
            territory.id === targetId
              ? { ...territory, ownerId: activeBattleMode.factionId, defenseHealth: territory.maxDefenseHealth }
              : territory
          )
        );
        setPlayer((prev) => {
          const territoryIds = prev.territoryIds.filter((id) => id !== targetId);
          return {
            ...prev,
            territoryIds,
            stats: { ...prev.stats, territoriesCaptured: territoryIds.length },
          };
        });
        soundManager.playDamage();
        addNotification(`防守失敗！敵軍佔領了【${targetTerritory?.name || '未知領地'}】。`, 'warning');
        return;
      }

      setActiveBattleMode(null);
      if (victory) {
        const targetTerr = territories.find((t) => t.id === targetId);
        const droneLvl = targetTerr ? targetTerr.droneLevel : 1;
        const config = DRONE_CONFIGS[droneLvl] || DRONE_CONFIGS[1];
        const captureReward = config.rewardCoins;

        setTerritories((prev) =>
          prev.map((t) => {
            if (t.id === targetId) {
              return {
                ...t,
                ownerId: 'player',
                defenseHealth: t.maxDefenseHealth,
              };
            }
            return t;
          })
        );

        setPlayer((prev) => {
          const newTerritoryIds = prev.territoryIds.includes(targetId)
            ? prev.territoryIds
            : [...prev.territoryIds, targetId];

          return {
            ...prev,
            coins: prev.coins + captureReward,
            territoryIds: newTerritoryIds,
            stats: {
              ...prev.stats,
              territoriesCaptured: newTerritoryIds.length,
              totalCoinsEarned: prev.stats.totalCoinsEarned + captureReward,
            },
          };
        });

        soundManager.playVictory();
        addNotification(`大獲全勝！成功佔領【${targetTerr?.name || '未知土地'}】，獲得領地首佔獎勵 +${captureReward} 金幣！`, 'conquest');
      } else {
        soundManager.playDamage();
        addNotification('戰鬥撤退：艦隊受損，未能擊落防守無人機。領地依然保持原狀。', 'warning');
      }
    },
    [activeBattleTerritoryId, activeBattleMode, territories, addNotification]
  );

  // Build a new facility on owned territory
  const buildFacility = useCallback(
    (territoryId: string, type: BuildingType): { success: boolean; message: string } => {
      const terr = territories.find((t) => t.id === territoryId);
      if (!terr) return { success: false, message: '找不到該領地' };
      if (terr.ownerId !== 'player') return { success: false, message: '只能在己方領地上建設設施！' };

      if (terr.buildings.length > 0) {
        soundManager.playWrong();
        return { success: false, message: '每塊領地只能建設 1 種設施，請升級現有設施！' };
      }

      const cost = getBuildingCost(type, 0);
      if (player.coins < cost) {
        soundManager.playWrong();
        return { success: false, message: `金幣不足！建造需要 ${cost} 金幣 (目前擁有 ${player.coins})` };
      }

      // Deduct coins
      setPlayer((prev) => ({
        ...prev,
        coins: prev.coins - cost,
      }));

      const tpl = BUILDING_TEMPLATES[type];
      const buildingLevel = terr.level;
      const newBuilding = {
        id: `bld_${Date.now()}_${Math.random()}`,
        type,
        level: buildingLevel,
        name: tpl.name,
        description: tpl.effectDescription(buildingLevel),
        cost: getBuildingCost(type, buildingLevel),
      };

      setTerritories((prev) =>
        prev.map((t) =>
          t.id === territoryId
            ? { ...t, level: buildingLevel, buildings: [...t.buildings, newBuilding] }
            : t
        )
      );

      soundManager.playUpgrade();
      addNotification(`成功在【${terr.name}】建造【${tpl.name} Lv.${buildingLevel}】！領地同步至 Lv.${buildingLevel}。消耗 ${cost} 金幣。`, 'income');
      return { success: true, message: `成功建造 ${tpl.name}！` };
    },
    [territories, player.coins, addNotification]
  );

  // Upgrade existing facility
  const upgradeFacility = useCallback(
    (territoryId: string, buildingId: string): { success: boolean; message: string } => {
      const terr = territories.find((t) => t.id === territoryId);
      if (!terr) return { success: false, message: '找不到該領地' };
      const building = terr.buildings.find((b) => b.id === buildingId);
      if (!building) return { success: false, message: '找不到該設施' };

      const tpl = BUILDING_TEMPLATES[building.type];
      if (building.level >= tpl.maxLevel) {
        soundManager.playWrong();
        return { success: false, message: '該設施已達最高等級 (Lv.5)！' };
      }

      const cost = getBuildingCost(building.type, building.level);
      if (player.coins < cost) {
        soundManager.playWrong();
        return { success: false, message: `金幣不足！升級需要 ${cost} 金幣 (目前擁有 ${player.coins})` };
      }

      // Deduct coins
      setPlayer((prev) => ({
        ...prev,
        coins: prev.coins - cost,
      }));

      const nextLevel = building.level + 1;
      setTerritories((prev) =>
        prev.map((t) => {
          if (t.id !== territoryId) return t;
          return {
            ...t,
            level: nextLevel,
            buildings: t.buildings.map((b) => {
              if (b.id !== buildingId) return b;
              return {
                ...b,
                level: nextLevel,
                description: tpl.effectDescription(nextLevel),
                cost: getBuildingCost(b.type, nextLevel),
              };
            }),
          };
        })
      );

      soundManager.playUpgrade();
      addNotification(`【${building.name}】成功升級至 Lv.${nextLevel}，領地同步升級！消耗 ${cost} 金幣。`, 'income');
      return { success: true, message: `升級成功至 Lv.${nextLevel}！` };
    },
    [territories, player.coins, addNotification]
  );

  // Repair territory defense health
  const repairTerritory = useCallback(
    (territoryId: string): { success: boolean; message: string } => {
      const terr = territories.find((t) => t.id === territoryId);
      if (!terr) return { success: false, message: '找不到領地' };
      if (terr.defenseHealth >= terr.maxDefenseHealth) {
        return { success: false, message: '防禦耐久度已滿，無需修復！' };
      }

      const missing = terr.maxDefenseHealth - terr.defenseHealth;
      const repairCost = Math.round(missing * 0.25);
      if (player.coins < repairCost) {
        soundManager.playWrong();
        return { success: false, message: `金幣不足！修復需要 ${repairCost} 金幣。` };
      }

      setPlayer((prev) => ({ ...prev, coins: prev.coins - repairCost }));
      setTerritories((prev) =>
        prev.map((t) => (t.id === territoryId ? { ...t, defenseHealth: t.maxDefenseHealth } : t))
      );

      soundManager.playUpgrade();
      addNotification(`【${terr.name}】城防修復完畢！消耗 ${repairCost} 金幣。`, 'defense');
      return { success: true, message: '領地耐久度修復完畢！' };
    },
    [territories, player.coins, addNotification]
  );

  // Record answered quiz question
  const recordAnswer = useCallback(
    (
      correct: boolean,
      category: QuestionCategory,
      rewardCoins: number,
      question: Question,
      selectedAnswer: number
    ) => {
      setPlayer((prev) => {
        const streak = correct ? prev.stats.currentStreak + 1 : 0;
        const maxStreak = Math.max(prev.stats.maxStreak, streak);
        const catStat = prev.stats.categoryStats[category] || { answered: 0, correct: 0 };

        const updatedCoins = correct ? prev.coins + rewardCoins : prev.coins;

        return {
          ...prev,
          coins: updatedCoins,
          stats: {
            ...prev.stats,
            totalAnswered: prev.stats.totalAnswered + 1,
            correctAnswered: prev.stats.correctAnswered + (correct ? 1 : 0),
            currentStreak: streak,
            maxStreak,
            totalCoinsEarned: prev.stats.totalCoinsEarned + (correct ? rewardCoins : 0),
            categoryStats: {
              ...prev.stats.categoryStats,
              [category]: {
                answered: catStat.answered + 1,
                correct: catStat.correct + (correct ? 1 : 0),
              },
            },
          },
        };
      });

      if (!correct) {
        setWrongAnswers((prev) => [
          {
            question: { ...question, options: [...question.options] },
            selectedAnswer,
            answeredAt: Date.now(),
          },
          ...prev,
        ]);
      }
    },
    []
  );

  const clearWrongAnswers = useCallback(() => setWrongAnswers([]), []);

  const keepRecentWrongAnswers = useCallback(() => {
    setWrongAnswers((prev) => prev.slice(0, 10));
  }, []);

  // Toggle sound
  const toggleSound = useCallback(() => {
    setPlayer((prev) => {
      const nextSound = !prev.soundEnabled;
      soundManager.enabled = nextSound;
      return { ...prev, soundEnabled: nextSound };
    });
  }, []);

  // Reset entire game progress to start
  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_TERRITORIES);
    localStorage.removeItem(STORAGE_KEY_PLAYER);
    localStorage.removeItem(STORAGE_KEY_WRONG_ANSWERS);
    setTerritories(createInitialTerritories());
    setPlayer(INITIAL_PLAYER);
    setWrongAnswers([]);
    setSelectedTerritoryId('terr_0_0');
    setActiveBattleTerritoryId(null);
    setActiveBattleMode(null);
    setActiveEnemyAttack(null);
    enemyAttackCountdownRef.current = ENEMY_ATTACK_INTERVAL;
    setEnemyAttackCountdown(ENEMY_ATTACK_INTERVAL);
    if (enemyAttackTimeoutRef.current !== null) window.clearTimeout(enemyAttackTimeoutRef.current);
    if (captureAnimationTimeoutRef.current !== null) window.clearTimeout(captureAnimationTimeoutRef.current);
    soundManager.playCorrect();
    addNotification('遊戲進度已重新初始化！祝您征服全境！', 'achievement');
  }, [addNotification]);

  return (
    <GameContext.Provider
      value={{
        territories,
        player,
        selectedTerritory,
        setSelectedTerritory,
        isAdjacentToPlayer,
        activeBattleTerritory,
        activeBattleMode,
        activeEnemyAttack,
        enemyAttackCountdown,
        startBattle,
        endBattle,
        buildFacility,
        upgradeFacility,
        repairTerritory,
        wrongAnswers,
        recordAnswer,
        clearWrongAnswers,
        keepRecentWrongAnswers,
        notifications,
        dismissNotification,
        addNotification,
        resetGame,
        toggleSound,
        addCoins,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
};
