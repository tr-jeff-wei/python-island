import React from 'react';
import { useGame } from '../context/GameContext';
import { soundManager } from '../utils/audio';
import { 
  Coins, 
  MapPin, 
  Map,
  Flame, 
  BookMarked, 
  BarChart3, 
  HelpCircle, 
  Volume2, 
  VolumeX,
  Timer,
  Languages,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TopBarProps {
  onOpenQuestionBank: () => void;
  onOpenStats: () => void;
  onOpenGuide: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenQuestionBank,
  onOpenStats,
  onOpenGuide,
}) => {
  const { player, toggleSound, enemyAttackCountdown, activeBattleMode, activeEnemyAttack } = useGame();
  const { language, setLanguage, t } = useLanguage();
  const isEnemyBattle = activeBattleMode !== null && activeBattleMode !== 'player';
  const isEnemyAttacking = isEnemyBattle || activeEnemyAttack !== null;
  const countdownLabel = `${Math.floor(enemyAttackCountdown / 60)}:${String(enemyAttackCountdown % 60).padStart(2, '0')}`;

  const handleNavClick = (fn: () => void) => {
    soundManager.playClick();
    fn();
  };

  return (
    <header className="flex items-center justify-between gap-2 md:gap-8 px-3 md:px-6 py-3.5 bg-slate-900 border-b border-slate-800 text-slate-100 select-none">
      {/* Zone 1: Brand Title & Commander Avatar */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <img
          src={`${import.meta.env.BASE_URL}assets/aistudio/alienBlue_63396983.png`}
          alt="Player Commander"
          className="w-8 h-8 object-contain drop-shadow"
        />
        <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
          {t('知識領主')}
          <span className="text-xs font-normal text-slate-400 font-mono tracking-normal">
            KNOWLEDGE CONQUEST
          </span>
        </span>
      </div>

      {/* Zone 2: Navigation Links & Indicators */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
        {/* Quick Resource Indicators */}
        <div className="flex items-center gap-4 text-xs font-mono bg-slate-950/60 px-3.5 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Coins size={15} />
            <span className="font-bold tabular-nums">{player.coins.toLocaleString()}</span>
            <span className="text-[11px] text-slate-400 font-sans">{t('金幣')}</span>
          </div>

          <span className="text-slate-700">|</span>

          <div className="flex items-center gap-1.5 text-sky-400">
            <MapPin size={15} />
            <span className="font-bold tabular-nums">{player.territoryIds.length}</span>
            <span className="text-[11px] text-slate-400 font-sans">{t('領地')}</span>
          </div>

          {player.stats.currentStreak > 0 && (
            <>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1 text-rose-400">
                <Flame size={15} />
                <span className="font-bold tabular-nums">{player.stats.currentStreak}</span>
                <span className="text-[11px] text-slate-400 font-sans">{t('連勝')}</span>
              </div>
            </>
          )}
        </div>

        {/* Modal Triggers */}
        <a
          href={`${import.meta.env.BASE_URL}knowledge-map`}
          className="flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap text-xs transition-colors hover:text-white"
        >
          <Map size={14} className="text-violet-400" />
          <span>{t('知識領地')}</span>
        </a>

        <button
          onClick={() => handleNavClick(onOpenQuestionBank)}
          className="hover:text-white transition-colors flex items-center gap-1.5 text-xs whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BookMarked size={14} className="text-sky-400" />
          <span>{t('題庫管理')}</span>
        </button>

        <button
          onClick={() => handleNavClick(onOpenStats)}
          className="hover:text-white transition-colors flex items-center gap-1.5 text-xs whitespace-nowrap shrink-0 cursor-pointer"
        >
          <BarChart3 size={14} className="text-emerald-400" />
          <span>{t('戰績成就')}</span>
        </button>

        <button
          onClick={() => handleNavClick(onOpenGuide)}
          className="hover:text-white transition-colors flex items-center gap-1.5 text-xs whitespace-nowrap shrink-0 cursor-pointer"
        >
          <HelpCircle size={14} className="text-amber-400" />
          <span>{t('遊戲指南')}</span>
        </button>
      </nav>

      {/* Zone 3: Primary Action / Sound Control */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700 hover:text-white"
          aria-label={language === 'zh' ? 'Switch to English' : '切換為中文'}
          title={language === 'zh' ? 'Switch to English' : '切換為中文'}
        >
          <Languages size={15} />
          <span>{language === 'zh' ? '中文 / EN' : 'EN / 中文'}</span>
        </button>
        <a
          href={`${import.meta.env.BASE_URL}knowledge-map`}
          aria-label={t('開啟知識領地地圖')}
          title={t('知識領地地圖')}
          className="rounded-lg bg-slate-800 p-2 text-violet-300 transition-colors hover:bg-slate-700 hover:text-white md:hidden"
        >
          <Map size={16} />
        </a>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono ${
            isEnemyAttacking
              ? 'border-rose-500/50 bg-rose-950/50 text-rose-300'
              : enemyAttackCountdown <= 10
                ? 'border-rose-500/50 bg-rose-950/50 text-rose-300 animate-pulse'
                : 'border-slate-700 bg-slate-950/60 text-amber-300'
          }`}
          aria-live="polite"
          title={isEnemyAttacking ? t('正在進行敵方攻擊') : t('距離敵方下次攻擊')}
        >
          <Timer size={15} />
          <span className="hidden sm:inline">{isEnemyAttacking ? t('敵軍突襲') : t('敵軍來襲')}</span>
          <span className="font-bold tabular-nums">{countdownLabel}</span>
        </div>
        <button
          onClick={toggleSound}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title={player.soundEnabled ? t('音效開啟') : t('音效靜音')}
        >
          {player.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>
    </header>
  );
};
