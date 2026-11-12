import { Question, QuestionCategory } from '../types/game';

export const CATEGORY_LABELS: Record<QuestionCategory, { name: string; color: string; badge: string }> = {
  variable: { name: '變數運算', color: 'text-amber-400', badge: 'bg-amber-950/40 border-amber-500/30 text-amber-300' },
  loop: { name: '迴圈', color: 'text-emerald-400', badge: 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' },
  ifelse: { name: '條件式', color: 'text-cyan-400', badge: 'bg-cyan-950/40 border-cyan-500/30 text-cyan-300' },
  inout: { name: '輸出輸入', color: 'text-indigo-400', badge: 'bg-indigo-950/40 border-indigo-500/30 text-indigo-300' },
  str: { name: '字串', color: 'text-rose-400', badge: 'bg-rose-950/40 border-rose-500/30 text-rose-300' },
  func: { name: '函式', color: 'text-rose-400', badge: 'bg-rose-950/40 border-rose-500/30 text-rose-300' }
};

export const DIFFICULTY_LABELS: Record<number, { name: string; stars: string }> = {
  1: { name: '基礎', stars: '★☆☆☆☆' },
  2: { name: '進階', stars: '★★☆☆☆' },
  3: { name: '挑戰', stars: '★★★☆☆' },
  4: { name: '精通', stars: '★★★★☆' },
  5: { name: '大師', stars: '★★★★★' },
};

const createQuestion = (
  id: string,
  category: QuestionCategory,
  difficulty: number,
  question: string,
  options: string[],
  correctAnswer: number,
  explanation: string,
  code = ''
): Question => ({
  id,
  category,
  difficulty,
  type: 'single',
  question,
  code,
  options,
  correctAnswer,
  explanation,
  reward: 20 + difficulty * 10,
});

export const DEFAULT_QUESTIONS: Question[] = [
  // 變數運算
  createQuestion('variable_01', 'variable', 1, '執行下方程式碼後，x 的值是多少？', ['5', '"5"', 'x', '未定義'], 0, '等號將右側的整數 5 指派給變數 x。', `x = 5`),
  createQuestion('variable_02', 'variable', 1, 'Python 中，哪個符號用來將值指派給變數？', ['==', '=', ':', '->'], 1, '單一等號 = 是指派運算子；== 用於比較是否相等。'),
  createQuestion('variable_03', 'variable', 1, '以下哪個是合法的 Python 變數名稱？', ['2score', 'user-name', 'user_name', 'class'], 2, '變數名稱不能以數字開頭，也不能使用連字號或保留字。'),
  createQuestion('variable_04', 'variable', 1, '執行下方程式碼後，會得到什麼？', ['5', '9', '72', '14'], 1, '加法運算 7 + 2 的結果是 9。', `a = 7
b = 2
print(a + b)`),
  createQuestion('variable_05', 'variable', 2, '執行下方程式碼後，會輸出什麼？', ['3.33', '3', '1', '4'], 1, '// 是整數除法，會捨去小數部分，因此結果是 3。', `print(10 // 3)`),
  createQuestion('variable_06', 'variable', 2, '執行下方程式碼後，會輸出什麼？', ['3', '1', '0', '3.33'], 1, '% 會取得除法的餘數，10 除以 3 餘 1。', `print(10 % 3)`),
  createQuestion('variable_07', 'variable', 2, '執行下方程式碼後，x 的值是多少？', ['1', '4', '7', '12'], 2, 'x += 3 等同於 x = x + 3，因此 x 變成 7。', `x = 4
x += 3`),
  createQuestion('variable_08', 'variable', 2, '以下哪個值的資料型別是 float？', ['8', '"8.0"', '8.0', 'True'], 2, '含有小數點的數值 8.0 是浮點數（float）。'),
  createQuestion('variable_09', 'variable', 2, '執行下方程式碼後，會輸出什麼？', ['int', 'str', 'bool', 'boolean'], 2, 'True 是布林值，其型別名稱是 bool。', `print(type(True).__name__)`),
  createQuestion('variable_10', 'variable', 2, '執行下方程式碼後，會輸出什麼？', ['2 5', '5 2', '(2, 5)', '錯誤'], 0, '多重指派會依序將 2 指派給 x、5 指派給 y，print 預設以空格分隔。', `x, y = 2, 5
print(x, y)`),

  // 迴圈
  createQuestion('loop_01', 'loop', 1, '下方程式碼中的 i 會依序取哪些值？', ['1、2、3', '0、1、2', '0、1、2、3', '3、2、1'], 1, 'range(3) 從 0 開始，到 3 之前停止，因此是 0、1、2。', `for i in range(3):
    print(i)`),
  createQuestion('loop_02', 'loop', 1, '執行下方程式碼後，會印出什麼？', ['0、1、2、3', '1、2、3', '1、2、4', '2、3、4'], 1, 'range(1, 4) 包含起點 1，但不包含終點 4。', `for i in range(1, 4):
    print(i)`),
  createQuestion('loop_03', 'loop', 1, '以下哪個關鍵字常用來重複執行一段程式？', ['repeat', 'loop', 'for', 'again'], 2, 'Python 使用 for 或 while 迴圈重複執行程式。'),
  createQuestion('loop_04', 'loop', 1, '執行下方程式碼後，Hi 會印出幾次？', ['3 次', '4 次', '5 次', '無限次'], 1, 'range(4) 會產生 4 個值，所以迴圈執行 4 次。', `for _ in range(4):
    print("Hi")`),
  createQuestion('loop_05', 'loop', 2, '執行下方程式碼後，total 的值是多少？', ['3', '6', '10', '4'], 1, '迴圈將 1、2、3 加總，結果為 6。', `total = 0
for n in range(1, 4):
    total += n`),
  createQuestion('loop_06', 'loop', 2, 'while 迴圈會在什麼時候繼續執行？', ['條件為 True 時', '條件為 False 時', '只執行一次', '遇到變數時'], 0, 'while 會在條件判斷結果為 True 時持續執行。'),
  createQuestion('loop_07', 'loop', 2, '在迴圈中，break 的作用是什麼？', ['跳過本次迴圈', '立即結束整個迴圈', '重新開始程式', '暫停一秒'], 1, 'break 會直接離開目前所在的迴圈。'),
  createQuestion('loop_08', 'loop', 2, '在迴圈中，continue 的作用是什麼？', ['結束整個程式', '離開函式', '跳過本次迴圈剩餘部分並進入下一次', '讓迴圈永遠停止'], 2, 'continue 跳過目前這一輪後，繼續下一輪迴圈。'),
  createQuestion('loop_09', 'loop', 2, '執行下方程式碼後，會印出什麼？', ['2、4、6', '2、4、6、8', '1、3、5、7', '2、8'], 0, 'range(起點, 終點, 間隔) 每次增加 2，且不包含終點 8。', `for i in range(2, 8, 2):
    print(i)`),
  createQuestion('loop_10', 'loop', 2, '執行下方程式碼時，可能發生什麼？', ['迴圈只執行一次', '程式進入無限迴圈', 'x 自動變成 5', 'Python 自動跳出迴圈'], 1, 'x 一直是 1，條件持續為 True，因此迴圈不會自行結束。', `x = 1
while x < 5:
    print(x)`),

  // 條件式
  createQuestion('ifelse_01', 'ifelse', 1, 'Python 使用哪個關鍵字開始條件判斷？', ['when', 'if', 'check', 'case'], 1, 'Python 使用 if 後接條件來開始條件判斷。'),
  createQuestion('ifelse_02', 'ifelse', 1, '執行下方程式碼後，會得到什麼？', ['True', 'False', '3', '2'], 0, '3 大於 2，因此比較結果是 True。', `print(3 > 2)`),
  createQuestion('ifelse_03', 'ifelse', 1, 'if 條件不成立時，最常用哪個關鍵字提供另一條路徑？', ['otherwise', 'else', 'then', 'elif'], 1, 'else 用來處理前面的 if 條件不成立時的情況。'),
  createQuestion('ifelse_04', 'ifelse', 1, '以下哪個運算子表示「不等於」？', ['=', '==', '!=', '<>'], 2, 'Python 使用 != 判斷兩個值是否不相等。'),
  createQuestion('ifelse_05', 'ifelse', 2, '執行下方程式碼後，會得到什麼？', ['True', 'False', '80', '錯誤'], 0, '80 大於或等於 60，所以條件成立。', `score = 80
print(score >= 60)`),
  createQuestion('ifelse_06', 'ifelse', 2, 'Python 中，elif 的用途是什麼？', ['結束 if 區塊', '新增另一個條件分支', '重複執行條件', '宣告函式'], 1, 'elif 是「else if」的縮寫，可在 if 與 else 之間檢查其他條件。'),
  createQuestion('ifelse_07', 'ifelse', 2, '執行下方程式碼後，會輸出什麼？', ['True', 'False', 'None', '錯誤'], 1, 'and 需要左右兩側都為 True，結果才是 True。', `print(True and False)`),
  createQuestion('ifelse_08', 'ifelse', 2, '執行下方程式碼後，會輸出什麼？', ['True', 'False', 'None', '錯誤'], 0, 'or 只要其中一側為 True，結果就是 True。', `print(True or False)`),
  createQuestion('ifelse_09', 'ifelse', 2, '執行下方程式碼後，會輸出什麼？', ['True', 'False', '4', '0'], 0, '若 x 是 2 的倍數，條件成立並輸出 True；否則輸出 False。', `x = 4
print(x % 2 == 0)`),
  createQuestion('ifelse_10', 'ifelse', 2, 'Python 如何標示 if 區塊內的程式？', ['用大括號包起來', '在每行前加分號', '使用縮排', '使用 begin 和 end'], 2, 'Python 以一致的縮排表示程式區塊。'),

  // 輸出輸入
  createQuestion('inout_01', 'inout', 1, 'Python 中，哪個函式可將文字顯示在螢幕上？', ['show()', 'echo()', 'print()', 'write_line()'], 2, 'print() 會將指定內容輸出到螢幕。'),
  createQuestion('inout_02', 'inout', 1, 'Python 中，哪個函式可讀取使用者輸入？', ['scan()', 'input()', 'read_key()', 'get()'], 1, 'input() 會讀取使用者輸入的一行文字。'),
  createQuestion('inout_03', 'inout', 1, '執行下方程式碼後，會顯示什麼？', ['"Hello"', 'Hello', 'print Hello', '不會顯示'], 1, 'print() 輸出字串內容，不會顯示包住字串的引號。', `print("Hello")`),
  createQuestion('inout_04', 'inout', 1, 'input() 傳回的資料預設是哪一種型別？', ['int', 'float', 'str', 'bool'], 2, '即使輸入看起來像數字，input() 預設仍傳回字串。'),
  createQuestion('inout_05', 'inout', 2, '若要將使用者輸入轉成整數，應使用哪種寫法？', ['input(int)', 'int(input())', 'str(input())', 'integer(input())'], 1, 'int() 可將可轉換的輸入字串轉為整數。'),
  createQuestion('inout_06', 'inout', 2, '執行下方程式碼後，會輸出什麼？', ['AB', 'A B', 'A,B', '["A", "B"]'], 1, 'print() 預設使用空格分隔多個輸出值。', `print("A", "B")`),
  createQuestion('inout_07', 'inout', 2, 'print() 中的 sep 參數可以做什麼？', ['設定輸出值之間的分隔字串', '設定輸入資料型別', '隱藏輸出', '設定迴圈次數'], 0, 'sep 用來指定 print() 輸出多個值時使用的分隔內容。'),
  createQuestion('inout_08', 'inout', 2, 'print() 中的 end 參數預設是什麼？', ['空字串', '空格', '換行字元', '逗號'], 2, 'print() 預設在輸出結尾加上換行字元。'),
  createQuestion('inout_09', 'inout', 2, '執行下方程式碼後，會顯示什麼？', ['年齡：12', '年齡： 12', '"年齡：", "12"', '錯誤'], 1, 'print() 預設在兩個輸出值之間插入一個空格。', `print("年齡：", 12)`),
  createQuestion('inout_10', 'inout', 2, '要讓輸入提示顯示「請輸入姓名：」，正確寫法是哪個？', ['input("請輸入姓名：")', 'print.input("請輸入姓名：")', 'read("請輸入姓名：")', 'prompt = input'], 0, 'input() 可接受提示字串，並在等待輸入時顯示它。'),

  // 字串
  createQuestion('str_01', 'str', 1, '以下哪個是 Python 字串？', ['hello', '"hello"', 'True', '42'], 1, '字串需要使用單引號或雙引號括起來。'),
  createQuestion('str_02', 'str', 1, '執行下方程式碼後，會輸出什麼？', ['Py thon', 'Python', 'Py+thon', '錯誤'], 1, '字串使用 + 會串接在一起。', `print("Py" + "thon")`),
  createQuestion('str_03', 'str', 1, '執行下方程式碼後，會輸出什麼？', ['2', '3', '4', 'cat'], 1, 'len() 會回傳字串長度；"cat" 有 3 個字元。', `print(len("cat"))`),
  createQuestion('str_04', 'str', 1, 'Python 字串的第一個字元索引值是多少？', ['0', '1', '-1', '依字串而定'], 0, 'Python 使用從 0 開始的索引，因此第一個字元索引是 0。'),
  createQuestion('str_05', 'str', 2, '執行下方程式碼後，會輸出什麼？', ['P', 'y', 'n', 'Python'], 0, '索引 0 代表字串中的第一個字元 P。', `print("Python"[0])`),
  createQuestion('str_06', 'str', 2, '執行下方程式碼後，會輸出什麼？', ['hello', 'Hello', 'HELLO', '錯誤'], 2, 'upper() 會回傳所有英文字母轉成大寫的字串。', `print("hello".upper())`),
  createQuestion('str_07', 'str', 2, '執行下方程式碼後，會輸出什麼？', ['  hi  ', 'hi', 'HI', 'h i'], 1, 'strip() 會移除字串左右兩側的空白字元。', `print("  hi  ".strip())`),
  createQuestion('str_08', 'str', 2, '執行下方程式碼後，會輸出什麼？', ['banana', 'bonono', 'bonana', 'banono'], 1, 'replace() 會將所有符合的 a 替換成 o，結果是 bonono。', `print("banana".replace("a", "o"))`),
  createQuestion('str_09', 'str', 2, '執行下方程式碼後，會輸出什麼？', ['abc', 'bcd', 'bcde', 'cde'], 1, '切片包含起始索引 1，但不包含結束索引 4，因此結果是 bcd。', `print("abcdef"[1:4])`),
  createQuestion('str_10', 'str', 2, '下列哪個 f-string 寫法會將變數 name 的值放入字串？', ['f"你好，{name}"', '"你好，(name)"', 'f"你好，name"', 'format f"你好，name"'], 0, 'f-string 在字串前加 f，並以大括號放入變數或運算式。'),

  // 函式
  createQuestion('func_01', 'func', 1, 'Python 中，哪個關鍵字用來定義函式？', ['function', 'def', 'fun', 'define'], 1, 'Python 使用 def 關鍵字定義函式。'),
  createQuestion('func_02', 'func', 1, '如何呼叫名稱為 greet 的函式？', ['call greet', 'greet()', 'def greet', 'run(greet)'], 1, '在函式名稱後加上括號即可呼叫函式。'),
  createQuestion('func_03', 'func', 1, '函式中的參數通常用來做什麼？', ['接收呼叫函式時傳入的資料', '停止程式', '重複執行函式', '輸出錯誤訊息'], 0, '參數讓函式能接收外部傳入的資料並在函式內使用。'),
  createQuestion('func_04', 'func', 1, '函式中的 return 通常用來做什麼？', ['定義變數', '回傳結果並結束函式執行', '重複呼叫函式', '顯示文字'], 1, 'return 將結果傳回呼叫處，並結束目前函式的執行。'),
  createQuestion('func_05', 'func', 2, '執行下方程式碼後，會得到什麼？', ['23', '5', 'add', 'None'], 1, '函式將兩個整數相加並回傳 5。', `def add(a, b):
    return a + b

print(add(2, 3))`),
  createQuestion('func_06', 'func', 2, '若函式沒有明確執行 return，預設會回傳什麼？', ['0', 'False', 'None', '空字串'], 2, '沒有 return 值的函式會隱含回傳 None。'),
  createQuestion('func_07', 'func', 2, '函式定義中的預設參數值會在什麼時候使用？', ['每次都覆蓋傳入值', '呼叫時未提供該引數', '函式定義之前', '只在迴圈中'], 1, '只有呼叫時省略該引數，才會使用預設值。'),
  createQuestion('func_08', 'func', 2, '執行下方程式碼後，會顯示什麼？', ['Hi', 'Hi Amy', 'Amy Hi', 'name Amy'], 1, '呼叫時將 "Amy" 傳給 name，print() 會以空格分隔輸出。', `def greet(name):
    print("Hi", name)

greet("Amy")`),
  createQuestion('func_09', 'func', 2, '以下哪個函式呼叫使用關鍵字引數？', ['power(2, 3)', 'power(base=2, exponent=3)', 'power()', 'def power(2, 3)'], 1, '關鍵字引數以參數名稱加等號指定對應的值。'),
  createQuestion('func_10', 'func', 2, '函式的區域變數通常可以在哪裡直接使用？', ['整個程式的任何地方', '只在定義它的函式內', '只在其他模組中', '只能在 if 區塊內'], 1, '區域變數的作用範圍通常限於定義它的函式內。'),
];

const LOCAL_STORAGE_CUSTOM_QUESTIONS_KEY = 'knowledge_conquest_custom_questions_v1';

export function getCustomQuestions(): Question[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_QUESTIONS_KEY);
    if (!raw) return [];
    const questions = JSON.parse(raw) as Question[];
    return questions.map((question) => ({
      ...question,
      code: typeof question.code === 'string' ? question.code : '',
    }));
  } catch (e) {
    console.error('Failed to load custom questions from localStorage', e);
    return [];
  }
}

export function saveCustomQuestion(q: Question): Question[] {
  const current = getCustomQuestions();
  const existingIdx = current.findIndex((item) => item.id === q.id);
  let updated: Question[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = q;
  } else {
    updated = [q, ...current];
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_QUESTIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save question', e);
  }
  return updated;
}

export function deleteCustomQuestion(id: string): Question[] {
  const current = getCustomQuestions();
  const updated = current.filter((q) => q.id !== id);
  try {
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_QUESTIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete question', e);
  }
  return updated;
}

export function getAllQuestions(): Question[] {
  return [...DEFAULT_QUESTIONS, ...getCustomQuestions()];
}

type QuestionVariant = Pick<
  Question,
  'question' | 'code' | 'options' | 'correctAnswer' | 'explanation'
>;

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomItem = <T,>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

const createVariant = (
  question: string,
  code: string,
  answer: string,
  distractors: string[],
  explanation: string
): QuestionVariant => {
  const options = Array.from(new Set([answer, ...distractors]));
  while (options.length < 4) options.push(`其他答案 ${options.length - 2}`);
  options.length = 4;

  for (let i = options.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [options[i], options[j]] = [options[j], options[i]];
  }

  return {
    question,
    code,
    options,
    correctAnswer: options.indexOf(answer),
    explanation,
  };
};

const outputQuestion = '執行下方程式碼後，會輸出什麼？';

const QUESTION_GENERATORS: Partial<Record<string, () => QuestionVariant>> = {
  variable_01: () => {
    const x = randomInt(1, 100);
    return createVariant(
      '執行下方程式碼後，x 的值是多少？',
      `x = ${x}`,
      String(x),
      [`"${x}"`, String(x + 1), '未定義'],
      `指派運算子 = 將整數 ${x} 指派給變數 x。`
    );
  },
  variable_04: () => {
    const a = randomInt(1, 20);
    const b = randomInt(1, 20);
    const answer = a + b;
    return createVariant(
      outputQuestion,
      `a = ${a}\nb = ${b}\nprint(a + b)`,
      String(answer),
      [String(a * b), String(Math.abs(a - b)), `${a}${b}`],
      `程式將 a 和 b 相加：${a} + ${b} = ${answer}。`
    );
  },
  variable_05: () => {
    const divisor = randomInt(2, 9);
    const dividend = randomInt(10, 99);
    const answer = Math.floor(dividend / divisor);
    return createVariant(
      outputQuestion,
      `print(${dividend} // ${divisor})`,
      String(answer),
      [String(answer + 1), String(dividend % divisor), `${(dividend / divisor).toFixed(2)}`],
      `// 會捨去小數部分；${dividend} // ${divisor} 的結果是 ${answer}。`
    );
  },
  variable_06: () => {
    const dividend = randomInt(10, 99);
    const divisor = randomInt(2, 9);
    const answer = dividend % divisor;
    return createVariant(
      outputQuestion,
      `print(${dividend} % ${divisor})`,
      String(answer),
      [String(divisor), String(Math.floor(dividend / divisor)), String(answer + 1)],
      `${dividend} 除以 ${divisor} 的餘數是 ${answer}。`
    );
  },
  variable_07: () => {
    const x = randomInt(1, 20);
    const increment = randomInt(1, 10);
    const answer = x + increment;
    return createVariant(
      '執行下方程式碼後，x 的值是多少？',
      `x = ${x}\nx += ${increment}`,
      String(answer),
      [String(x), String(x * increment), String(answer + 1)],
      `x += ${increment} 等同於 x = x + ${increment}，所以 x 變成 ${answer}。`
    );
  },
  variable_10: () => {
    const x = randomInt(1, 9);
    const y = randomInt(10, 20);
    return createVariant(
      outputQuestion,
      `x, y = ${x}, ${y}\nprint(x, y)`,
      `${x} ${y}`,
      [`${y} ${x}`, `(${x}, ${y})`, `${x}, ${y}`],
      `多重指派依序將 ${x} 指派給 x、${y} 指派給 y；print() 預設以空格分隔。`
    );
  },
  loop_01: () => {
    const stop = randomInt(2, 8);
    const answer = Array.from({ length: stop }, (_, i) => i).join('、');
    return createVariant(
      '下方程式碼中的 i 會依序取哪些值？',
      `for i in range(${stop}):\n    print(i)`,
      answer,
      [
        Array.from({ length: stop }, (_, i) => i + 1).join('、'),
        Array.from({ length: stop + 1 }, (_, i) => i).join('、'),
        Array.from({ length: stop }, (_, i) => stop - i - 1).join('、'),
      ],
      `range(${stop}) 從 0 開始，到 ${stop} 之前停止。`
    );
  },
  loop_02: () => {
    const start = randomInt(1, 5);
    const stop = start + randomInt(2, 5);
    const values = Array.from({ length: stop - start }, (_, i) => start + i);
    const answer = values.join('、');
    return createVariant(
      outputQuestion,
      `for i in range(${start}, ${stop}):\n    print(i)`,
      answer,
      [
        [...values, stop].join('、'),
        Array.from({ length: stop - start }, (_, i) => start - 1 + i).join('、'),
        [...values].reverse().join('、'),
      ],
      `range(${start}, ${stop}) 包含起點 ${start}，但不包含終點 ${stop}。`
    );
  },
  loop_04: () => {
    const count = randomInt(2, 8);
    return createVariant(
      '執行下方程式碼後，Hi 會印出幾次？',
      `for _ in range(${count}):\n    print("Hi")`,
      `${count} 次`,
      [`${count - 1} 次`, `${count + 1} 次`, '無限次'],
      `range(${count}) 會產生 ${count} 個值，因此迴圈執行 ${count} 次。`
    );
  },
  loop_05: () => {
    const start = randomInt(1, 4);
    const stop = start + randomInt(2, 5);
    const answer = Array.from({ length: stop - start }, (_, i) => start + i)
      .reduce((sum, value) => sum + value, 0);
    return createVariant(
      '執行下方程式碼後，total 的值是多少？',
      `total = 0\nfor n in range(${start}, ${stop}):\n    total += n`,
      String(answer),
      [String(answer - 1), String(answer + 1), String(answer + stop)],
      `迴圈將 ${start} 到 ${stop - 1} 加總，結果為 ${answer}。`
    );
  },
  loop_09: () => {
    const start = randomInt(1, 5);
    const step = randomInt(2, 4);
    const count = randomInt(2, 4);
    const stop = start + step * count;
    const values = Array.from({ length: count }, (_, i) => start + step * i);
    return createVariant(
      outputQuestion,
      `for i in range(${start}, ${stop}, ${step}):\n    print(i)`,
      values.join('、'),
      [
        [...values, stop].join('、'),
        values.map((value) => value + 1).join('、'),
        values.slice(1).join('、'),
      ],
      `range() 從 ${start} 開始，每次增加 ${step}，並在 ${stop} 之前停止。`
    );
  },
  loop_10: () => {
    const x = randomInt(1, 5);
    const limit = x + randomInt(1, 4);
    return createVariant(
      '執行下方程式碼時，可能發生什麼？',
      `x = ${x}\nwhile x < ${limit}:\n    print(x)`,
      '程式進入無限迴圈',
      ['迴圈只執行一次', `x 自動變成 ${limit}`, 'Python 自動跳出迴圈'],
      `x 初始值為 ${x}，小於 ${limit}，而迴圈內沒有改變 x，因此條件一直成立。`
    );
  },
  ifelse_02: () => {
    const a = randomInt(1, 100);
    const b = randomInt(1, 100);
    const answer = a > b ? 'True' : 'False';
    return createVariant(
      outputQuestion,
      `print(${a} > ${b})`,
      answer,
      [answer === 'True' ? 'False' : 'True', String(a), String(b)],
      `${a} ${a > b ? '大於' : '不大於'} ${b}，比較結果是 ${answer}。`
    );
  },
  ifelse_05: () => {
    const score = randomInt(40, 100);
    const passingScore = randomInt(50, 80);
    const answer = score >= passingScore ? 'True' : 'False';
    return createVariant(
      outputQuestion,
      `score = ${score}\nprint(score >= ${passingScore})`,
      answer,
      [answer === 'True' ? 'False' : 'True', String(score), String(passingScore)],
      `${score} ${score >= passingScore ? '大於或等於' : '小於'} ${passingScore}，條件結果是 ${answer}。`
    );
  },
  ifelse_07: () => {
    const left = Math.random() < 0.5;
    const right = Math.random() < 0.5;
    const answer = left && right ? 'True' : 'False';
    return createVariant(
      outputQuestion,
      `print(${left ? 'True' : 'False'} and ${right ? 'True' : 'False'})`,
      answer,
      [answer === 'True' ? 'False' : 'True', 'None', '錯誤'],
      `and 需要左右兩側都為 True；本題結果是 ${answer}。`
    );
  },
  ifelse_08: () => {
    const left = Math.random() < 0.5;
    const right = Math.random() < 0.5;
    const answer = left || right ? 'True' : 'False';
    return createVariant(
      outputQuestion,
      `print(${left ? 'True' : 'False'} or ${right ? 'True' : 'False'})`,
      answer,
      [answer === 'True' ? 'False' : 'True', 'None', '錯誤'],
      `or 只要其中一側為 True，結果就是 True；本題結果是 ${answer}。`
    );
  },
  ifelse_09: () => {
    const x = randomInt(1, 100);
    const answer = x % 2 === 0 ? 'True' : 'False';
    return createVariant(
      '執行下方 Python 程式碼後，螢幕上會印出什麼結果？',
      `x = ${x}\nprint(x % 2 == 0)`,
      answer,
      [answer === 'True' ? 'False' : 'True', String(x), '0'],
      `若 x 是 2 的倍數，條件成立並輸出 True；否則輸出 False。`
    );
  },
  inout_03: () => {
    const text = randomItem(['Hello', 'Python', 'Knowledge', 'Welcome']);
    return createVariant(
      outputQuestion,
      `print("${text}")`,
      text,
      [`"${text}"`, `print ${text}`, '不會顯示'],
      `print() 輸出字串內容，不會顯示包住字串的引號。`
    );
  },
  inout_06: () => {
    const [first, second] = randomItem([['A', 'B'], ['X', 'Y'], ['3', '7'], ['左', '右']]);
    return createVariant(
      outputQuestion,
      `print("${first}", "${second}")`,
      `${first} ${second}`,
      [`${first}${second}`, `${first},${second}`, `["${first}", "${second}"]`],
      'print() 預設使用空格分隔多個輸出值。'
    );
  },
  inout_09: () => {
    const age = randomInt(1, 99);
    return createVariant(
      outputQuestion,
      `print("年齡：", ${age})`,
      `年齡： ${age}`,
      [`年齡：${age}`, `"年齡：", "${age}"`, '錯誤'],
      'print() 預設會在兩個輸出值之間插入一個空格。'
    );
  },
  str_02: () => {
    const [first, second] = randomItem([['Py', 'thon'], ['sun', 'shine'], ['編', '程'], ['good', 'day']]);
    const answer = `${first}${second}`;
    return createVariant(
      outputQuestion,
      `print("${first}" + "${second}")`,
      answer,
      [`${first} ${second}`, `${first}+${second}`, `${second}${first}`],
      '字串使用 + 會串接在一起，不會自動加入空格。'
    );
  },
  str_03: () => {
    const word = randomItem(['cat', 'python', 'coding', 'knowledge', 'loop']);
    const answer = String(word.length);
    return createVariant(
      outputQuestion,
      `print(len("${word}"))`,
      answer,
      [String(word.length - 1), String(word.length + 1), word],
      `len() 會回傳字串長度；"${word}" 有 ${word.length} 個字元。`
    );
  },
  str_05: () => {
    const word = randomItem(['Python', 'coding', 'planet', 'string']);
    const index = randomInt(0, word.length - 1);
    const answer = word[index];
    return createVariant(
      outputQuestion,
      `print("${word}"[${index}])`,
      answer,
      [word[(index + 1) % word.length], word[(index + 2) % word.length], word],
      `索引 ${index} 代表字串中的第 ${index + 1} 個字元，因此結果是 ${answer}。`
    );
  },
  str_06: () => {
    const word = randomItem(['hello', 'python', 'coding', 'planet']);
    return createVariant(
      outputQuestion,
      `print("${word}".upper())`,
      word.toUpperCase(),
      [word, `${word[0].toUpperCase()}${word.slice(1)}`, '錯誤'],
      'upper() 會回傳所有英文字母轉成大寫的字串。'
    );
  },
  str_07: () => {
    const word = randomItem(['hi', 'code', 'hello', 'Python']);
    return createVariant(
      outputQuestion,
      `print("  ${word}  ".strip())`,
      word,
      [`  ${word}  `, word.toUpperCase(), `${word} `],
      'strip() 會移除字串左右兩側的空白字元。'
    );
  },
  str_08: () => {
    const [word, oldChar, newChar] = randomItem([
      ['banana', 'a', 'o'],
      ['pepper', 'e', 'a'],
      ['coconut', 'o', 'a'],
      ['mississippi', 'i', 'o'],
    ]);
    const answer = word.replaceAll(oldChar, newChar);
    return createVariant(
      outputQuestion,
      `print("${word}".replace("${oldChar}", "${newChar}"))`,
      answer,
      [word, word.replace(oldChar, newChar), word.toUpperCase()],
      `replace() 會將所有符合的 ${oldChar} 替換成 ${newChar}，結果是 ${answer}。`
    );
  },
  str_09: () => {
    const word = randomItem(['abcdefg', 'python3', 'computer', 'notebook']);
    const start = randomInt(1, 2);
    const end = randomInt(start + 2, Math.min(start + 4, word.length - 1));
    const answer = word.slice(start, end);
    return createVariant(
      outputQuestion,
      `print("${word}"[${start}:${end}])`,
      answer,
      [word.slice(start, end + 1), word.slice(start - 1, end), word],
      `切片包含起始索引 ${start}，但不包含結束索引 ${end}，因此結果是 ${answer}。`
    );
  },
  func_05: () => {
    const a = randomInt(1, 20);
    const b = randomInt(1, 20);
    const answer = String(a + b);
    return createVariant(
      outputQuestion,
      `def add(a, b):\n    return a + b\n\nprint(add(${a}, ${b}))`,
      answer,
      [`${a}${b}`, String(a * b), String(Math.abs(a - b))],
      `add() 回傳兩個整數的總和：${a} + ${b} = ${answer}。`
    );
  },
  func_08: () => {
    const name = randomItem(['Amy', 'Mia', 'Kai', 'Bo']);
    return createVariant(
      outputQuestion,
      `def greet(name):\n    print("Hi", name)\n\ngreet("${name}")`,
      `Hi ${name}`,
      ['Hi', name, `${name} Hi`],
      `呼叫 greet("${name}") 時，print() 以空格分隔 Hi 與參數，因此輸出 Hi ${name}。`
    );
  },
};

// Draw a random question matching criteria (difficulty, category if filtered)
export function getRandomQuestion(
  targetDifficulty?: number,
  category?: QuestionCategory,
  excludeId?: string
): Question {
  const all = getAllQuestions();
  let pool = all;

  if (targetDifficulty) {
    const diffPool = pool.filter((q) => Math.abs(q.difficulty - targetDifficulty) <= 1);
    if (diffPool.length > 0) pool = diffPool;
  }

  if (category) {
    const catPool = pool.filter((q) => q.category === category);
    if (catPool.length > 0) pool = catPool;
  }

  if (excludeId && pool.length > 1) {
    pool = pool.filter((q) => q.id !== excludeId);
  }

  const selected = pool[Math.floor(Math.random() * pool.length)];
  if (!selected) return DEFAULT_QUESTIONS[0];

  const generateVariant = QUESTION_GENERATORS[selected.id];
  return generateVariant ? { ...selected, ...generateVariant() } : selected;
}
