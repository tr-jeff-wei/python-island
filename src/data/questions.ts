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

const DEFAULT_QUESTIONS_ZH: Question[] = [
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
  createQuestion('loop_11', 'loop', 2, '執行下方程式碼後，會依序印出什麼？', ['0、1、0、3、0', '0、1、2、3、4', '1、0、3、0、5', '0、0、0、0、0'], 0, 'x 為偶數時印出 0，否則印出 x；range(5) 依序產生 0 到 4。', `for x in range(5):
    if x % 2 == 0:
        print(0)
    else:
        print(x)`),
  createQuestion('loop_12', 'loop', 2, '執行下方程式碼後，會依序印出什麼？', ['奇數、偶數、奇數、偶數、奇數', '偶數、奇數、偶數、奇數、偶數', '1、2、3、4、5', '奇數、奇數、奇數、奇數、奇數'], 0, '迴圈從 1 跑到 5，if-else 依照是否能被 2 整除，印出奇數或偶數。', `for x in range(1, 6):
    if x % 2 == 0:
        print("偶數")
    else:
        print("奇數")`),
  createQuestion('loop_13', 'loop', 3, '執行下方程式碼後，total 的值是多少？', ['3', '9', '-3', '15'], 0, '奇數加總為 1 + 3 + 5 = 9，偶數扣除 2 + 4，因此 total 為 3。', `total = 0
for x in range(1, 6):
    if x % 2 == 0:
        total -= x
    else:
        total += x`),

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
  createQuestion('ifelse_11', 'ifelse', 2, '執行下方程式碼後，會印出什麼？', ['通過', '不及格', '80', '沒有輸出'], 0, 'score 是 75，符合 score >= 60，因此執行第一個分支並印出「通過」。', `score = 75
if score >= 60:
    print("通過")
else:
    print("不及格")`),
  createQuestion('ifelse_12', 'ifelse', 2, '執行下方程式碼後，會印出什麼？', ['B', 'A', 'C', '不及格'], 0, 'score 為 75，先通過外層的及格判斷，再進入內層判斷；因為未達 80，所以印出 B。', `score = 75
if score >= 60:
    if score >= 80:
        print("A")
    else:
        print("B")
else:
    print("不及格")`),
  createQuestion('ifelse_13', 'ifelse', 3, '執行下方巢狀判斷後，會印出什麼？', ['正偶數', '正奇數', '非正數', '偶數'], 0, 'x 大於 0，因此進入外層 if；x 又能被 2 整除，所以內層判斷印出「正偶數」。', `x = 6
if x > 0:
    if x % 2 == 0:
        print("正偶數")
    else:
        print("正奇數")
else:
    print("非正數")`),
  createQuestion('ifelse_14', 'ifelse', 3, '執行下方程式碼後，會印出什麼？', ['可入場', '年齡未滿 18 歲', '需要門票', '沒有輸出'], 2, 'age 已滿 18 歲，因此進入外層 if；但 has_ticket 是 False，內層 else 會印出「需要門票」。', `age = 20
has_ticket = False
if age >= 18:
    if has_ticket:
        print("可入場")
    else:
        print("需要門票")
else:
    print("年齡未滿 18 歲")`),

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
  createQuestion('str_07', 'str', 2, '執行下方程式碼後，會輸出什麼？', ['"  hi  "', 'hi', 'HI', 'h i'], 1, 'strip() 會移除字串左右兩側的空白字元。', `print("  hi  ".strip())`),
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

const DEFAULT_QUESTION_TRANSLATIONS: Record<string, Pick<Question, 'questionEn' | 'optionsEn' | 'explanationEn'>> = {
  variable_01: { questionEn: 'After running the code below, what is the value of x?', optionsEn: ['5', '"5"', 'x', 'Undefined'], explanationEn: 'The assignment operator assigns the integer 5 on the right to the variable x.' },
  variable_02: { questionEn: 'Which symbol is used to assign a value to a variable in Python?', optionsEn: ['==', '=', ':', '->'], explanationEn: 'A single equals sign (=) is the assignment operator; == compares values for equality.' },
  variable_03: { questionEn: 'Which of these is a valid Python variable name?', optionsEn: ['2score', 'user-name', 'user_name', 'class'], explanationEn: 'Variable names cannot start with a digit, contain hyphens, or use reserved keywords.' },
  variable_04: { questionEn: 'What is the result after running the code below?', optionsEn: ['5', '9', '72', '14'], explanationEn: 'The result of 7 + 2 is 9.' },
  variable_05: { questionEn: 'What does the code below print?', optionsEn: ['3.33', '3', '1', '4'], explanationEn: '// performs integer division and discards the fractional part, so the result is 3.' },
  variable_06: { questionEn: 'What does the code below print?', optionsEn: ['3', '1', '0', '3.33'], explanationEn: '% returns the remainder. Dividing 10 by 3 leaves a remainder of 1.' },
  variable_07: { questionEn: 'After running the code below, what is the value of x?', optionsEn: ['1', '4', '7', '12'], explanationEn: 'x += 3 is equivalent to x = x + 3, so x becomes 7.' },
  variable_08: { questionEn: 'Which value has the float data type?', optionsEn: ['8', '"8.0"', '8.0', 'True'], explanationEn: 'The number 8.0, which includes a decimal point, is a floating-point number (float).' },
  variable_09: { questionEn: 'What does the code below print?', optionsEn: ['int', 'str', 'bool', 'boolean'], explanationEn: 'True is a Boolean value, and its type name is bool.' },
  variable_10: { questionEn: 'What does the code below print?', optionsEn: ['2 5', '5 2', '(2, 5)', 'Error'], explanationEn: 'Multiple assignment assigns 2 to x and 5 to y in order. print separates values with spaces by default.' },
  loop_01: { questionEn: 'Which values does i take in order in the code below?', optionsEn: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3', '3, 2, 1'], explanationEn: 'range(3) starts at 0 and stops before 3, so the values are 0, 1, and 2.' },
  loop_02: { questionEn: 'What does the code below print?', optionsEn: ['0, 1, 2, 3', '1, 2, 3', '1, 2, 4', '2, 3, 4'], explanationEn: 'range(1, 4) includes the starting value 1 but excludes the ending value 4.' },
  loop_03: { questionEn: 'Which keyword is commonly used to repeat a block of code?', optionsEn: ['repeat', 'loop', 'for', 'again'], explanationEn: 'Python uses for or while loops to repeat code.' },
  loop_04: { questionEn: 'How many times will “Hi” be printed by the code below?', optionsEn: ['3 times', '4 times', '5 times', 'Infinite times'], explanationEn: 'range(4) produces four values, so the loop runs four times.' },
  loop_05: { questionEn: 'After running the code below, what is the value of total?', optionsEn: ['3', '6', '10', '4'], explanationEn: 'The loop adds 1, 2, and 3, giving a total of 6.' },
  loop_06: { questionEn: 'When does a while loop continue running?', optionsEn: ['While the condition is True', 'While the condition is False', 'Only once', 'When it encounters a variable'], explanationEn: 'A while loop keeps running as long as its condition evaluates to True.' },
  loop_07: { questionEn: 'What does break do inside a loop?', optionsEn: ['Skips the current iteration', 'Immediately exits the loop', 'Restarts the program', 'Pauses for one second'], explanationEn: 'break exits the loop it is currently in.' },
  loop_08: { questionEn: 'What does continue do inside a loop?', optionsEn: ['Ends the entire program', 'Exits the function', 'Skips the rest of this iteration and starts the next one', 'Stops the loop forever'], explanationEn: 'continue skips the rest of the current iteration and proceeds to the next one.' },
  loop_09: { questionEn: 'What does the code below print?', optionsEn: ['2, 4, 6', '2, 4, 6, 8', '1, 3, 5, 7', '2, 8'], explanationEn: 'range(start, stop, step) increases by 2 and excludes the ending value 8.' },
  loop_10: { questionEn: 'What might happen when the code below runs?', optionsEn: ['The loop runs only once', 'The program enters an infinite loop', 'x automatically becomes 5', 'Python exits the loop automatically'], explanationEn: 'x remains 1, so the condition stays True and the loop never ends on its own.' },
  loop_11: { questionEn: 'What does the code below print, in order?', optionsEn: ['0, 1, 0, 3, 0', '0, 1, 2, 3, 4', '1, 0, 3, 0, 5', '0, 0, 0, 0, 0'], explanationEn: 'When x is even, the code prints 0; otherwise, it prints x. range(5) produces 0 through 4.' },
  loop_12: { questionEn: 'What does the code below print, in order?', optionsEn: ['Odd, even, odd, even, odd', 'Even, odd, even, odd, even', '1, 2, 3, 4, 5', 'Odd, odd, odd, odd, odd'], explanationEn: 'The loop runs from 1 through 5, and if-else prints whether each number is odd or even.' },
  loop_13: { questionEn: 'What is the value of total after running the code below?', optionsEn: ['3', '9', '-3', '15'], explanationEn: 'The odd numbers add up to 1 + 3 + 5 = 9, and the even numbers subtract 2 + 4, leaving total equal to 3.' },
  ifelse_01: { questionEn: 'Which keyword starts a conditional statement in Python?', optionsEn: ['when', 'if', 'check', 'case'], explanationEn: 'In Python, a conditional statement starts with if followed by a condition.' },
  ifelse_02: { questionEn: 'What is the result after running the code below?', optionsEn: ['True', 'False', '3', '2'], explanationEn: '3 is greater than 2, so the comparison evaluates to True.' },
  ifelse_03: { questionEn: 'Which keyword is commonly used for an alternative when an if condition is false?', optionsEn: ['otherwise', 'else', 'then', 'elif'], explanationEn: 'else handles the case where the preceding if condition is false.' },
  ifelse_04: { questionEn: 'Which operator means “not equal to”?', optionsEn: ['=', '==', '!=', '<>'], explanationEn: 'Python uses != to check whether two values are different.' },
  ifelse_05: { questionEn: 'What is the result after running the code below?', optionsEn: ['True', 'False', '80', 'Error'], explanationEn: '80 is greater than or equal to 60, so the condition is true.' },
  ifelse_06: { questionEn: 'What is elif used for in Python?', optionsEn: ['Ending an if block', 'Adding another conditional branch', 'Repeating a condition', 'Defining a function'], explanationEn: 'elif is short for “else if” and checks additional conditions between if and else.' },
  ifelse_07: { questionEn: 'What does the code below print?', optionsEn: ['True', 'False', 'None', 'Error'], explanationEn: 'With and, both sides must be True for the result to be True.' },
  ifelse_08: { questionEn: 'What does the code below print?', optionsEn: ['True', 'False', 'None', 'Error'], explanationEn: 'With or, the result is True if either side is True.' },
  ifelse_09: { questionEn: 'What does the code below print?', optionsEn: ['True', 'False', '4', '0'], explanationEn: 'If x is divisible by 2, the condition is true and prints True; otherwise it prints False.' },
  ifelse_10: { questionEn: 'How does Python mark the code inside an if block?', optionsEn: ['By wrapping it in braces', 'By adding a semicolon to each line', 'By using indentation', 'By using begin and end'], explanationEn: 'Python uses consistent indentation to mark code blocks.' },
  ifelse_11: { questionEn: 'What does the code below print?', optionsEn: ['Pass', 'Fail', '80', 'Nothing'], explanationEn: 'score is 75, which satisfies score >= 60, so the first branch prints “Pass”.' },
  ifelse_12: { questionEn: 'What does the code below print?', optionsEn: ['B', 'A', 'C', 'Fail'], explanationEn: 'score is 75, so it passes the outer passing-score check and enters the inner condition. Since it is below 80, the code prints B.' },
  ifelse_13: { questionEn: 'What does the nested conditional below print?', optionsEn: ['Positive even', 'Positive odd', 'Not positive', 'Even'], explanationEn: 'x is greater than 0, so the outer if is entered. x is also divisible by 2, so the inner condition prints “Positive even”.' },
  ifelse_14: { questionEn: 'What does the code below print?', optionsEn: ['Entry allowed', 'Under 18', 'Ticket required', 'Nothing'], explanationEn: 'age is at least 18, so the outer if is entered. However, has_ticket is False, so the inner else prints “Ticket required”.' },
  inout_01: { questionEn: 'Which Python function displays text on the screen?', optionsEn: ['show()', 'echo()', 'print()', 'write_line()'], explanationEn: 'print() outputs the specified content to the screen.' },
  inout_02: { questionEn: 'Which Python function reads user input?', optionsEn: ['scan()', 'input()', 'read_key()', 'get()'], explanationEn: 'input() reads one line of text entered by the user.' },
  inout_03: { questionEn: 'What is displayed after running the code below?', optionsEn: ['"Hello"', 'Hello', 'print Hello', 'Nothing'], explanationEn: 'print() outputs the contents of a string without displaying its quotation marks.' },
  inout_04: { questionEn: 'What type of value does input() return by default?', optionsEn: ['int', 'float', 'str', 'bool'], explanationEn: 'Even when the input looks like a number, input() returns a string by default.' },
  inout_05: { questionEn: 'Which expression converts user input to an integer?', optionsEn: ['input(int)', 'int(input())', 'str(input())', 'integer(input())'], explanationEn: 'int() converts an input string to an integer when possible.' },
  inout_06: { questionEn: 'What does the code below print?', optionsEn: ['AB', 'A B', 'A,B', '["A", "B"]'], explanationEn: 'print() separates multiple output values with a space by default.' },
  inout_07: { questionEn: 'What does the sep parameter in print() do?', optionsEn: ['Sets the separator between output values', 'Sets the input data type', 'Hides the output', 'Sets the number of loop iterations'], explanationEn: 'sep specifies the separator used between multiple values printed by print().' },
  inout_08: { questionEn: 'What is the default value of the end parameter in print()?', optionsEn: ['An empty string', 'A space', 'A newline character', 'A comma'], explanationEn: 'By default, print() adds a newline character at the end of its output.' },
  inout_09: { questionEn: 'What is displayed after running the code below?', optionsEn: ['年齡：12', '年齡： 12', '"年齡：", "12"', 'Error'], explanationEn: 'print() inserts a space between two output values by default.' },
  inout_10: { questionEn: 'Which expression displays the prompt “Enter your name:” when asking for input?', optionsEn: ['input("Enter your name:")', 'print.input("Enter your name:")', 'read("Enter your name:")', 'prompt = input'], explanationEn: 'input() accepts a prompt string and displays it while waiting for input.' },
  str_01: { questionEn: 'Which of these is a Python string?', optionsEn: ['hello', '"hello"', 'True', '42'], explanationEn: 'A string must be enclosed in single or double quotation marks.' },
  str_02: { questionEn: 'What does the code below print?', optionsEn: ['Py thon', 'Python', 'Py+thon', 'Error'], explanationEn: 'Using + with strings concatenates them.' },
  str_03: { questionEn: 'What does the code below print?', optionsEn: ['2', '3', '4', 'cat'], explanationEn: 'len() returns the length of a string; “cat” has 3 characters.' },
  str_04: { questionEn: 'What is the index of the first character in a Python string?', optionsEn: ['0', '1', '-1', 'It depends on the string'], explanationEn: 'Python uses zero-based indexing, so the first character has index 0.' },
  str_05: { questionEn: 'What does the code below print?', optionsEn: ['P', 'y', 'n', 'Python'], explanationEn: 'Index 0 refers to the first character of the string, P.' },
  str_06: { questionEn: 'What does the code below print?', optionsEn: ['hello', 'Hello', 'HELLO', 'Error'], explanationEn: 'upper() returns a string with all English letters converted to uppercase.' },
  str_07: { questionEn: 'What does the code below print?', optionsEn: ['"  hi  "', 'hi', 'HI', 'h i'], explanationEn: 'strip() removes whitespace from both ends of a string.' },
  str_08: { questionEn: 'What does the code below print?', optionsEn: ['banana', 'bonono', 'bonana', 'banono'], explanationEn: 'replace() replaces every a with o, resulting in bonono.' },
  str_09: { questionEn: 'What does the code below print?', optionsEn: ['abc', 'bcd', 'bcde', 'cde'], explanationEn: 'The slice includes index 1 but excludes index 4, so the result is bcd.' },
  str_10: { questionEn: 'Which f-string inserts the value of the variable name into a string?', optionsEn: ['f"Hello, {name}"', '"Hello, (name)"', 'f"Hello, name"', 'format f"Hello, name"'], explanationEn: 'An f-string starts with f and uses braces to insert a variable or expression.' },
  func_01: { questionEn: 'Which keyword defines a function in Python?', optionsEn: ['function', 'def', 'fun', 'define'], explanationEn: 'Python uses the def keyword to define a function.' },
  func_02: { questionEn: 'How do you call a function named greet?', optionsEn: ['call greet', 'greet()', 'def greet', 'run(greet)'], explanationEn: 'Call a function by adding parentheses after its name.' },
  func_03: { questionEn: 'What are parameters in a function commonly used for?', optionsEn: ['Receiving data passed to the function', 'Stopping the program', 'Repeating the function', 'Displaying error messages'], explanationEn: 'Parameters let a function receive and use data passed to it.' },
  func_04: { questionEn: 'What does return usually do in a function?', optionsEn: ['Defines a variable', 'Returns a result and ends the function', 'Calls the function again', 'Displays text'], explanationEn: 'return sends a value back to the caller and ends the current function.' },
  func_05: { questionEn: 'What is the result after running the code below?', optionsEn: ['23', '5', 'add', 'None'], explanationEn: 'The function adds the two integers and returns 5.' },
  func_06: { questionEn: 'What does a function return by default if it has no explicit return statement?', optionsEn: ['0', 'False', 'None', 'An empty string'], explanationEn: 'A function without a return value implicitly returns None.' },
  func_07: { questionEn: 'When is a default parameter value used?', optionsEn: ['It always overrides the passed value', 'When the argument is omitted in the call', 'Before the function is defined', 'Only inside a loop'], explanationEn: 'The default is used only when the argument is omitted from the function call.' },
  func_08: { questionEn: 'What does the code below print?', optionsEn: ['Hi', 'Hi Amy', 'Amy Hi', 'name Amy'], explanationEn: 'The call passes "Amy" to name, and print() separates the values with a space.' },
  func_09: { questionEn: 'Which function call uses keyword arguments?', optionsEn: ['power(2, 3)', 'power(base=2, exponent=3)', 'power()', 'def power(2, 3)'], explanationEn: 'A keyword argument specifies a parameter by name, followed by an equals sign.' },
  func_10: { questionEn: 'Where can a function’s local variable usually be used directly?', optionsEn: ['Anywhere in the program', 'Only inside the function where it is defined', 'Only in other modules', 'Only inside an if block'], explanationEn: 'A local variable is generally in scope only inside the function where it is defined.' },
};

export const DEFAULT_QUESTIONS: Question[] = DEFAULT_QUESTIONS_ZH.map((question) => ({
  ...question,
  ...DEFAULT_QUESTION_TRANSLATIONS[question.id],
}));

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

export function getQuestionContent(question: Question, language: 'zh' | 'en') {
  const useEnglish = language === 'en';
  return {
    question: useEnglish ? question.questionEn || question.question : question.question,
    options: useEnglish && question.optionsEn?.length === question.options.length
      ? question.optionsEn
      : question.options,
    explanation: useEnglish ? question.explanationEn || question.explanation : question.explanation,
  };
}

type QuestionVariant = Pick<
  Question,
  | 'question'
  | 'code'
  | 'options'
  | 'correctAnswer'
  | 'explanation'
  | 'questionEn'
  | 'optionsEn'
  | 'explanationEn'
>;

type EnglishVariant = {
  question: string;
  answer: string;
  distractors: string[];
  explanation: string;
};

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomItem = <T,>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)];

const createVariant = (
  question: string,
  code: string,
  answer: string,
  distractors: string[],
  explanation: string,
  english: EnglishVariant
): QuestionVariant => {
  const options = Array.from(new Set([answer, ...distractors])).slice(0, 4);
  while (options.length < 4) options.push(`其他答案 ${options.length - 2}`);

  const englishChoices = [english.answer, ...english.distractors];
  const optionPairs = options.map((option) => {
    const optionIndex = [answer, ...distractors].indexOf(option);
    return {
      option,
      optionEn: optionIndex >= 0
        ? englishChoices[optionIndex] ?? option
        : `Other answer ${options.indexOf(option) - 2}`,
    };
  });

  for (let i = optionPairs.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [optionPairs[i], optionPairs[j]] = [optionPairs[j], optionPairs[i]];
  }

  return {
    question,
    questionEn: english.question,
    code,
    options: optionPairs.map(({ option }) => option),
    optionsEn: optionPairs.map(({ optionEn }) => optionEn),
    correctAnswer: optionPairs.findIndex(({ option }) => option === answer),
    explanation,
    explanationEn: english.explanation,
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
      `指派運算子 = 將整數 ${x} 指派給變數 x。`,
      {
        question: 'After running the code below, what is the value of x?',
        answer: String(x),
        distractors: [`"${x}"`, String(x + 1), 'Undefined'],
        explanation: `The assignment operator = assigns the integer ${x} to the variable x.`,
      }
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
      `程式將 a 和 b 相加：${a} + ${b} = ${answer}。`,
      {
        question: 'What does the code below print?',
        answer: String(answer),
        distractors: [String(a * b), String(Math.abs(a - b)), `${a}${b}`],
        explanation: `The code adds a and b: ${a} + ${b} = ${answer}.`,
      }
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
      `// 會捨去小數部分；${dividend} // ${divisor} 的結果是 ${answer}。`,
      {
        question: 'What does the code below print?',
        answer: String(answer),
        distractors: [String(answer + 1), String(dividend % divisor), `${(dividend / divisor).toFixed(2)}`],
        explanation: `// discards the fractional part, so ${dividend} // ${divisor} equals ${answer}.`,
      }
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
      `${dividend} 除以 ${divisor} 的餘數是 ${answer}。`,
      {
        question: 'What does the code below print?',
        answer: String(answer),
        distractors: [String(divisor), String(Math.floor(dividend / divisor)), String(answer + 1)],
        explanation: `The remainder when ${dividend} is divided by ${divisor} is ${answer}.`,
      }
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
      `x += ${increment} 等同於 x = x + ${increment}，所以 x 變成 ${answer}。`,
      {
        question: 'After running the code below, what is the value of x?',
        answer: String(answer),
        distractors: [String(x), String(x * increment), String(answer + 1)],
        explanation: `x += ${increment} is equivalent to x = x + ${increment}, so x becomes ${answer}.`,
      }
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
      `多重指派依序將 ${x} 指派給 x、${y} 指派給 y；print() 預設以空格分隔。`,
      {
        question: 'What does the code below print?',
        answer: `${x} ${y}`,
        distractors: [`${y} ${x}`, `(${x}, ${y})`, `${x}, ${y}`],
        explanation: `Multiple assignment sets x to ${x} and y to ${y}; print() separates values with a space by default.`,
      }
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
      `range(${stop}) 從 0 開始，到 ${stop} 之前停止。`,
      {
        question: 'Which values does i take in order in the code below?',
        answer: Array.from({ length: stop }, (_, i) => i).join(', '),
        distractors: [
          Array.from({ length: stop }, (_, i) => i + 1).join(', '),
          Array.from({ length: stop + 1 }, (_, i) => i).join(', '),
          Array.from({ length: stop }, (_, i) => stop - i - 1).join(', '),
        ],
        explanation: `range(${stop}) starts at 0 and stops before ${stop}.`,
      }
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
      `range(${start}, ${stop}) 包含起點 ${start}，但不包含終點 ${stop}。`,
      {
        question: 'What does the code below print?',
        answer: values.join(', '),
        distractors: [
          [...values, stop].join(', '),
          Array.from({ length: stop - start }, (_, i) => start - 1 + i).join(', '),
          [...values].reverse().join(', '),
        ],
        explanation: `range(${start}, ${stop}) includes the start ${start} but excludes the end ${stop}.`,
      }
    );
  },
  loop_04: () => {
    const count = randomInt(2, 8);
    return createVariant(
      '執行下方程式碼後，Hi 會印出幾次？',
      `for _ in range(${count}):\n    print("Hi")`,
      `${count} 次`,
      [`${count - 1} 次`, `${count + 1} 次`, '無限次'],
      `range(${count}) 會產生 ${count} 個值，因此迴圈執行 ${count} 次。`,
      {
        question: 'How many times will “Hi” be printed by the code below?',
        answer: `${count} times`,
        distractors: [`${count - 1} times`, `${count + 1} times`, 'Infinite times'],
        explanation: `range(${count}) produces ${count} values, so the loop runs ${count} times.`,
      }
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
      `迴圈將 ${start} 到 ${stop - 1} 加總，結果為 ${answer}。`,
      {
        question: 'After running the code below, what is the value of total?',
        answer: String(answer),
        distractors: [String(answer - 1), String(answer + 1), String(answer + stop)],
        explanation: `The loop adds the numbers from ${start} through ${stop - 1}, giving ${answer}.`,
      }
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
      `range() 從 ${start} 開始，每次增加 ${step}，並在 ${stop} 之前停止。`,
      {
        question: 'What does the code below print?',
        answer: values.join(', '),
        distractors: [
          [...values, stop].join(', '),
          values.map((value) => value + 1).join(', '),
          values.slice(1).join(', '),
        ],
        explanation: `range() starts at ${start}, increases by ${step}, and stops before ${stop}.`,
      }
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
      `x 初始值為 ${x}，小於 ${limit}，而迴圈內沒有改變 x，因此條件一直成立。`,
      {
        question: 'What might happen when the code below runs?',
        answer: 'The program enters an infinite loop',
        distractors: ['The loop runs only once', `x automatically becomes ${limit}`, 'Python exits the loop automatically'],
        explanation: `x starts at ${x}, which is less than ${limit}. Since the loop does not change x, the condition remains true.`,
      }
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
      `${a} ${a > b ? '大於' : '不大於'} ${b}，比較結果是 ${answer}。`,
      {
        question: 'What does the code below print?',
        answer,
        distractors: [answer === 'True' ? 'False' : 'True', String(a), String(b)],
        explanation: `${a} is ${a > b ? 'greater than' : 'not greater than'} ${b}, so the comparison evaluates to ${answer}.`,
      }
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
      `${score} ${score >= passingScore ? '大於或等於' : '小於'} ${passingScore}，條件結果是 ${answer}。`,
      {
        question: 'What does the code below print?',
        answer,
        distractors: [answer === 'True' ? 'False' : 'True', String(score), String(passingScore)],
        explanation: `${score} is ${score >= passingScore ? 'greater than or equal to' : 'less than'} ${passingScore}, so the condition evaluates to ${answer}.`,
      }
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
      `and 需要左右兩側都為 True；本題結果是 ${answer}。`,
      {
        question: 'What does the code below print?',
        answer,
        distractors: [answer === 'True' ? 'False' : 'True', 'None', 'Error'],
        explanation: `With and, both sides must be True. The result here is ${answer}.`,
      }
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
      `or 只要其中一側為 True，結果就是 True；本題結果是 ${answer}。`,
      {
        question: 'What does the code below print?',
        answer,
        distractors: [answer === 'True' ? 'False' : 'True', 'None', 'Error'],
        explanation: `With or, the result is True if either side is True. The result here is ${answer}.`,
      }
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
      `若 x 是 2 的倍數，條件成立並輸出 True；否則輸出 False。`,
      {
        question: 'What does the Python code below print?',
        answer,
        distractors: [answer === 'True' ? 'False' : 'True', String(x), '0'],
        explanation: 'If x is divisible by 2, the condition is true and prints True; otherwise it prints False.',
      }
    );
  },
  inout_03: () => {
    const text = randomItem(['Hello', 'Python', 'Knowledge', 'Welcome']);
    return createVariant(
      outputQuestion,
      `print("${text}")`,
      text,
      [`"${text}"`, `print ${text}`, '不會顯示'],
      `print() 輸出字串內容，不會顯示包住字串的引號。`,
      {
        question: 'What does the code below print?',
        answer: text,
        distractors: [`"${text}"`, `print ${text}`, 'Nothing'],
        explanation: 'print() displays the contents of a string without its quotation marks.',
      }
    );
  },
  inout_06: () => {
    const [first, second] = randomItem([['A', 'B'], ['X', 'Y'], ['3', '7'], ['左', '右']]);
    return createVariant(
      outputQuestion,
      `print("${first}", "${second}")`,
      `${first} ${second}`,
      [`${first}${second}`, `${first},${second}`, `["${first}", "${second}"]`],
      'print() 預設使用空格分隔多個輸出值。',
      {
        question: 'What does the code below print?',
        answer: `${first} ${second}`,
        distractors: [`${first}${second}`, `${first},${second}`, `["${first}", "${second}"]`],
        explanation: 'print() separates multiple output values with a space by default.',
      }
    );
  },
  inout_09: () => {
    const age = randomInt(1, 99);
    return createVariant(
      outputQuestion,
      `print("年齡：", ${age})`,
      `年齡： ${age}`,
      [`年齡：${age}`, `"年齡：", "${age}"`, '錯誤'],
      'print() 預設會在兩個輸出值之間插入一個空格。',
      {
        question: 'What is displayed after running the code below?',
        answer: `年齡： ${age}`,
        distractors: [`年齡：${age}`, `"年齡：", "${age}"`, 'Error'],
        explanation: 'print() inserts a space between the two output values by default.',
      }
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
      '字串使用 + 會串接在一起，不會自動加入空格。',
      {
        question: 'What does the code below print?',
        answer,
        distractors: [`${first} ${second}`, `${first}+${second}`, `${second}${first}`],
        explanation: 'The + operator concatenates strings without inserting a space.',
      }
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
      `len() 會回傳字串長度；"${word}" 有 ${word.length} 個字元。`,
      {
        question: 'What does the code below print?',
        answer,
        distractors: [String(word.length - 1), String(word.length + 1), word],
        explanation: `len() returns a string's length; "${word}" has ${word.length} characters.`,
      }
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
      `索引 ${index} 代表字串中的第 ${index + 1} 個字元，因此結果是 ${answer}。`,
      {
        question: 'What does the code below print?',
        answer,
        distractors: [word[(index + 1) % word.length], word[(index + 2) % word.length], word],
        explanation: `Index ${index} refers to the ${index + 1}${index === 0 ? 'st' : index === 1 ? 'nd' : index === 2 ? 'rd' : 'th'} character, so the result is ${answer}.`,
      }
    );
  },
  str_06: () => {
    const word = randomItem(['hello', 'python', 'coding', 'planet']);
    return createVariant(
      outputQuestion,
      `print("${word}".upper())`,
      word.toUpperCase(),
      [word, `${word[0].toUpperCase()}${word.slice(1)}`, '錯誤'],
      'upper() 會回傳所有英文字母轉成大寫的字串。',
      {
        question: 'What does the code below print?',
        answer: word.toUpperCase(),
        distractors: [word, `${word[0].toUpperCase()}${word.slice(1)}`, 'Error'],
        explanation: 'upper() returns a string with all English letters converted to uppercase.',
      }
    );
  },
  str_07: () => {
    const word = randomItem(['hi', 'code', 'hello', 'Python']);
    return createVariant(
      outputQuestion,
      `print("  ${word}  ".strip())`,
      word,
      [`"  ${word}  "`, word.toUpperCase(), `"${word} "`],
      'strip() 會移除字串左右兩側的空白字元。',
      {
        question: 'What does the code below print?',
        answer: word,
        distractors: [`"  ${word}  "`, word.toUpperCase(), `"${word} "`],
        explanation: 'strip() removes whitespace from both ends of a string.',
      }
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
      `replace() 會將所有符合的 ${oldChar} 替換成 ${newChar}，結果是 ${answer}。`,
      {
        question: 'What does the code below print?',
        answer,
        distractors: [word, word.replace(oldChar, newChar), word.toUpperCase()],
        explanation: `replace() changes every ${oldChar} to ${newChar}, resulting in ${answer}.`,
      }
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
      `切片包含起始索引 ${start}，但不包含結束索引 ${end}，因此結果是 ${answer}。`,
      {
        question: 'What does the code below print?',
        answer,
        distractors: [word.slice(start, end + 1), word.slice(start - 1, end), word],
        explanation: `The slice includes start index ${start} but excludes end index ${end}, so the result is ${answer}.`,
      }
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
      `add() 回傳兩個整數的總和：${a} + ${b} = ${answer}。`,
      {
        question: 'What is the result after running the code below?',
        answer,
        distractors: [`${a}${b}`, String(a * b), String(Math.abs(a - b))],
        explanation: `The add() function returns the sum of the two integers: ${a} + ${b} = ${answer}.`,
      }
    );
  },
  func_08: () => {
    const name = randomItem(['Amy', 'Mia', 'Kai', 'Bo']);
    return createVariant(
      outputQuestion,
      `def greet(name):\n    print("Hi", name)\n\ngreet("${name}")`,
      `Hi ${name}`,
      ['Hi', name, `${name} Hi`],
      `呼叫 greet("${name}") 時，print() 以空格分隔 Hi 與參數，因此輸出 Hi ${name}。`,
      {
        question: 'What does the code below print?',
        answer: `Hi ${name}`,
        distractors: ['Hi', name, `${name} Hi`],
        explanation: `When greet("${name}") is called, print() separates "Hi" and the argument with a space, producing Hi ${name}.`,
      }
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
