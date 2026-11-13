import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'zh' | 'en';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (chinese: string) => string;
}

const translations: Record<string, string> = {
  '知識領主': 'Knowledge Conquest',
  '金幣': 'Coins',
  '領地': 'Territories',
  '連勝': 'Streak',
  '知識領地': 'Knowledge Map',
  '題庫管理': 'Question Bank',
  '戰績成就': 'Statistics',
  '遊戲指南': 'Game Guide',
  '開啟知識領地地圖': 'Open the knowledge map',
  '知識領地地圖': 'Knowledge Map',
  '正在進行敵方攻擊': 'Enemy attack in progress',
  '距離敵方下次攻擊': 'Time until the next enemy attack',
  '敵軍突襲': 'Enemy attack',
  '敵軍來襲': 'Enemy incoming',
  '音效開啟': 'Sound on',
  '音效靜音': 'Sound off',
  '六角戰略地圖 · 2.5D 等角領地視界': 'Hex Strategy Map · 2.5D Isometric View',
  '塊領地': 'territories',
  '放大': 'Zoom in',
  '縮小': 'Zoom out',
  '重設視角': 'Reset view',
  '關閉通知': 'Dismiss notification',
  '敵方佔領': 'Enemy territory',
  '玩家領地 (tileGrass)': 'Player (Grassland)',
  '中立領地 (tileSand)': 'Neutral (Sand)',
  '赤紅軍團 (tileLava)': 'Crimson Legion (Lava)',
  '可攻打領地 (相鄰)': 'Attackable (Adjacent)',
  '點擊土地查看詳情 · 拖曳地圖 · 滾輪縮放': 'Click a territory for details · Drag to pan · Scroll to zoom',
  '請點擊地圖上的六角形土地，查看領地詳情或發動決策。': 'Select a hex on the map to view territory details or take action.',
  '領地等級': 'Territory Level',
  '防禦耐受度': 'Defense',
  '金幣週期產出': 'Coin income',
  '金礦脈加成': 'Mine bonus',
  '標準領地產出': 'Standard territory income',
  '防守無人機情報': 'Defending Drone Intel',
  '機型等級': 'Drone level',
  '所需導彈命中次數': 'Missile hits required',
  '枚追蹤導彈': ' homing missiles',
  '攻擊發射週期': 'Attack interval',
  '彈幕型態': 'Projectile pattern',
  '單發電漿彈': 'Single plasma shot',
  '雙發交叉彈': 'Crossfire',
  '三方散射電漿': 'Triple plasma spread',
  '極限追蹤電漿': 'Advanced homing plasma',
  '佔領首勝獎勵': 'First capture reward',
  '距離過遠！根據戰略防禦協議，您只能攻佔與己方已佔領領地「相鄰」的土地。請先擴張邊境！': 'Too far away! You can only capture territories adjacent to your own. Expand your borders first!',
  '發動戰鬥攻佔領地 (進入無人機對決)': 'Attack to capture (Drone battle)',
  '修復領地防禦': 'Repair territory defenses',
  '建設答題 (賺金幣)': 'Answer questions (Earn coins)',
  '可建造新設施': 'Available Facilities',
  '已滿級': 'Max level',
  '下一題繼續賺金幣': 'Next question',
  '關閉': 'Close',
  '已建置設施': 'Facilities',
  '升級': 'Upgrade',
  '金': ' coins',
  '建造': 'Build',
  '目前尚未建設任何設施。在下方挑選建築以強化領地！': 'No facilities built yet. Choose one below to strengthen this territory!',
  '智慧題庫管理中心': 'Question Bank',
  '新增自訂題目': 'Add Custom Question',
  '返回清單': 'Back to list',
  '搜尋題目關鍵字...': 'Search questions...',
  '所有知識分類': 'All categories',
  '所有難度等級': 'All difficulty levels',
  '自訂': 'Custom',
  '刪除自訂題目': 'Delete custom question',
  '解析：': 'Explanation: ',
  '沒有找到符合篩選條件的題目。': 'No questions match your filters.',
  '知識領域分類': 'Category',
  '難度等級 (1-5)': 'Difficulty (1-5)',
  '題型模式': 'Question type',
  '四選一單選題': 'Multiple choice',
  '是非題 (True / False)': 'True / False',
  '題目內容': 'Question',
  '請輸入題目問題描述...': 'Enter the question...',
  'Python 程式碼（選填）': 'Python code (optional)',
  '選項 (請勾選正確答案)：': 'Options (select the correct answer):',
  '正確答案': 'Correct answer',
  '是 (正確)': 'True',
  '否 (錯誤)': 'False',
  '解答解析說明': 'Explanation',
  '說明為何此選項為正確答案...': 'Explain why this answer is correct...',
  '答對金幣獎勵': 'Coin reward',
  '答案正確無誤。': 'Correct.',
  '取消': 'Cancel',
  '確認儲存題目': 'Save question',
  '領主戰績與成就記錄': 'Commander Statistics & Achievements',
  '領地佔領數': 'Territories captured',
  '累積獲得金幣': 'Total coins earned',
  '總答題正確率': 'Answer accuracy',
  '最高連續答對': 'Best streak',
  '各領域答題數據分析': 'Performance by category',
  '錯誤清單': 'Incorrect answers',
  '保留最近 10 筆': 'Keep latest 10',
  '清除全部': 'Clear all',
  '目前沒有答錯紀錄': 'No incorrect answers yet.',
  '答錯': 'Incorrect',
  '你的答案：': 'Your answer: ',
  '正確答案：': 'Correct answer: ',
  '戰略勳章與成就': 'Medals & Achievements',
  '遊戲進度自動儲存於瀏覽器 LocalStorage': 'Game progress is saved in your browser.',
  '重設遊戲存檔': 'Reset game',
  '確定重設？進度將無法復原': 'Reset the game? This cannot be undone.',
  '確認清除': 'Confirm reset',
  '成功佔領首塊新領地': 'Capture your first new territory',
  '達成連續答對 5 題 (Combo x5)': 'Answer 5 questions correctly in a row (Combo x5)',
  '將領地擴張至 5 塊土地': 'Expand your territory to 5 hexes',
  '累積獲取超過 1,000 金幣': 'Earn over 1,000 coins',
  '累計回答 30 道題目': 'Answer 30 questions',
  '啟蒙征途': 'First Conquest',
  '連環妙答': 'Perfect Streak',
  '王國崛起': 'Rising Kingdom',
  '黃金國度': 'Golden Empire',
  '博學賢者': 'Wise Scholar',
  '變數運算': 'Variables',
  '迴圈': 'Loops',
  '條件式': 'Conditionals',
  '輸出輸入': 'Input & Output',
  '字串': 'Strings',
  '函式': 'Functions',
  '清單': 'Lists',
  '基礎': 'Beginner',
  '進階': 'Intermediate',
  '挑戰': 'Challenging',
  '精通': 'Advanced',
  '大師': 'Expert',
  '回答正確！': 'Correct!',
  '回答錯誤。正確解答：': 'Incorrect. Correct answer: ',
  '題': ' questions',
  '「知識領主」作戰與經營指南': 'Knowledge Conquest: Strategy Guide',
  '1. 六角戰略地圖與相鄰攻佔規則': '1. Hex Strategy Map & Adjacency Rules',
  '2. 2D 即時無人機彈幕戰鬥': '2. Real-Time Drone Combat',
  '3. 領地建設與實質效果': '3. Territory Facilities & Effects',
  '我明白了，開始征戰！': 'Got it. Let’s conquer!',
  '金幣工廠': 'Coin Factory',
  '防禦砲塔': 'Defense Turret',
  '能量護盾': 'Energy Shield',
  '知識研究所': 'Knowledge Institute',
  '每 5 秒自動產生金幣，等級越高金幣收入越龐大。': 'Automatically generates coins every 5 seconds. Higher levels earn more.',
  '戰鬥時自動對敵方無人機進行重砲火力支援。': 'Automatically provides heavy-fire support against enemy drones.',
  '在戰鬥開局提供額外藍色吸收護盾，降低失誤損耗。': 'Provides an additional shield at the start of battle to reduce damage.',
  '大幅提升答題所獲金幣，並強化連擊倍率獎勵。': 'Increases coin rewards for correct answers and boosts streak bonuses.',
  '相鄰限制：': 'Adjacency rule: ',
  '為了維持戰線推進邏輯，您只能攻佔與己方已擁有領地「緊鄰」的土地（地圖上帶有金黃色虛線脈衝框）。': 'You can only capture territories adjacent to your own (marked with a pulsing gold outline).',
  '敵方攻擊：': 'Enemy attacks: ',
  '頂端倒數每 100 秒發動一次；敵軍會從己方領地出發攻擊相鄰的中立或玩家領地。中立地會直接易主；若遭攻擊的是我方領地，答對防守題可擊退敵軍，答錯則失去該領地。任何一方發動攻擊後，倒數都會重新計時。': 'An enemy attack begins when the top timer expires. Enemies attack adjacent neutral or player territories. Neutral territories change hands immediately; answer a defense question correctly to repel attacks on your territory, or lose it. The timer resets after either side attacks.',
  '您初始擁有中心首府【智者衛城】。地圖上散佈著中立領地以及赤紅軍團、暗影公會等 AI 勢力。': 'You begin with the central capital, Sage Citadel. Neutral territories and AI factions such as the Crimson Legion are scattered across the map.',
  '進入戰鬥後，防守無人機將會根據其等級定期發射電漿攻擊彈。': 'In battle, the defending drone periodically fires plasma projectiles based on its level.',
  '操作閃避：': 'Dodge: ',
  '使用鍵盤': 'Use ',
  '或': 'or',
  '（或螢幕左右觸控鍵）靈活移動戰機，閃避下墜攻擊彈。': ' (or the on-screen controls) to move your ship and dodge incoming attacks.',
  '答題反擊：': 'Counterattack: ',
  '戰機本身不發射普通子彈，每一次答對題目都會立即發射一枚【追蹤導彈】，命中將削弱敵機生命值。': 'Your ship does not fire regular bullets. Each correct answer launches a homing missile that damages the enemy drone.',
  '答錯風險：': 'Wrong answers: ',
  '答錯不會發射導彈，敵機依然會持續攻擊，需立即集中精神面對下一題！': 'An incorrect answer will not launch a missile, while the enemy continues attacking. Focus on the next question!',
  '成功佔領領地後，每塊土地只能選擇建設 1 種設施；建成後可持續升級至最高 Lv.5：': 'After capturing a territory, build one facility on it and upgrade it to level 5.',
  '智者衛城 (首府)': 'Sage Citadel (Capital)',
  '青苔林野': 'Mosswood',
  '鐵砂礦脈': 'Iron Sand Mine',
  '智慧聖所': 'Sanctuary of Wisdom',
  '微風丘陵': 'Breezy Highlands',
  '石英峽谷': 'Quartz Canyon',
  '朝陽草原': 'Sunrise Prairie',
  '赤紅先鋒哨站': 'Crimson Vanguard Outpost',
  '硫磺裂谷': 'Sulfur Rift',
  '赤紅核心城塞': 'Crimson Core Citadel',
  '高能電晶平原': 'High-Energy Crystal Plains',
  '星象古天文臺': 'Ancient Observatory',
  '迷霧沼澤': 'Misty Marsh',
  '赤紅巡守站': 'Crimson Watchpost',
  '鐵砂礦脈東區': 'Eastern Iron Sand Mine',
  '赤紅先遣堡壘': 'Crimson Forward Fortress',
  '黃沙古隘道': 'Old Sandstone Pass',
  '泰坦之門': 'Titan’s Gate',
  '荒原綠洲邊界': 'Wasteland Oasis Border',
  '烈焰熔爐要塞': 'Flameforge Fortress',
  '先祖知識聖殿': 'Ancestral Temple of Knowledge',
  '熔岩熱能工廠': 'Lava Thermal Plant',
  '赤曜魔王殿': 'Crimson Demon King’s Hall',
  '天空之城遺址': 'Sky City Ruins',
  '赤帝王座': 'Crimson Emperor’s Throne',
  '神聖知識樞紐': 'Sacred Knowledge Hub',
  '玩家領地 (綠草地)': 'Player Territory (Grassland)',
  '中立領地 (黃沙地)': 'Neutral Territory (Sand)',
  '赤紅軍團 (赤熔岩)': 'Crimson Legion (Lava)',
  '偵察巡邏無人機 (Lv.1)': 'Scout Drone (Lv.1)',
  '輕型戰術無人機 (Lv.2)': 'Light Tactical Drone (Lv.2)',
  '突擊防禦無人機 (Lv.3)': 'Assault Defense Drone (Lv.3)',
  '重裝要塞無人機 (Lv.4)': 'Heavy Fortress Drone (Lv.4)',
  '先鋒霸主戰略無人機 (Lv.5)': 'Vanguard Overlord Drone (Lv.5)',
  '敵防守無人機': 'Enemy Defense Drone',
  '戰場提示：': 'Battle tip: ',
  '探索領地': 'Explore territory',
  '每 5 秒自動產出 +8 金幣': 'Generates +8 coins every 5 seconds',
  '玩家領地': 'Player Territory',
  '中立領地': 'Neutral Territory',
  '領地金幣週期產出': 'Territory coin income',
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      return localStorage.getItem('knowledge_conquest_language') === 'en' ? 'en' : 'zh';
    } catch (error) {
      console.error('Failed to load language preference', error);
      return 'zh';
    }
  });

  useEffect(() => {
    document.documentElement.lang = language === 'en' ? 'en' : 'zh-Hant';
  }, [language]);

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    try {
      localStorage.setItem('knowledge_conquest_language', nextLanguage);
    } catch (error) {
      console.error('Failed to save language preference', error);
    }
  };

  const t = (chinese: string) => language === 'en' ? translations[chinese] ?? chinese : chinese;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
