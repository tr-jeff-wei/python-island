import React from 'react';
import { X, Map, Crosshair, Building2, HelpCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle size={20} className="text-amber-400" />
            <h2 className="text-base font-bold text-white">{t('「知識領主」作戰與經營指南')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-slate-300 leading-relaxed">
          {/* Section 1 */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <h3 className="font-bold text-sky-400 text-sm mb-1.5 flex items-center gap-1.5">
              <Map size={16} />
              {t('1. 六角戰略地圖與相鄰攻佔規則')}
            </h3>
            <p className="text-slate-300 mb-1">
              {t('您初始擁有中心首府【智者衛城】。地圖上散佈著中立領地以及赤紅軍團、暗影公會等 AI 勢力。')}
            </p>
            <p className="text-slate-400">
              ⚡ <strong className="text-amber-300">{t('相鄰限制：')}</strong>{t('為了維持戰線推進邏輯，您只能攻佔與己方已擁有領地「緊鄰」的土地（地圖上帶有金黃色虛線脈衝框）。')}
            </p>
            <p className="text-slate-400 mt-1">
              <strong className="text-rose-300">{t('敵方攻擊：')}</strong>{t('頂端倒數每 100 秒發動一次；敵軍會從己方領地出發攻擊相鄰的中立或玩家領地。中立地會直接易主；若遭攻擊的是我方領地，答對防守題可擊退敵軍，答錯則失去該領地。任何一方發動攻擊後，倒數都會重新計時。')}
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <h3 className="font-bold text-rose-400 text-sm mb-1.5 flex items-center gap-1.5">
              <Crosshair size={16} />
              {t('2. 2D 即時無人機彈幕戰鬥')}
            </h3>
            <p className="text-slate-300 mb-1">
              {t('進入戰鬥後，防守無人機將會根據其等級定期發射電漿攻擊彈。')}
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
              <li>
                <strong className="text-slate-200">{t('操作閃避：')}</strong>{t('使用鍵盤')}{' '}<kbd className="px-1 bg-slate-800 text-slate-200 rounded">A / D</kbd>{' '}{t('或')}{' '}<kbd className="px-1 bg-slate-800 text-slate-200 rounded">← / →</kbd>{t('（或螢幕左右觸控鍵）靈活移動戰機，閃避下墜攻擊彈。')}
              </li>
              <li>
                <strong className="text-slate-200">{t('答題反擊：')}</strong>{t('戰機本身不發射普通子彈，每一次答對題目都會立即發射一枚【追蹤導彈】，命中將削弱敵機生命值。')}
              </li>
              <li>
                <strong className="text-slate-200">{t('答錯風險：')}</strong>{t('答錯不會發射導彈，敵機依然會持續攻擊，需立即集中精神面對下一題！')}
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
            <h3 className="font-bold text-emerald-400 text-sm mb-1.5 flex items-center gap-1.5">
              <Building2 size={16} />
              {t('3. 領地建設與實質效果')}
            </h3>
            <p className="text-slate-300 mb-2">
              {t('成功佔領領地後，每塊土地只能選擇建設 1 種設施；建成後可持續升級至最高 Lv.5：')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="font-bold text-amber-300">{t('金幣工廠')}</span>
                <p className="text-slate-400 mt-0.5">{t('每 5 秒自動產生金幣，等級越高金幣收入越龐大。')}</p>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="font-bold text-sky-300">{t('防禦砲塔')}</span>
                <p className="text-slate-400 mt-0.5">{t('戰鬥時自動對敵方無人機進行重砲火力支援。')}</p>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="font-bold text-emerald-300">{t('能量護盾')}</span>
                <p className="text-slate-400 mt-0.5">{t('在戰鬥開局提供額外藍色吸收護盾，降低失誤損耗。')}</p>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="font-bold text-purple-300">{t('知識研究所')}</span>
                <p className="text-slate-400 mt-0.5">{t('大幅提升答題所獲金幣，並強化連擊倍率獎勵。')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg text-xs"
          >
            {t('我明白了，開始征戰！')}
          </button>
        </div>
      </div>
    </div>
  );
};
