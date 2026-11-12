import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { DRONE_CONFIGS } from '../utils/balance';
import { soundManager } from '../utils/audio';
import { getRandomQuestion, CATEGORY_LABELS, DIFFICULTY_LABELS } from '../data/questions';
import { Question, Projectile, Particle, FloatingText } from '../types/game';
import { getTerritoryAlien, FACTION_ALIENS } from '../utils/hexAssets';
import { PythonCodeBlock } from './PythonCodeBlock';
import { useLanguage } from '../context/LanguageContext';
import confetti from 'canvas-confetti';
import { 
  Shield, 
  Heart, 
  ArrowLeft, 
  Trophy, 
  Skull, 
  Crosshair, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX
} from 'lucide-react';

export const DroneCombatView: React.FC = () => {
  const {
    activeBattleTerritory,
    activeBattleMode,
    endBattle,
    player,
    recordAnswer,
    toggleSound,
  } = useGame();
  const { language, t } = useLanguage();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Territory and drone configuration
  const terr = activeBattleTerritory;
  const isEnemyAttack = activeBattleMode !== null && activeBattleMode !== 'player';
  const droneLevel = terr ? terr.droneLevel : 1;
  const config = DRONE_CONFIGS[droneLevel] || DRONE_CONFIGS[1];

  // Combat status
  const [battleState, setBattleState] = useState<'ongoing' | 'victory' | 'defeat'>('ongoing');
  const [playerHP, setPlayerHP] = useState<number>(100);
  const [playerShield, setPlayerShield] = useState<number>(0);
  const [droneHP, setDroneHP] = useState<number>(config.maxHealth);
  const [droneAttackCountdown, setDroneAttackCountdown] = useState<number>(config.attackInterval);

  // Active Quiz Question
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [feedbackText, setFeedbackText] = useState<{ isCorrect: boolean; text: string } | null>(null);

  // Keys pressed
  const keysRef = useRef<{ left: boolean; right: boolean }>({ left: false, right: false });

  // Game entities inside ref for the 60fps loop
  const gameStateRef = useRef<{
    playerX: number;
    playerY: number;
    playerSpeed: number;
    droneX: number;
    droneY: number;
    droneVx: number;
    droneTimer: number;
    projectiles: Projectile[];
    particles: Particle[];
    floatingTexts: FloatingText[];
    screenShake: number;
    droneMaxHP: number;
    droneCurrentHP: number;
    playerHP: number;
    playerShield: number;
    turretTimer: number;
    turretInterval: number;
    turretDamage: number;
  }>({
    playerX: 300,
    playerY: 340,
    playerSpeed: 280,
    droneX: 300,
    droneY: 70,
    droneVx: 90,
    droneTimer: config.attackInterval,
    projectiles: [],
    particles: [],
    floatingTexts: [],
    screenShake: 0,
    droneMaxHP: config.maxHealth,
    droneCurrentHP: config.maxHealth,
    playerHP: 100,
    playerShield: 0,
    turretTimer: 0,
    turretInterval: 8,
    turretDamage: 1,
  });

  // Calculate building bonuses from owned territories or allied support
  useEffect(() => {
    let shieldBonus = 0;
    let turretLvl = 0;

    if (terr && terr.ownerId === 'player') {
      terr.buildings.forEach((b) => {
        if (b.type === 'energy_shield') shieldBonus += b.level * 35;
        if (b.type === 'defense_turret') turretLvl += b.level;
      });
    }

    setPlayerShield(shieldBonus);
    setPlayerHP(100);
    setDroneHP(config.maxHealth);

    gameStateRef.current.playerShield = shieldBonus;
    gameStateRef.current.playerHP = 100;
    gameStateRef.current.droneMaxHP = config.maxHealth;
    gameStateRef.current.droneCurrentHP = config.maxHealth;
    gameStateRef.current.droneTimer = config.attackInterval;
    gameStateRef.current.turretInterval = turretLvl > 0 ? Math.max(4, 12 - turretLvl) : 999;
  }, [terr, config]);

  // Load first quiz question
  const loadNextQuestion = useCallback(() => {
    const q = getRandomQuestion(droneLevel);
    setCurrentQuestion(q);
    setSelectedOption(null);
    setQuizAnswered(false);
    setFeedbackText(null);
  }, [droneLevel]);

  useEffect(() => {
    loadNextQuestion();
  }, [loadNextQuestion]);

  // Keyboard listeners for WASD / Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysRef.current.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysRef.current.right = true;
      }
      // Number shortcuts for options: 1, 2, 3, 4
      if (['1', '2', '3', '4'].includes(e.key) && currentQuestion && !quizAnswered && battleState === 'ongoing') {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < currentQuestion.options.length) {
          handleOptionClick(idx);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysRef.current.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysRef.current.right = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [currentQuestion, quizAnswered, battleState]);

  // Fire Homing Missile from player craft towards Drone
  const fireHomingMissile = () => {
    soundManager.playLaser();
    const g = gameStateRef.current;
    const newMissile: Projectile = {
      id: `missile_${Date.now()}_${Math.random()}`,
      x: g.playerX,
      y: g.playerY - 20,
      vx: 0,
      vy: -150,
      radius: 5,
      damage: 1,
      isEnemy: false,
      isHoming: true,
      color: '#38bdf8',
      trail: [],
    };
    g.projectiles.push(newMissile);

    // Muzzle flash particles
    for (let i = 0; i < 8; i++) {
      g.particles.push({
        x: g.playerX,
        y: g.playerY - 15,
        vx: (Math.random() - 0.5) * 80,
        vy: -Math.random() * 80,
        life: 0.25,
        maxLife: 0.25,
        color: '#7dd3fc',
        radius: Math.random() * 3 + 1.5,
      });
    }
  };

  // Handle Quiz Option Selection
  const handleOptionClick = (idx: number) => {
    if (quizAnswered || !currentQuestion || battleState !== 'ongoing') return;
    setSelectedOption(idx);
    setQuizAnswered(true);

    const isCorrect = idx === currentQuestion.correctAnswer;
    if (isEnemyAttack) {
      if (isCorrect) {
        soundManager.playCorrect();
        recordAnswer(true, currentQuestion.category, currentQuestion.reward, currentQuestion, idx);
        setFeedbackText({
          isCorrect: true,
          text: language === 'en'
            ? 'Correct! You decoded the enemy drone’s command and defended the territory!'
            : '回答正確！成功破解敵方無人機指令，守住領地！',
        });
        setBattleState('victory');
      } else {
        soundManager.playWrong();
        recordAnswer(false, currentQuestion.category, 0, currentQuestion, idx);
        setFeedbackText({
          isCorrect: false,
          text: language === 'en'
            ? `Incorrect! The enemy drone broke through. Correct answer: ${currentQuestion.options[currentQuestion.correctAnswer]}`
            : `回答錯誤！敵方無人機突破防線。正確解答：${currentQuestion.options[currentQuestion.correctAnswer]}`,
        });
        setBattleState('defeat');
      }
      return;
    }

    if (isCorrect) {
      soundManager.playCorrect();
      fireHomingMissile();
      recordAnswer(true, currentQuestion.category, currentQuestion.reward, currentQuestion, idx);
      setFeedbackText({
        isCorrect: true,
        text: language === 'en'
          ? `Correct! Missile launched!${player.stats.currentStreak >= 2 ? ` (Streak x${player.stats.currentStreak + 1})` : ''}`
          : `回答正確！導彈發射！${player.stats.currentStreak >= 2 ? ` (連勝 x${player.stats.currentStreak + 1})` : ''}`,
      });

      // Float feedback text on player
      gameStateRef.current.floatingTexts.push({
        id: `ft_${Date.now()}`,
        x: gameStateRef.current.playerX,
        y: gameStateRef.current.playerY - 40,
        text: language === 'en' ? 'Homing missile launched!' : '追蹤導彈發射！',
        color: '#38bdf8',
        life: 1.0,
      });
    } else {
      soundManager.playWrong();
      recordAnswer(false, currentQuestion.category, 0, currentQuestion, idx);
      setFeedbackText({
        isCorrect: false,
        text: language === 'en'
          ? `Incorrect! No missile launched. Correct answer: ${currentQuestion.options[currentQuestion.correctAnswer]}`
          : `回答錯誤！未發射導彈。正確解答：${currentQuestion.options[currentQuestion.correctAnswer]}`,
      });

      gameStateRef.current.floatingTexts.push({
        id: `ft_${Date.now()}`,
        x: gameStateRef.current.playerX,
        y: gameStateRef.current.playerY - 40,
        text: language === 'en' ? 'Incorrect answer!' : '答題失誤！',
        color: '#f43f5e',
        life: 1.0,
      });
    }

    // Automatically load next question after brief feedback period
    setTimeout(() => {
      if (gameStateRef.current.droneCurrentHP > 0 && gameStateRef.current.playerHP > 0) {
        loadNextQuestion();
      }
    }, 1400);
  };

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.05); // cap dt at 50ms
      lastTime = time;

      const g = gameStateRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // 1. UPDATE PLAYER POSITION
      if (keysRef.current.left) {
        g.playerX -= g.playerSpeed * dt;
      }
      if (keysRef.current.right) {
        g.playerX += g.playerSpeed * dt;
      }
      g.playerX = Math.max(30, Math.min(width - 30, g.playerX));

      // 2. UPDATE DRONE MOVEMENT & ATTACK
      if (g.droneCurrentHP > 0 && battleState === 'ongoing') {
        g.droneX += g.droneVx * dt;
        if (g.droneX > width - 60) {
          g.droneX = width - 60;
          g.droneVx = -Math.abs(g.droneVx);
        } else if (g.droneX < 60) {
          g.droneX = 60;
          g.droneVx = Math.abs(g.droneVx);
        }

        // Drone attack timer countdown
        g.droneTimer -= dt;
        setDroneAttackCountdown(Math.max(0, parseFloat(g.droneTimer.toFixed(1))));

        if (g.droneTimer <= 0) {
          g.droneTimer = config.attackInterval;
          soundManager.playDroneShot();

          // Fire bullets based on pattern
          if (config.bulletPattern === 'single') {
            g.projectiles.push({
              id: `eb_${Date.now()}_0`,
              x: g.droneX,
              y: g.droneY + 25,
              vx: 0,
              vy: config.projectileSpeed,
              radius: 5,
              damage: 22,
              isEnemy: true,
              color: '#f43f5e',
              trail: [],
            });
          } else if (config.bulletPattern === 'double') {
            [-18, 18].forEach((offset, idx) => {
              g.projectiles.push({
                id: `eb_${Date.now()}_${idx}`,
                x: g.droneX + offset,
                y: g.droneY + 25,
                vx: offset * 3,
                vy: config.projectileSpeed,
                radius: 5,
                damage: 18,
                isEnemy: true,
                color: '#f43f5e',
                trail: [],
              });
            });
          } else if (config.bulletPattern === 'spread') {
            [-70, 0, 70].forEach((vx, idx) => {
              g.projectiles.push({
                id: `eb_${Date.now()}_${idx}`,
                x: g.droneX,
                y: g.droneY + 25,
                vx,
                vy: config.projectileSpeed,
                radius: 5.5,
                damage: 20,
                isEnemy: true,
                color: '#f43f5e',
                trail: [],
              });
            });
          } else if (config.bulletPattern === 'homing') {
            // High level homing plasma that drifts towards player
            [-60, 0, 60].forEach((vx, idx) => {
              g.projectiles.push({
                id: `eb_${Date.now()}_${idx}`,
                x: g.droneX,
                y: g.droneY + 25,
                vx,
                vy: config.projectileSpeed * 0.9,
                radius: 6,
                damage: 25,
                isEnemy: true,
                isHoming: true,
                color: '#ec4899',
                trail: [],
              });
            });
          }
        }
      }

      // 3. DEFENSE TURRET ALLIED AUTO-SUPPORT (if player built turret)
      if (g.turretInterval < 50 && battleState === 'ongoing' && g.droneCurrentHP > 0) {
        g.turretTimer += dt;
        if (g.turretTimer >= g.turretInterval) {
          g.turretTimer = 0;
          soundManager.playLaser();
          // Turret beam fires at drone
          g.droneCurrentHP -= 1;
          setDroneHP(Math.max(0, g.droneCurrentHP));
          g.floatingTexts.push({
            id: `ft_turret_${Date.now()}`,
            x: g.droneX,
            y: g.droneY - 20,
            text: language === 'en' ? 'Turret strike! -1' : '砲塔協同重擊! -1',
            color: '#38bdf8',
            life: 1.2,
          });

          for (let p = 0; p < 12; p++) {
            g.particles.push({
              x: g.droneX,
              y: g.droneY,
              vx: (Math.random() - 0.5) * 200,
              vy: (Math.random() - 0.5) * 200,
              life: 0.4,
              maxLife: 0.4,
              color: '#38bdf8',
              radius: 3,
            });
          }

          if (g.droneCurrentHP <= 0) {
            setBattleState('victory');
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          }
        }
      }

      // 4. UPDATE PROJECTILES
      for (let i = g.projectiles.length - 1; i >= 0; i--) {
        const p = g.projectiles[i];

        // Homing behavior
        if (p.isHoming) {
          if (!p.isEnemy) {
            // Player missile homing on enemy drone
            const dx = g.droneX - p.x;
            const dy = g.droneY - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist > 10) {
              const speed = 360;
              p.vx = (dx / dist) * speed;
              p.vy = (dy / dist) * speed;
            }
          } else {
            // Enemy plasma homing on player
            const dx = g.playerX - p.x;
            const speed = config.projectileSpeed;
            p.vx = Math.sign(dx) * Math.min(Math.abs(dx) * 2, 80);
          }
        }

        // Add trail
        p.trail.push({ x: p.x, y: p.y, alpha: 1.0 });
        if (p.trail.length > 8) p.trail.shift();

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Check Missile -> Drone Collision
        if (!p.isEnemy && g.droneCurrentHP > 0) {
          const dx = p.x - g.droneX;
          const dy = p.y - g.droneY;
          if (Math.hypot(dx, dy) < 32) {
            // HIT DRONE!
            soundManager.playExplosion();
            g.droneCurrentHP -= p.damage;
            setDroneHP(Math.max(0, g.droneCurrentHP));
            g.screenShake = 12;

            // Spawn hit text & particles
            g.floatingTexts.push({
              id: `hit_${Date.now()}`,
              x: g.droneX,
              y: g.droneY - 20,
              text: language === 'en' ? 'Hit! -1 HP' : '命中! -1 HP',
              color: '#38bdf8',
              life: 1.0,
            });

            for (let k = 0; k < 18; k++) {
              g.particles.push({
                x: p.x,
                y: p.y,
                vx: (Math.random() - 0.5) * 250,
                vy: (Math.random() - 0.5) * 250,
                life: 0.5,
                maxLife: 0.5,
                color: Math.random() > 0.4 ? '#38bdf8' : '#fbbf24',
                radius: Math.random() * 4 + 2,
              });
            }

            g.projectiles.splice(i, 1);

            // Check Drone destroyed
            if (g.droneCurrentHP <= 0) {
              setBattleState('victory');
              confetti({
                particleCount: 120,
                spread: 80,
                origin: { y: 0.5 },
              });
            }
            continue;
          }
        }

        // Check Enemy Bullet -> Player Collision
        if (p.isEnemy && g.playerHP > 0 && battleState === 'ongoing') {
          const dx = p.x - g.playerX;
          const dy = p.y - g.playerY;
          if (Math.hypot(dx, dy) < 22) {
            // PLAYER DAMAGED!
            soundManager.playDamage();
            g.screenShake = 10;

            let remainingDamage = p.damage;
            if (g.playerShield > 0) {
              if (g.playerShield >= remainingDamage) {
                g.playerShield -= remainingDamage;
                remainingDamage = 0;
              } else {
                remainingDamage -= g.playerShield;
                g.playerShield = 0;
              }
              setPlayerShield(g.playerShield);
            }

            if (remainingDamage > 0) {
              g.playerHP = Math.max(0, g.playerHP - remainingDamage);
              setPlayerHP(g.playerHP);
            }

            // Floating text
            g.floatingTexts.push({
              id: `dmg_${Date.now()}`,
              x: g.playerX,
              y: g.playerY - 20,
              text: `受到傷害 -${p.damage}`,
              color: '#f43f5e',
              life: 1.0,
            });

            // Spark particles
            for (let k = 0; k < 12; k++) {
              g.particles.push({
                x: p.x,
                y: p.y,
                vx: (Math.random() - 0.5) * 180,
                vy: (Math.random() - 0.5) * 180,
                life: 0.35,
                maxLife: 0.35,
                color: '#f43f5e',
                radius: Math.random() * 3 + 1.5,
              });
            }

            g.projectiles.splice(i, 1);

            if (g.playerHP <= 0) {
              setBattleState('defeat');
            }
            continue;
          }
        }

        // Remove out-of-bounds
        if (p.y < -30 || p.y > height + 30 || p.x < -30 || p.x > width + 30) {
          g.projectiles.splice(i, 1);
        }
      }

      // 5. UPDATE PARTICLES
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const pt = g.particles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.life -= dt;
        if (pt.life <= 0) {
          g.particles.splice(i, 1);
        }
      }

      // 6. UPDATE FLOATING TEXTS
      for (let i = g.floatingTexts.length - 1; i >= 0; i--) {
        const ft = g.floatingTexts[i];
        ft.y -= 30 * dt;
        ft.life -= dt;
        if (ft.life <= 0) {
          g.floatingTexts.splice(i, 1);
        }
      }

      // 7. SCREEN SHAKE DECAY
      if (g.screenShake > 0) {
        g.screenShake = Math.max(0, g.screenShake - 35 * dt);
      }

      // ================= DRAW SCENE =================
      ctx.save();

      // Apply screen shake
      if (g.screenShake > 0) {
        const sx = (Math.random() - 0.5) * g.screenShake;
        const sy = (Math.random() - 0.5) * g.screenShake;
        ctx.translate(sx, sy);
      }

      // Background starfield / grid
      ctx.fillStyle = '#060a16';
      ctx.fillRect(0, 0, width, height);

      // Sci-fi perspective grid lines
      ctx.strokeStyle = 'rgba(30, 58, 138, 0.25)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Particles
      g.particles.forEach((pt) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Projectiles
      g.projectiles.forEach((p) => {
        // Draw projectile trail
        p.trail.forEach((t, tidx) => {
          ctx.beginPath();
          ctx.arc(t.x, t.y, p.radius * (tidx / p.trail.length), 0, Math.PI * 2);
          ctx.fillStyle = p.isEnemy ? 'rgba(244, 63, 94, 0.25)' : 'rgba(56, 189, 248, 0.3)';
          ctx.fill();
        });

        // Draw projectile body
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Drone (at g.droneX, g.droneY)
      if (g.droneCurrentHP > 0) {
        const dx = g.droneX;
        const dy = g.droneY;

        ctx.save();
        ctx.translate(dx, dy);

        // Drone jet propulsion glow
        ctx.beginPath();
        ctx.arc(0, -10, 15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
        ctx.fill();

        // Main Drone Body (Futuristic Quadcopter/Interceptor)
        ctx.fillStyle = '#881337'; // Rose-900
        ctx.strokeStyle = '#f43f5e'; // Rose-500
        ctx.lineWidth = 2.5;

        // Central fuselage
        ctx.beginPath();
        ctx.moveTo(0, 18);
        ctx.lineTo(-24, -12);
        ctx.lineTo(-10, -20);
        ctx.lineTo(10, -20);
        ctx.lineTo(24, -12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Rotors / Thrusters
        [-24, 24].forEach((rx) => {
          ctx.beginPath();
          ctx.ellipse(rx, -10, 10, 3, 0, 0, Math.PI * 2);
          ctx.strokeStyle = '#fda4af';
          ctx.stroke();
        });

        // Core eye / sensor (charging effect)
        const isCharging = g.droneTimer <= 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, isCharging ? 7 : 5, 0, Math.PI * 2);
        ctx.fillStyle = isCharging ? '#f43f5e' : '#fb7185';
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = isCharging ? 16 : 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Level & Name Tag above drone
        ctx.fillStyle = '#fecdd3';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Lv.${droneLevel} ${language === 'en' ? 'Enemy Defense Drone' : '敵防守無人機'}`, 0, -30);

        ctx.restore();
      }

      // Draw Player Fighter Craft (at g.playerX, g.playerY)
      if (g.playerHP > 0) {
        const px = g.playerX;
        const py = g.playerY;

        ctx.save();
        ctx.translate(px, py);

        // Thruster flame
        ctx.beginPath();
        ctx.moveTo(-7, 14);
        ctx.lineTo(0, 24 + Math.random() * 8);
        ctx.lineTo(7, 14);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();

        // Shield bubble if active
        if (g.playerShield > 0) {
          ctx.beginPath();
          ctx.arc(0, 0, 28, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Craft Fuselage
        ctx.fillStyle = '#0369a1';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(20, 14);
        ctx.lineTo(0, 8);
        ctx.lineTo(-20, 14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cockpit canopy
        ctx.beginPath();
        ctx.arc(0, -4, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#bae6fd';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      }

      // Draw Floating Texts
      g.floatingTexts.forEach((ft) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, ft.life);
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 4;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [battleState, config, droneLevel, language]);

  // Handle Touch / Mouse button movement for mobile/tablet
  const handleTouchLeftStart = () => {
    keysRef.current.left = true;
  };
  const handleTouchLeftEnd = () => {
    keysRef.current.left = false;
  };
  const handleTouchRightStart = () => {
    keysRef.current.right = true;
  };
  const handleTouchRightEnd = () => {
    keysRef.current.right = false;
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full gap-3 p-2 select-none">
      {/* Combat Top Header HUD */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between shadow-lg">
        {/* Left: Territory info & Retreat */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => endBattle(false)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-xs cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">{language === 'en' ? (isEnemyAttack ? 'Abandon Defense' : 'Retreat') : (isEnemyAttack ? '放棄防守' : '撤退返航')}</span>
          </button>
          <div className="flex items-center gap-2.5">
            {terr && (
              <img
                src={getTerritoryAlien(terr)}
                alt={language === 'en' ? 'Enemy commander' : '敵方指揮官'}
                className="w-8 h-10 object-contain drop-shadow"
              />
            )}
            <div>
              <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Crosshair size={16} className={isEnemyAttack ? 'text-rose-400' : 'text-sky-400'} />
                <span>{isEnemyAttack
                  ? `${language === 'en' ? 'Enemy attack' : '敵軍突襲'} [${t(terr?.name || '未知目標')}]`
                  : `${language === 'en' ? 'Contesting' : '爭奪'} [${t(terr?.name || '未知目標')}]`}</span>
              </h2>
              <span className="text-[11px] text-slate-400">
                {language === 'en'
                  ? (isEnemyAttack ? 'Answer correctly to repel the attack; a wrong answer loses the territory.' : 'Destroy the defending drone to capture this territory.')
                  : (isEnemyAttack ? '答題正確即可擊退敵軍，答錯將失去領地' : '擊落防守無人機以完成佔領')}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Drone HP & Attack Countdown */}
        <div className="flex items-center gap-4">
          {isEnemyAttack ? (
            <div className="text-center bg-rose-950/60 px-3 py-1.5 rounded border border-rose-500/40">
              <span className="text-[10px] text-rose-200 block">{language === 'en' ? 'Defense Order' : '防守指令'}</span>
              <span className="text-xs font-bold text-rose-300">{language === 'en' ? 'Answer to defend' : '答題守住領地'}</span>
            </div>
          ) : (
            <>
              <div className="text-center">
                <span className="text-[11px] text-slate-400 block">{language === 'en' ? 'Drone HP' : '無人機生命值'}</span>
                <div className="flex items-center gap-1 justify-center font-mono font-bold text-rose-400">
                  {Array.from({ length: config.maxHealth }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-4 rounded-xs border transition-all ${
                        i < droneHP
                          ? 'bg-rose-500 border-rose-300 shadow-xs shadow-rose-500'
                          : 'bg-slate-800 border-slate-700 opacity-30'
                      }`}
                    />
                  ))}
                  <span className="text-xs ml-1">
                    ({droneHP}/{config.maxHealth})
                  </span>
                </div>
              </div>

              <div className="text-center bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">{language === 'en' ? 'Enemy attack in' : '敵機攻擊充能'}</span>
                <span className={`text-xs font-mono font-bold ${droneAttackCountdown <= 2 ? 'text-rose-400 animate-pulse' : 'text-amber-300'}`}>
                  {droneAttackCountdown.toFixed(1)}s
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right: Player HP / Shield */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-xs font-bold font-mono">
              <Heart size={14} className="text-rose-500 fill-rose-500" />
              <span className="text-slate-100">{playerHP} / 100</span>
              {playerShield > 0 && (
                <span className="text-sky-400 flex items-center gap-0.5 ml-1">
                  <Shield size={12} className="fill-sky-400" /> +{playerShield}
                </span>
              )}
            </div>
            <div className="w-28 bg-slate-800 h-2 rounded-full overflow-hidden mt-1 border border-slate-700">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${Math.max(0, playerHP)}%` }}
              />
            </div>
          </div>

          <button
            onClick={toggleSound}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
            title={language === 'en' ? 'Toggle sound' : '音效開關'}
          >
            {player.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </div>

      {/* Main Play Arena: Canvas Dodge + Quiz Control Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-[460px]">
        {/* Left Column: 2D Combat Canvas (7 cols on desktop) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden relative flex flex-col shadow-inner">
          <canvas
            ref={canvasRef}
            width={620}
            height={380}
            className="w-full h-full object-contain block"
          />

          {/* On-screen controls overlay for mobile/tablet touch */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <button
                onMouseDown={handleTouchLeftStart}
                onMouseUp={handleTouchLeftEnd}
                onTouchStart={handleTouchLeftStart}
                onTouchEnd={handleTouchLeftEnd}
                className="w-12 h-12 bg-slate-800/80 active:bg-sky-600 border border-slate-700 active:border-sky-400 rounded-xl flex items-center justify-center text-white shadow-lg backdrop-blur"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onMouseDown={handleTouchRightStart}
                onMouseUp={handleTouchRightEnd}
                onTouchStart={handleTouchRightStart}
                onTouchEnd={handleTouchRightEnd}
                className="w-12 h-12 bg-slate-800/80 active:bg-sky-600 border border-slate-700 active:border-sky-400 rounded-xl flex items-center justify-center text-white shadow-lg backdrop-blur"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 text-[11px] text-slate-400 pointer-events-auto self-end hidden sm:block">
              {language === 'en' ? 'Use' : '鍵盤'} <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-slate-200">A / D</kbd> {language === 'en' ? 'or' : '或'} <kbd className="px-1 py-0.5 bg-slate-800 rounded font-mono text-slate-200">← / →</kbd> {language === 'en' ? 'to dodge' : '移動閃避'}
            </div>
          </div>
        </div>

        {/* Right Column: Quiz Console (5 cols on desktop) */}
        <div className="lg:col-span-5 bg-slate-900 rounded-xl border border-slate-800 p-4 flex flex-col justify-between shadow-xl">
          {currentQuestion && (
            <div className="flex flex-col h-full justify-between">
              <div>
                {/* Category & difficulty header */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded border ${CATEGORY_LABELS[currentQuestion.category].badge}`}>
                    {t(CATEGORY_LABELS[currentQuestion.category].name)}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                    <span>{t(DIFFICULTY_LABELS[currentQuestion.difficulty].name)}</span>
                    <span>{DIFFICULTY_LABELS[currentQuestion.difficulty].stars}</span>
                  </div>
                </div>

                {/* Question Prompt */}
                <h3 className="text-sm sm:text-base font-bold text-slate-100 leading-snug mb-4">
                  {currentQuestion.question}
                </h3>

                <PythonCodeBlock code={currentQuestion.code} />

                {/* Options List */}
                <div className="space-y-2">
                  {currentQuestion.options.map((opt, idx) => {
                    let optStyle = 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:border-slate-500';
                    if (quizAnswered) {
                      if (idx === currentQuestion.correctAnswer) {
                        optStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                      } else if (selectedOption === idx) {
                        optStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                      } else {
                        optStyle = 'bg-slate-800/40 opacity-40 text-slate-400 border-transparent';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(idx)}
                        disabled={quizAnswered || battleState !== 'ongoing'}
                        className={`w-full p-3 rounded-lg text-left text-xs sm:text-sm border transition-all flex items-center justify-between cursor-pointer ${optStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-slate-900/60 border border-slate-700 flex items-center justify-center text-[10px] font-mono text-slate-400">
                            {idx + 1}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {quizAnswered && idx === currentQuestion.correctAnswer && (
                          <Sparkles size={16} className="text-emerald-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quiz feedback text */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                {feedbackText ? (
                  <div
                    className={`p-2.5 rounded-lg text-xs border animate-fadeIn ${
                      feedbackText.isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    <p className="font-semibold">{feedbackText.text}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{currentQuestion.explanation}</p>
                  </div>
                ) : (
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{language === 'en'
                      ? (isEnemyAttack ? 'Answer correctly to repel the enemy; a wrong answer loses this territory.' : '💡 Correct answers launch homing missiles. Wrong answers leave you exposed to enemy fire!')
                      : (isEnemyAttack ? '答對可擊退敵軍；答錯會失去這塊領地。' : '💡 答對發射追蹤導彈，答錯不發射並持續承受敵方攻擊！')}</span>
                    <span className="font-mono text-amber-400">{language === 'en' ? 'Streak' : '連勝'}: {player.stats.currentStreak}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- VICTORY MODAL OVERLAY --- */}
      {battleState === 'victory' && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/50 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl shadow-sky-950/50 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-sky-950 border-2 border-sky-400 flex items-center justify-center mx-auto mb-4 text-sky-400 shadow-lg shadow-sky-500/30">
              <Trophy size={32} />
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">
              {language === 'en' ? (isEnemyAttack ? 'Defense Successful!' : 'Victory!') : (isEnemyAttack ? '防守成功！' : '戰鬥大獲全勝！')}
            </h3>
            <p className="text-sm text-sky-300 mb-4">
              {language === 'en'
                ? (isEnemyAttack
                  ? `Correct answer! You repelled the enemy and defended ${t(terr?.name ?? '')}!`
                  : `You destroyed the defending drone at ${t(terr?.name ?? '')}. The territory is yours!`)
                : (isEnemyAttack
                  ? `答題正確，成功擊退敵軍，守住【${terr?.name}】！`
                  : `成功擊落【${terr?.name}】防守無人機，該領地已納入我方統治！`)}
            </p>

            {!isEnemyAttack && (
              <div className="bg-slate-800/80 rounded-xl p-3 mb-5 border border-slate-700/60 text-xs space-y-1.5 text-left">
                <div className="flex justify-between text-slate-300">
                  <span>{language === 'en' ? 'First Capture Reward' : '領地首佔獎勵'}</span>
                  <span className="font-mono font-bold text-amber-400">+{config.rewardCoins} {t('金幣')}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{language === 'en' ? 'Territory Income' : '領地金幣週期產出'}</span>
                  <span className="font-mono text-emerald-400">+{terr?.resourceRate} {t('金幣')} / {language === 'en' ? '6 sec' : '6秒'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>{language === 'en' ? 'Facilities Unlocked' : '領地設施解鎖'}</span>
                  <span className="text-sky-300">{language === 'en' ? 'Coin Factory / Defense Turret / Energy Shield / Institute' : '金幣工廠 / 防禦砲塔 / 能量護盾 / 研究所'}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => endBattle(true)}
              className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-sky-500/30 transition-all cursor-pointer text-sm"
            >
              {language === 'en' ? (isEnemyAttack ? 'Return to Map' : 'Claim Territory & Return to Map') : (isEnemyAttack ? '返回戰略地圖' : '接收領地並返回戰略地圖')}
            </button>
          </div>
        </div>
      )}

      {/* --- DEFEAT MODAL OVERLAY --- */}
      {battleState === 'defeat' && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl shadow-rose-950/50">
            <div className="w-16 h-16 rounded-full bg-rose-950 border-2 border-rose-500 flex items-center justify-center mx-auto mb-4 text-rose-400">
              <Skull size={32} />
            </div>

            <h3 className="text-2xl font-bold text-white mb-1">
              {language === 'en' ? (isEnemyAttack ? 'Territory Lost' : 'Ship Destroyed') : (isEnemyAttack ? '領地失守' : '艦隊生命值歸零')}
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              {language === 'en'
                ? (isEnemyAttack
                  ? `Incorrect answer. The enemy captured ${t(terr?.name ?? '')}.`
                  : 'The enemy drone overwhelmed your ship. Your fleet has been forced to retreat.')
                : (isEnemyAttack
                  ? `答題錯誤，敵軍已突破防線並佔領【${terr?.name}】。`
                  : '敵方無人機火力兇猛，艦隊受損嚴重被迫緊急折返。')}
            </p>

            {!isEnemyAttack && (
              <div className="bg-slate-800/60 rounded-xl p-3 mb-5 border border-slate-700/60 text-xs text-slate-400 text-left">
                {language === 'en'
                  ? '💡 Strategy tip: Build an Energy Shield to increase survivability or a Defense Turret for extra fire support before challenging tougher territories.'
                  : '💡 戰略提示：若想攻略更高難度的領地，可先在已佔領領地建設【能量護盾】提高生命承受力，或建造【防禦砲塔】進行火力支援！'}
              </div>
            )}

            <button
              onClick={() => endBattle(false)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-all cursor-pointer text-sm"
            >
              {language === 'en' ? (isEnemyAttack ? 'Confirm & Return to Map' : 'Return to Map') : (isEnemyAttack ? '確認並返回戰略地圖' : '返回戰略地圖重整旗鼓')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
