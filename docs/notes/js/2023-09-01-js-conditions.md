---
title: '條件判斷'
description: '理解 if, switch 的差異，與三元運算、短路的運用'
date: 2023-09-01 09:59:29
keywords: [JavaScript, 條件判斷, 三元運算, 短路, conditionals, ternary-operator, short-circuit-evaluation]
tags: ['筆記', 'JavaScript']
slug: js-conditions
---

條件判斷是控制程式運行流程的關鍵，寫得好就上天堂，寫不好就波動拳。

## if-else

依照**判斷區間**的 true / false 來決定是否執行：

```js
let a = 1;

if (a > 0) {
  console.log('a 大於 0'); // true 會執行
}
```

能判別為 true 的叫做**真值**（truthy），判別為 false 的則是**假值**（falsy），  
除了大於、小於等等的比較結果，也經常用在判定某些變數、物件存不存在，  
以下都是會判定為 false 的假值：

- undefined
- 0
- ''（空字串）
- null
- NaN

```js
if (message) {
  console.log('有訊息：', message);
} else {
  // 訊息有可能不存在，會是空字串、undefined、null 等等的值
  console.log('沒有訊息');
}
```

---

## switch

switch 是**拿傳入的值和 case 的值比較是否嚴格相等**，來決定是否執行該 case，  
和 case 的條件成立與否無關：

```js
let wallet = 300;

switch (wallet) {
  case wallet > 500:
    console.log('給我一瓶酒再給我一支菸');
    break;
  case wallet > 100:
    console.log('因為錢就是我快樂的泉源');
    break;
  default:
    console.log('把愛勇氣希望都賣了能換來多少錢');
}

// 會印出 '把愛勇氣希望都賣了能換來多少錢'
```

`wallet < 100` 雖然條件成立，但這個判斷式實際上代表 true 這個值，  
所以程式碼運行時是在比較 `wallet` 和 `case` 的值是否相等，  
而 `wallet` 的 300 並不**嚴格相等**於 true，也就沒有進到 `wallet > 100` 這個 case，  
最後執行的是 default 的內容。

想進到 case，只要把 `switch(wallet)` 改成 `switch(true)` 即可，  
但一般不這麼做是因為**不符合語意**。

需要列舉出所有純值的結果時，switch 會比較好讀，也可以避免過多巢狀結構。  
而需要同時符合多個條件時，if-else 會是比較好閱讀的：

```js
// 需要多重條件判斷就用 if-else
if (bmi > 35) {
  console.log('重度肥配');
} else if (bmi < 35 && bmi >= 30) {
  console.log('中度肥胖');
}

// 有明確可以列舉的 case
switch (option) {
  case 'A':
    console.log('選項 A 不是答案');
    break;
  case 'B':
    console.log('選項 B 不是答案');
    break;
  case 'C':
    console.log('選項 C 是正確答案');
    break;
  default:
    console.log('你怎麼沒選答案');
}
```

---

## 三元運算

如果需要**針對某個狀態**的 true/false 接收對應的內容，可以用三元運算簡化程式碼長度：

```js
let result = getData();

// if else 的寫法
if (result) {
  console.log('有資料');
} else {
  console.log('沒資料');
}

// 三元運算的寫法
console.log(result ? '有資料' : '沒資料');
```

也可以像 if-else 寫一些程式碼進去執行，如下面範例，  
但個人覺得**三元運算單純用在取值就好**，否則可讀性會有點差：

```js
let message = getMessage();

// 不好的寫法
message ? console.log('有訊息') : console.log('沒訊息');

// 好一點的寫法
console.log(message ? '有訊息' : '沒訊息');

// 這樣也可以
let message = getMessage() ? '有訊息' : '沒訊息';
console.log(message);
```

---

## 短路取值

可以組合多個值並回傳一個真假值，經常和 if 一起使用，做多重條件的判斷。

### OR ||

**有一邊為 true 就成立**，  
兩邊都是 true 時 ，只會提前返回第一個真值的「內容」，不會進到後面的判斷，  
如果真值本身就是我們需要的內容（非空的字串、非零的數字等等）也可以用 OR 取值。

下面範例是假設執行 getData() 會得到一個陣列資料，  
如果沒有取到資料就賦予一個空陣列給 data：

```js
// 假設 getData 會回傳陣列或 null
// 用 || 可以進行判斷後再賦予值
let data = getData() || [];
```

### AND &&

**兩邊為 true 才成立**，回傳的是後面的值。  
如果兩邊都是 false 時，在第一個 false 就會提前返回，  
如 `null && undefined` 會回傳 `null`：

```js
console.log('有東西' && '真的有東西'); // "真的有東西"
console.log(null && '有東西'); // null
console.log(null && undefined); // null
```

AND 的邏輯是要兩邊都要判斷，因此兩邊都是 true 就代表已經做到第二個值的檢查了，  
所以回傳的會是後面那一個值。

### 空值合併運算子 ??

第一個值是 `null` 或 `undefined` 時回傳右邊的值，  
是 `0` 或是空字串等其他假值不會判斷到後面：

```js
console.log(null ?? '有東西'); // '有東西'
console.log('' ?? '這裡也有東西'); // ''
```

---

## 例外排除

刷題時很常遇到不合法的值忘記要排除，  
如果在第一個條件就過濾掉例外值，就可以跳過一連串的判斷，  
增加一些可讀性與效能：

```js
function showBodyCondition(bmi) {
  // 把不合法的條件移到第一個
  if (isNaN(bmi) || typeof bmi !== 'number') {
    console.log('請輸入合法的數字');
  } else if (bmi < 17.5) {
    console.log('過輕');
  }
  //...
}
```

**early return** 也是很常使用的技巧，  
在函式內只要執行到 return 就會脫離函式，後面的程式碼就不會繼續執行，  
如下面範例，showPokemonData 一開始就先判斷資料是否還在讀取或者資料不存在：

```js
function showPokemonData(data) {
  if (isLoading || !data) {
    return;
  }

  console.log(data);
}
```

---

## 參考資料

- [IF ELSE 與 SWITCH CASE 的比較](https://jameshsu0407.github.io/blog/20211023_if-else_switch-case/)
- [三元運算子（Ternary Operator）和布林值混用的簡化方法](https://medium.com/@yuhsienyeh/%E4%B8%89%E5%85%83%E9%81%8B%E7%AE%97%E5%AD%90-ternary-operator-%E5%92%8C%E5%B8%83%E6%9E%97%E5%80%BC%E6%B7%B7%E7%94%A8%E7%9A%84%E7%B0%A1%E5%8C%96%E6%96%B9%E6%B3%95-6bb70375fd65)
- [Logical AND (&&)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND)
- [空值合并运算符](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
