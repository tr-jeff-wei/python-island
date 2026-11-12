/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { TopBar } from './components/TopBar';
import { HexMap } from './components/HexMap';
import { TerritoryPanel } from './components/TerritoryPanel';
import { DroneCombatView } from './components/DroneCombatView';
import { QuestionBankModal } from './components/QuestionBankModal';
import { StatsModal } from './components/StatsModal';
import { GuideModal } from './components/GuideModal';
import { X, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { GameNotification } from './types/game';
import { KnowledgeMapPage } from './components/KnowledgeMapPage';
import { LanguageProvider } from './context/LanguageContext';
import { useLanguage } from './context/LanguageContext';

const NotificationToast: React.FC<{
  notification: GameNotification;
  onDismiss: (id: string) => void;
}> = ({ notification, onDismiss }) => {
  const [isFading, setIsFading] = useState(false);
  const { language, t } = useLanguage();

  useEffect(() => {
    const remainingTime = Math.max(0, 20_000 - (Date.now() - notification.timestamp));
    const fadeTimer = window.setTimeout(() => setIsFading(true), remainingTime);
    const dismissTimer = window.setTimeout(() => onDismiss(notification.id), remainingTime + 500);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(dismissTimer);
    };
  }, [notification.id, notification.timestamp, onDismiss]);

  let borderStyle = 'border-slate-700 bg-slate-900/95 text-slate-200';
  let icon = <Sparkles size={16} className="text-sky-400 shrink-0" />;

  if (notification.type === 'conquest') {
    borderStyle = 'border-amber-500/80 bg-slate-900/95 text-amber-200';
    icon = <Sparkles size={16} className="text-amber-400 shrink-0" />;
  } else if (notification.type === 'warning') {
    borderStyle = 'border-rose-500/80 bg-slate-900/95 text-rose-200';
    icon = <AlertTriangle size={16} className="text-rose-400 shrink-0" />;
  } else if (notification.type === 'defense') {
    borderStyle = 'border-sky-500/80 bg-slate-900/95 text-sky-200';
    icon = <ShieldCheck size={16} className="text-sky-400 shrink-0" />;
  }

  const displayMessage = (() => {
    const message = notification.message;
    if (language !== 'en') return message;
    let match = message.match(/^敵軍攻佔了【(.+)】！$/);
    if (match) return `Enemy captured ${t(match[1])}!`;

    match = message.match(/^防守成功！你答對了，敵軍未能攻佔【(.+)】。$/);
    if (match) return `Defense successful! You answered correctly and held ${t(match[1])}.`;

    match = message.match(/^防守失敗！敵軍佔領了【(.+)】。$/);
    if (match) return `Defense failed! The enemy captured ${t(match[1])}.`;

    match = message.match(/^大獲全勝！成功佔領【(.+)】，獲得領地首佔獎勵 \+(\d+) 金幣！$/);
    if (match) return `Victory! Captured ${t(match[1])} and earned a first-capture reward of +${match[2]} coins!`;

    match = message.match(/^成功在【(.+)】建造【(.+) Lv\.(\d+)】！領地同步至 Lv\.(\d+)。消耗 (\d+) 金幣。$/);
    if (match) return `Built ${t(match[2])} Lv.${match[3]} at ${t(match[1])}. Territory upgraded to Lv.${match[4]}. Cost: ${match[5]} coins.`;

    match = message.match(/^【(.+)】成功升級至 Lv\.(\d+)，領地同步升級！消耗 (\d+) 金幣。$/);
    if (match) return `${t(match[1])} upgraded to Lv.${match[2]}. Territory upgraded too. Cost: ${match[3]} coins.`;

    match = message.match(/^【(.+)】城防修復完畢！消耗 (\d+) 金幣。$/);
    if (match) return `Defenses repaired at ${t(match[1])}. Cost: ${match[2]} coins.`;

    if (message === '請先完成目前的敵軍突襲！') return 'Finish the current enemy attack first!';
    if (message === '無法攻擊：必須先佔領與該土地相鄰的領地！') return 'Cannot attack: capture an adjacent territory first!';
    if (message === '戰鬥撤退：艦隊受損，未能擊落防守無人機。領地依然保持原狀。') return 'Retreated from battle. Your fleet was damaged, but the territory remains unchanged.';
    if (message === '遊戲進度已重新初始化！祝您征服全境！') return 'Game progress reset. Good luck conquering the map!';
    return message;
  })();

  return (
    <div
      className={`p-3 rounded-xl border shadow-xl backdrop-blur-md text-xs flex items-center justify-between gap-2.5 pointer-events-auto transition-all duration-500 animate-fadeIn ${
        isFading ? 'opacity-0 translate-x-3' : ''
      } ${borderStyle}`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="leading-tight">{displayMessage}</span>
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="text-slate-400 hover:text-white p-0.5"
        aria-label={t('關閉通知')}
      >
        <X size={13} />
      </button>
    </div>
  );
};

const GameMain: React.FC = () => {
  const { activeBattleTerritory, notifications, dismissNotification } = useGame();

  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Bar Navigation */}
      <TopBar
        onOpenQuestionBank={() => setShowQuestionBank(true)}
        onOpenStats={() => setShowStats(true)}
        onOpenGuide={() => setShowGuide(true)}
      />

      {/* Main View Area: Combat or Strategic Map */}
      <main className="flex-1 overflow-hidden p-3 relative flex flex-col">
        {activeBattleTerritory ? (
          <DroneCombatView />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-full">
            {/* Hex Map on Left (8 cols) */}
            <div className="lg:col-span-8 h-full flex flex-col min-h-0">
              <HexMap />
            </div>

            {/* Territory Management Panel on Right (4 cols) */}
            <div className="lg:col-span-4 h-full flex flex-col min-h-0">
              <TerritoryPanel />
            </div>
          </div>
        )}
      </main>

      {/* Floating Notifications Toasts */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2 max-w-sm pointer-events-none">
        {notifications.map((notification) => (
          <NotificationToast
            key={notification.id}
            notification={notification}
            onDismiss={dismissNotification}
          />
        ))}
      </div>

      {/* Modals */}
      <QuestionBankModal
        isOpen={showQuestionBank}
        onClose={() => setShowQuestionBank(false)}
      />

      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
      />

      <GuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </div>
  );
};

export default function App() {
  const knowledgeMapPath = `${import.meta.env.BASE_URL}knowledge-map`.replace(/\/+$/, '');

  return (
    <LanguageProvider>
      {window.location.pathname === knowledgeMapPath ? (
        <KnowledgeMapPage />
      ) : (
        <GameProvider>
          <GameMain />
        </GameProvider>
      )}
    </LanguageProvider>
  );
}
