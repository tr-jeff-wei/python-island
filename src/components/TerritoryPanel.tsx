import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BuildingType, Question } from '../types/game';
import { FACTION_INFO } from '../data/initialMap';
import { DRONE_CONFIGS, BUILDING_TEMPLATES, getBuildingCost, calculateQuizReward } from '../utils/balance';
import { soundManager } from '../utils/audio';
import { getRandomQuestion, getQuestionContent, CATEGORY_LABELS, DIFFICULTY_LABELS } from '../data/questions';
import { getTerritoryAlien, getTerritoryTileImage } from '../utils/hexAssets';
import { PythonCodeBlock } from './PythonCodeBlock';
import { useLanguage } from '../context/LanguageContext';
import { 
  Shield, 
  Swords, 
  Coins, 
  Hammer, 
  ArrowUpCircle, 
  Wrench, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const TerritoryPanel: React.FC = () => {
  const {
    selectedTerritory,
    isAdjacentToPlayer,
    startBattle,
    buildFacility,
    upgradeFacility,
    repairTerritory,
    player,
    recordAnswer,
    addCoins,
  } = useGame();
  const { language, t } = useLanguage();

  // State for in-panel "建設答題 / 賺取金幣" modal/tab
  const [showResearchQuiz, setShowResearchQuiz] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState<Question | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState<{ isCorrect: boolean; text: string; coins: number } | null>(null);

  if (!selectedTerritory) {
    return (
      <div className="h-full bg-slate-900/60 rounded-xl border border-slate-800 p-6 flex flex-col items-center justify-center text-slate-500 text-center">
        <HelpCircle size={40} className="mb-2 opacity-40" />
        <p className="text-sm">{t('請點擊地圖上的六角形土地，查看領地詳情或發動決策。')}</p>
      </div>
    );
  }

  const terr = selectedTerritory;
  const isPlayer = terr.ownerId === 'player';
  const faction = FACTION_INFO[terr.ownerId] || FACTION_INFO.neutral;
  const adjacent = isAdjacentToPlayer(terr);
  const droneConfig = DRONE_CONFIGS[terr.droneLevel] || DRONE_CONFIGS[1];
  const quizContent = quizQuestion ? getQuestionContent(quizQuestion, language) : null;

  // Calculate Institute bonus percentage from all player territories
  const instituteBonusPercent = isPlayer
    ? terr.buildings
        .filter((b) => b.type === 'knowledge_institute')
        .reduce((sum, b) => sum + b.level * 25, 0)
    : 0;

  const startQuizForCoins = () => {
    soundManager.playClick();
    const q = getRandomQuestion(terr.level);
    setQuizQuestion(q);
    setSelectedOption(null);
    setQuizAnswered(false);
    setQuizFeedback(null);
    setShowResearchQuiz(true);
  };

  const handleSelectQuizOption = (idx: number) => {
    if (quizAnswered || !quizQuestion) return;
    setSelectedOption(idx);
    setQuizAnswered(true);

    const isCorrect = idx === quizQuestion.correctAnswer;
    if (isCorrect) {
      soundManager.playCorrect();
      const { coins } = calculateQuizReward(
        quizQuestion.reward,
        player.stats.currentStreak + 1,
        instituteBonusPercent
      );
      recordAnswer(true, quizQuestion.category, coins, quizQuestion, idx);
      setQuizFeedback({
        isCorrect: true,
        text: language === 'en'
          ? `Correct! You earned +${coins} coins!${player.stats.currentStreak >= 2 ? ` (Streak x${player.stats.currentStreak + 1})` : ''}`
          : `回答正確！獲得 +${coins} 金幣！${player.stats.currentStreak >= 2 ? ` (連勝 x${player.stats.currentStreak + 1})` : ''}`,
        coins,
      });
    } else {
      soundManager.playWrong();
      recordAnswer(false, quizQuestion.category, 0, quizQuestion, idx);
      setQuizFeedback({
        isCorrect: false,
        text: language === 'en'
          ? `Incorrect. Correct answer: ${getQuestionContent(quizQuestion, language).options[quizQuestion.correctAnswer]}`
          : `回答錯誤。正確解答：${getQuestionContent(quizQuestion, language).options[quizQuestion.correctAnswer]}`,
        coins: 0,
      });
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-full">
      {/* Header with Territory Banner */}
      <div className={`p-4 border-b border-slate-800/80 ${faction.banner}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg bg-slate-950/60 border border-slate-700/60 p-1 flex items-center justify-center shrink-0">
              <img
                src={getTerritoryTileImage(terr)}
                alt={language === 'en' ? 'Terrain' : '地形'}
                className="w-10 h-10 object-contain drop-shadow"
              />
              <img
                src={getTerritoryAlien(terr)}
                alt={language === 'en' ? 'Commander' : '指揮官'}
                className="absolute -bottom-1 -right-1 w-6 h-8 object-contain drop-shadow-md"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-semibold opacity-75">
                  {t(faction.name)}
                </span>
                {/* <span className="text-xs font-mono text-slate-300">
                  ({terr.q}, {terr.r})
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-emerald-300 font-mono">
                  {terr.ownerId === 'player' ? 'tileGrass' : terr.ownerId === 'enemy_red' ? 'tileLava' : 'tileSand'}
                </span> */}
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">{t(terr.name)}</h2>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-300 block">{t('領地等級')}</span>
            <span className="text-lg font-bold font-mono text-amber-400">Lv.{terr.level}</span>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* Territory Status Badges */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/50">
            <span className="text-slate-400 block mb-0.5">{t('防禦耐受度')}</span>
            <div className="flex items-center justify-between font-mono font-semibold text-slate-200">
              <span>{terr.defenseHealth} / {terr.maxDefenseHealth}</span>
              <span className="text-sky-400">{Math.round((terr.defenseHealth / terr.maxDefenseHealth) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-sky-400 h-full rounded-full transition-all"
                style={{ width: `${(terr.defenseHealth / terr.maxDefenseHealth) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/50">
            <span className="text-slate-400 block mb-0.5">{t('金幣週期產出')}</span>
            <div className="flex items-center gap-1.5 font-semibold text-amber-400 text-sm">
              <Coins size={16} />
              <span>+{terr.resourceRate} {t('金幣')} / {language === 'en' ? '6 sec' : '6秒'}</span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {terr.territoryType === 'mine' ? `★ ${t('金礦脈加成')}` : t('標準領地產出')}
            </span>
          </div>
        </div>

        {/* --- CASE A: NON-PLAYER TERRITORY (Neutral / Enemy) --- */}
        {!isPlayer && (
          <div className="space-y-4">
            <div className="bg-slate-800/50 p-3.5 rounded-lg border border-slate-700/60">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Shield size={14} className="text-rose-400" />
                {t('防守無人機情報')}
              </h3>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between items-center py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">{t('機型等級')}</span>
                  <span className="font-semibold text-white">{t(droneConfig.name)}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">{t('所需導彈命中次數')}</span>
                  <span className="font-bold text-rose-400 font-mono">
                    {droneConfig.maxHealth}{language === 'en' ? t('枚追蹤導彈') : ' 枚追蹤導彈'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">{t('攻擊發射週期')}</span>
                  <span className="font-mono text-slate-200">
                    {language === 'en' ? `Every ${droneConfig.attackInterval} seconds per attack wave` : `每 ${droneConfig.attackInterval} 秒發射 1 輪`}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-700/40">
                  <span className="text-slate-400">{t('彈幕型態')}</span>
                  <span className="text-amber-300 font-medium">
                    {droneConfig.bulletPattern === 'single' && t('單發電漿彈')}
                    {droneConfig.bulletPattern === 'double' && t('雙發交叉彈')}
                    {droneConfig.bulletPattern === 'spread' && t('三方散射電漿')}
                    {droneConfig.bulletPattern === 'homing' && t('極限追蹤電漿')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">{t('佔領首勝獎勵')}</span>
                  <span className="font-bold text-amber-400 font-mono">+{droneConfig.rewardCoins} {t('金幣')}</span>
                </div>
              </div>
            </div>

            {/* Adjacency check warning if cannot attack */}
            {!adjacent ? (
              <div className="bg-amber-950/40 border border-amber-600/30 p-3 rounded-lg text-xs text-amber-300 flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-400" />
                <span>
                  {t('距離過遠！根據戰略防禦協議，您只能攻佔與己方已佔領領地「相鄰」的土地。請先擴張邊境！')}
                </span>
              </div>
            ) : (
              <button
                onClick={() => startBattle(terr)}
                className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 active:scale-[0.99] text-white font-bold rounded-lg shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Swords size={18} />
                <span>{t('發動戰鬥攻佔領地 (進入無人機對決)')}</span>
              </button>
            )}
          </div>
        )}

        {/* --- CASE B: PLAYER TERRITORY (Management & Upgrades) --- */}
        {isPlayer && (
          <div className="space-y-4">
            {/* Quick Actions Bar */}
            <div className="flex gap-2">
              <button
                onClick={() => repairTerritory(terr.id)}
                disabled={terr.defenseHealth >= terr.maxDefenseHealth}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  terr.defenseHealth >= terr.maxDefenseHealth
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-sky-700 hover:bg-sky-600 text-white cursor-pointer'
                }`}
              >
                <Wrench size={14} />
                <span>{t('修復領地防禦')}</span>
              </button>

              <button
                onClick={startQuizForCoins}
                className="flex-1 py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles size={14} />
                <span>{t('建設答題 (賺金幣)')}</span>
              </button>
            </div>

            {/* Built Facilities List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  {t('已建置設施')} ({terr.buildings.length} / 1)
                </h3>
              </div>

              {terr.buildings.length === 0 ? (
                <div className="p-3 bg-slate-800/40 rounded-lg border border-slate-700/40 text-xs text-slate-400 text-center">
                  {t('目前尚未建設任何設施。在下方挑選建築以強化領地！')}
                </div>
              ) : (
                <div className="space-y-2">
                  {terr.buildings.map((b) => {
                    const nextCost = getBuildingCost(b.type, b.level);
                    const isMax = b.level >= 5;
                    const canAfford = player.coins >= nextCost;

                    return (
                      <div
                        key={b.id}
                        className="bg-slate-800/70 p-3 rounded-lg border border-slate-700/60 flex items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-100">{t(b.name)}</span>
                            <span className="px-1.5 py-0.2 bg-sky-950 border border-sky-600/40 text-sky-300 text-[11px] font-mono rounded">
                              Lv.{b.level}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{t(b.description)}</p>
                        </div>

                        {!isMax ? (
                          <button
                            onClick={() => upgradeFacility(terr.id, b.id)}
                            disabled={!canAfford}
                            className={`py-1.5 px-2.5 rounded text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors ${
                              canAfford
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                                : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
                            }`}
                          >
                            <ArrowUpCircle size={14} />
                            <span>{t('升級')} ({nextCost}{t('金')})</span>
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-amber-400 shrink-0">{t('已滿級')}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Build a facility only if the territory has none */}
            {terr.buildings.length === 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Hammer size={14} className="text-sky-400" />
                  {t('可建造新設施')}
                </h3>
                <div className="space-y-2">
                  {(Object.keys(BUILDING_TEMPLATES) as BuildingType[])
                    .filter((type) => !terr.buildings.some((b) => b.type === type))
                    .map((type) => {
                      const tpl = BUILDING_TEMPLATES[type];
                      const cost = getBuildingCost(type, 0);
                      const canAfford = player.coins >= cost;

                      return (
                        <div
                          key={type}
                          className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/40 flex items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <span className="font-semibold text-slate-200">{t(tpl.name)}</span>
                            <p className="text-[11px] text-slate-400 mt-0.5">{t(tpl.description)}</p>
                          </div>
                          <button
                            onClick={() => buildFacility(terr.id, type)}
                            disabled={!canAfford}
                            className={`py-1.5 px-3 rounded font-semibold shrink-0 flex items-center gap-1 transition-colors ${
                              canAfford
                                ? 'bg-sky-600 hover:bg-sky-500 text-white cursor-pointer'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                            }`}
                          >
                            <Coins size={12} className="text-amber-300" />
                            <span>{t('建造')} ({cost}{t('金')})</span>
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- IN-PANEL QUIZ MODAL FOR COIN RESEARCH --- */}
      {showResearchQuiz && quizQuestion && (
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${CATEGORY_LABELS[quizQuestion.category].badge}`}>
                {t(CATEGORY_LABELS[quizQuestion.category].name)}
              </span>
              <span className="text-[11px] text-amber-400 font-mono">
                {t(DIFFICULTY_LABELS[quizQuestion.difficulty].name)}
              </span>
            </div>
            <button
              onClick={() => setShowResearchQuiz(false)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
            >
              {t('關閉')}
            </button>
          </div>

          <h4 className="text-sm font-semibold text-white mb-3">
            {quizContent?.question}
          </h4>

          <PythonCodeBlock code={quizQuestion.code} />

          <div className="space-y-1.5 mb-3">
            {quizContent?.options.map((opt, idx) => {
              let btnClass = 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700';
              if (quizAnswered) {
                if (idx === quizQuestion.correctAnswer) {
                  btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                } else if (selectedOption === idx) {
                  btnClass = 'bg-rose-950/80 border-rose-500 text-rose-200';
                } else {
                  btnClass = 'bg-slate-800/40 opacity-40 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectQuizOption(idx)}
                  disabled={quizAnswered}
                  className={`w-full p-2 rounded text-xs border text-left flex items-center justify-between transition-colors ${btnClass}`}
                >
                  <span>{opt}</span>
                  {quizAnswered && idx === quizQuestion.correctAnswer && (
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  )}
                  {quizAnswered && selectedOption === idx && idx !== quizQuestion.correctAnswer && (
                    <XCircle size={14} className="text-rose-400" />
                  )}
                </button>
              );
            })}
          </div>

          {quizFeedback && (
            <div
              className={`p-2.5 rounded text-xs mb-2 border ${
                quizFeedback.isCorrect
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}
            >
              <p className="font-semibold">{quizFeedback.text}</p>
              <p className="mt-1 text-slate-300 text-[11px]">{quizContent?.explanation}</p>
            </div>
          )}

          {quizAnswered && (
            <button
              onClick={startQuizForCoins}
              className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded font-semibold text-xs transition-colors"
            >
              {t('下一題繼續賺金幣')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
