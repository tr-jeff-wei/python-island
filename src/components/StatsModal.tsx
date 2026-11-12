import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CATEGORY_LABELS } from '../data/questions';
import { QuestionCategory } from '../types/game';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, 
  Trophy, 
  Flame, 
  MapPin, 
  Coins, 
  CheckCircle2, 
  RotateCcw,
  Target,
  Award,
  History,
  Trash2
} from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose }) => {
  const {
    player,
    territories,
    resetGame,
    wrongAnswers,
    clearWrongAnswers,
    keepRecentWrongAnswers,
  } = useGame();
  const [confirmReset, setConfirmReset] = useState(false);
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  const totalAnswered = player.stats.totalAnswered;
  const correct = player.stats.correctAnswered;
  const accuracy = totalAnswered > 0 ? Math.round((correct / totalAnswered) * 100) : 0;
  const ownedTerritories = territories.filter((t) => t.ownerId === 'player').length;

  const achievements = [
    {
      id: 'first_capture',
      title: t('啟蒙征途'),
      desc: t('成功佔領首塊新領地'),
      unlocked: ownedTerritories >= 2,
    },
    {
      id: 'streak_5',
      title: t('連環妙答'),
      desc: t('達成連續答對 5 題 (Combo x5)'),
      unlocked: player.stats.maxStreak >= 5,
    },
    {
      id: 'capture_5',
      title: t('王國崛起'),
      desc: t('將領地擴張至 5 塊土地'),
      unlocked: ownedTerritories >= 5,
    },
    {
      id: 'coin_1000',
      title: t('黃金國度'),
      desc: t('累積獲取超過 1,000 金幣'),
      unlocked: player.stats.totalCoinsEarned >= 1000,
    },
    {
      id: 'answer_30',
      title: t('博學賢者'),
      desc: t('累計回答 30 道題目'),
      unlocked: totalAnswered >= 30,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-amber-400" />
            <h2 className="text-base font-bold text-white">{t('領主戰績與成就記錄')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Top Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">{t('領地佔領數')}</span>
              <div className="flex items-center gap-1.5 font-bold font-mono text-lg text-sky-400">
                <MapPin size={16} />
                <span>{ownedTerritories}</span>
                <span className="text-xs text-slate-500 font-sans">/ {territories.length}</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">{t('累積獲得金幣')}</span>
              <div className="flex items-center gap-1.5 font-bold font-mono text-lg text-amber-400">
                <Coins size={16} />
                <span>{player.stats.totalCoinsEarned.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">{t('總答題正確率')}</span>
              <div className="flex items-center gap-1.5 font-bold font-mono text-lg text-emerald-400">
                <Target size={16} />
                <span>{accuracy}%</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-1">{t('最高連續答對')}</span>
              <div className="flex items-center gap-1.5 font-bold font-mono text-lg text-rose-400">
                <Flame size={16} />
                <span>{player.stats.maxStreak}{language === 'en' ? ' questions' : ' 題'}</span>
              </div>
            </div>
          </div>

          {/* Category Proficiency Breakdown */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              {t('各領域答題數據分析')}
            </h3>
            <div className="space-y-3">
              {(Object.keys(CATEGORY_LABELS) as QuestionCategory[]).map((cat) => {
                const stat = player.stats.categoryStats[cat] || { answered: 0, correct: 0 };
                const pct = stat.answered > 0 ? Math.round((stat.correct / stat.answered) * 100) : 0;

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-200">
                        {t(CATEGORY_LABELS[cat].name)}
                      </span>
                      <span className="font-mono text-slate-400">
                        {stat.correct} / {stat.answered} {language === 'en' ? 'questions' : '題'} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <section className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <History size={15} className="text-rose-400" />
                {t('錯誤清單')} ({wrongAnswers.length})
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={keepRecentWrongAnswers}
                  disabled={wrongAnswers.length <= 10}
                  className="px-2.5 py-1.5 rounded-lg text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {t('保留最近 10 筆')}
                </button>
                <button
                  type="button"
                  onClick={clearWrongAnswers}
                  disabled={wrongAnswers.length === 0}
                  className="px-2.5 py-1.5 rounded-lg text-xs text-rose-300 bg-rose-950/50 hover:bg-rose-900/70 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                >
                  <Trash2 size={13} />
                  {t('清除全部')}
                </button>
              </div>
            </div>

            {wrongAnswers.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-5">{t('目前沒有答錯紀錄')}</p>
            ) : (
              <div className="space-y-2">
                {wrongAnswers.map((entry, index) => {
                  const { question } = entry;
                  return (
                    <article
                      key={`${question.id}-${entry.answeredAt}-${index}`}
                      className="p-3 rounded-lg bg-slate-900 border border-slate-800"
                    >
                      <div className="flex flex-wrap justify-between gap-2 mb-2">
                        <span className="text-[11px] text-slate-400">
                          {t(CATEGORY_LABELS[question.category]?.name ?? '其他類別')}
                          {' · '}
                          {new Date(entry.answeredAt).toLocaleString('zh-TW')}
                        </span>
                        <span className="text-[11px] text-rose-400">{t('答錯')}</span>
                      </div>
                      <p className="text-sm font-medium text-slate-100">{question.question}</p>
                      {question.code && (
                        <pre className="mt-2 p-2 rounded bg-slate-950 text-xs text-sky-200 overflow-x-auto whitespace-pre-wrap">
                          {question.code}
                        </pre>
                      )}
                      <div className="mt-2 grid gap-1 text-xs">
                        <p className="text-rose-300">
                          {t('你的答案：')}{question.options[entry.selectedAnswer]}
                        </p>
                        <p className="text-emerald-300">
                          {t('正確答案：')}{question.options[question.correctAnswer]}
                        </p>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">{question.explanation}</p>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Achievements / Milestones */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Award size={15} className="text-amber-400" />
              {t('戰略勳章與成就')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                    ach.unlocked
                      ? 'bg-slate-950 border-amber-500/40 text-slate-100'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-60'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      ach.unlocked
                        ? 'bg-amber-950/60 border border-amber-500 text-amber-400'
                        : 'bg-slate-900 border border-slate-800 text-slate-600'
                    }`}
                  >
                    <CheckCircle2 size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{ach.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{ach.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Save Data */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">{t('遊戲進度自動儲存於瀏覽器 LocalStorage')}</span>

            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-rose-950/80 hover:text-rose-300 text-slate-400 rounded-lg text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>{t('重設遊戲存檔')}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-rose-400 font-semibold">{t('確定重設？進度將無法復原')}</span>
                <button
                  onClick={() => {
                    resetGame();
                    setConfirmReset(false);
                    onClose();
                  }}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold"
                >
                  {t('確認清除')}
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs"
                >
                  {t('取消')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
