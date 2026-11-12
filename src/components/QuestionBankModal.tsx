import React, { useState } from 'react';
import { 
  getAllQuestions, 
  saveCustomQuestion, 
  deleteCustomQuestion, 
  CATEGORY_LABELS, 
  DIFFICULTY_LABELS,
  DEFAULT_QUESTIONS
} from '../data/questions';
import { Question, QuestionCategory } from '../types/game';
import { soundManager } from '../utils/audio';
import { PythonCodeBlock } from './PythonCodeBlock';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, 
  Plus, 
  Search, 
  Trash2, 
  CheckCircle2, 
  HelpCircle,
  FileText
} from 'lucide-react';

interface QuestionBankModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>(getAllQuestions());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New question form state
  const [newCategory, setNewCategory] = useState<QuestionCategory>('variable');
  const [newDifficulty, setNewDifficulty] = useState<number>(2);
  const [newType, setNewType] = useState<'single' | 'boolean'>('single');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newOptions, setNewOptions] = useState<string[]>(['', '', '', '']);
  const [newCorrectAnswer, setNewCorrectAnswer] = useState<number>(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [newReward, setNewReward] = useState<number>(30);

  if (!isOpen) return null;

  const refreshList = () => {
    setQuestions(getAllQuestions());
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const finalOptions =
      newType === 'boolean'
        ? [t('是 (正確)'), t('否 (錯誤)')]
        : newOptions.map((o, idx) => o.trim() || `${language === 'en' ? 'Option' : '選項'} ${idx + 1}`);

    const q: Question = {
      id: `custom_${Date.now()}`,
      category: newCategory,
      difficulty: newDifficulty,
      type: newType,
      question: newQuestionText.trim(),
      code: newCode,
      options: finalOptions,
      correctAnswer: newCorrectAnswer,
      explanation: newExplanation.trim() || t('答案正確無誤。'),
      reward: newReward,
    };

    saveCustomQuestion(q);
    soundManager.playCorrect();
    refreshList();
    setIsAddingNew(false);

    // Reset form
    setNewQuestionText('');
    setNewCode('');
    setNewOptions(['', '', '', '']);
    setNewExplanation('');
  };

  const handleDelete = (id: string) => {
    deleteCustomQuestion(id);
    soundManager.playClick();
    refreshList();
  };

  const filteredQuestions = questions.filter((q) => {
    if (categoryFilter !== 'all' && q.category !== categoryFilter) return false;
    if (difficultyFilter !== 'all' && q.difficulty.toString() !== difficultyFilter) return false;
    if (searchQuery.trim() && !q.question.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-sky-400" />
            <div>
              <h2 className="text-base font-bold text-white">{t('智慧題庫管理中心')}</h2>
              <span className="text-xs text-slate-400">
                {language === 'en'
                  ? `${questions.length} questions (${questions.length - DEFAULT_QUESTIONS.length} custom)`
                  : `收錄 ${questions.length} 題知識測驗 (含 ${questions.length - DEFAULT_QUESTIONS.length} 題自訂題)`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isAddingNew ? (
              <button
                onClick={() => setIsAddingNew(true)}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>{t('新增自訂題目')}</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                {t('返回清單')}
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {!isAddingNew ? (
            <div className="space-y-4">
              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder={t('搜尋題目關鍵字...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Category select */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
                >
                  <option value="all">{t('所有知識分類')}</option>
                  {(Object.keys(CATEGORY_LABELS) as QuestionCategory[]).map((cat) => (
                    <option key={cat} value={cat}>
                      {t(CATEGORY_LABELS[cat].name)}
                    </option>
                  ))}
                </select>

                {/* Difficulty select */}
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
                >
                  <option value="all">{t('所有難度等級')}</option>
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <option key={lvl} value={lvl.toString()}>
                      {t(DIFFICULTY_LABELS[lvl].name)} ({DIFFICULTY_LABELS[lvl].stars})
                    </option>
                  ))}
                </select>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {filteredQuestions.map((q) => {
                  const isCustom = q.id.startsWith('custom_');

                  return (
                    <div
                      key={q.id}
                      className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${CATEGORY_LABELS[q.category].badge}`}>
                            {t(CATEGORY_LABELS[q.category].name)}
                          </span>
                          <span className="text-[11px] text-amber-400 font-mono">
                            {t(DIFFICULTY_LABELS[q.difficulty].name)}
                          </span>
                          {isCustom && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-purple-950 border border-purple-500/40 text-purple-300 rounded font-medium">
                              {t('自訂')}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-amber-400">+{q.reward} {t('金幣')}</span>
                          {isCustom && (
                            <button
                              onClick={() => handleDelete(q.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded"
                              title={t('刪除自訂題目')}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      <h4 className="text-sm font-semibold text-slate-100 mb-2">
                        {q.question}
                      </h4>

                      <PythonCodeBlock code={q.code} />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-1.5 rounded border text-[11px] flex items-center gap-1.5 ${
                              oIdx === q.correctAnswer
                                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-medium'
                                : 'bg-slate-900 border-slate-800 text-slate-400'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[9px] font-mono shrink-0">
                              {oIdx + 1}
                            </span>
                            <span className="truncate">{opt}</span>
                            {oIdx === q.correctAnswer && (
                              <CheckCircle2 size={12} className="text-emerald-400 shrink-0 ml-auto" />
                            )}
                          </div>
                        ))}
                      </div>

                      {q.explanation && (
                        <p className="mt-2 text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded border border-slate-800/80">
                          💡 <span className="font-medium text-slate-300">{t('解析：')}</span>{q.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}

                {filteredQuestions.length === 0 && (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    {t('沒有找到符合篩選條件的題目。')}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Add New Question Form */
            <form onSubmit={handleSaveQuestion} className="space-y-4 max-w-xl mx-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">{t('知識領域分類')}</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as QuestionCategory)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  >
                    {(Object.keys(CATEGORY_LABELS) as QuestionCategory[]).map((cat) => (
                      <option key={cat} value={cat}>
                        {t(CATEGORY_LABELS[cat].name)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">{t('難度等級 (1-5)')}</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200"
                  >
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <option key={lvl} value={lvl}>
                        Lv.{lvl} - {t(DIFFICULTY_LABELS[lvl].name)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('題型模式')}</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewType('single')}
                    className={`flex-1 py-1.5 rounded text-xs font-medium border ${
                      newType === 'single'
                        ? 'bg-sky-600 border-sky-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {t('四選一單選題')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewType('boolean');
                      setNewCorrectAnswer(0);
                    }}
                    className={`flex-1 py-1.5 rounded text-xs font-medium border ${
                      newType === 'boolean'
                        ? 'bg-sky-600 border-sky-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    {t('是非題 (True / False)')}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('題目內容')}</label>
                <textarea
                  rows={2}
                  required
                  placeholder={t('請輸入題目問題描述...')}
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('Python 程式碼（選填）')}</label>
                <textarea
                  rows={5}
                  placeholder={language === 'en' ? 'Example:\nfor i in range(3):\n    print(i)' : '例如：\nfor i in range(3):\n    print(i)'}
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full resize-y bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              {newType === 'single' ? (
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-300">
                    {t('選項 (請勾選正確答案)：')}
                  </label>
                  {newOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOpt"
                        checked={newCorrectAnswer === idx}
                        onChange={() => setNewCorrectAnswer(idx)}
                        className="accent-sky-500"
                      />
                      <input
                        type="text"
                        required
                        placeholder={`${language === 'en' ? 'Option' : '選項'} ${idx + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...newOptions];
                          updated[idx] = e.target.value;
                          setNewOptions(updated);
                        }}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">{t('正確答案')}</label>
                  <div className="flex gap-4 text-xs text-slate-200">
                    <label className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="boolAns"
                        checked={newCorrectAnswer === 0}
                        onChange={() => setNewCorrectAnswer(0)}
                        className="accent-sky-500"
                      />
                      {t('是 (正確)')}
                    </label>
                    <label className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name="boolAns"
                        checked={newCorrectAnswer === 1}
                        onChange={() => setNewCorrectAnswer(1)}
                        className="accent-sky-500"
                      />
                      {t('否 (錯誤)')}
                    </label>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">{t('解答解析說明')}</label>
                <textarea
                  rows={2}
                  placeholder={t('說明為何此選項為正確答案...')}
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t('答對金幣獎勵')}
                </label>
                <input
                  type="number"
                  min={10}
                  max={500}
                  value={newReward}
                  onChange={(e) => setNewReward(Number(e.target.value))}
                  className="w-32 bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  {t('取消')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs shadow-lg shadow-sky-950/40"
                >
                  {t('確認儲存題目')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
