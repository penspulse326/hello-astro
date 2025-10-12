---
title: '變數宣告'
description: 'JavaScript 的變數宣告問題'
date: 2023-08-30 13:54:38
keywords: [JavaScript, 變數, 作用域, variable, scope]
tags: ['筆記', 'JavaScript']
slug: js-variable-declare
---

宣告是為了告訴電腦需要**一塊記憶體空間**來存放資料，類似**置物櫃**的概念，  
申請左上角的 1 號櫃之後，我們可以決定櫃子裡面要裝什麼，但 1 號櫃的位置仍然在左上角。

## let / const

let 的內容可以隨時賦值改變，  
const 則指不會變動的內容（constant）。

let 宣告時可以不賦值，內容為 undefined，  
const 在宣告後必須賦值且不能改變內容，否則會報錯：

```js
let a; // a 為 undefined

const b; // >>>> 報錯 const 在宣告時必須賦予值

const c = 1;
c = 2; // >>>> 報錯 不能改變 const 的內容
```

---

## var

ES6 前只有 var 這個宣告方式，功能類似 let，  
但語法規定寬鬆，某些機制容易造成撰寫上的意外失誤。

### 可以重複宣告

有寫過其他程式語言的話一定會覺得重複宣告是非常奇怪的事：

```js
var a = 1;

console.log(a); // 1

var a = '我被重新宣告竟然沒有報錯太扯了吧';

console.log(a); // "我被重新宣告竟然沒有報錯太扯了吧"
```

### 作用域

var 最顯著的差異就是作用域。

let / const 的作用區間以**大括號**為限，離開大括號後就無法存取，  
包含迴圈、函式，或隨手寫一組大括號等都符合這個規則：

```js
{
  let a = 1;
  const b = 'hello';
}

console.log(a, b); // 報錯 a 與 b 未宣告
```

大部分的語言也是遵循這種生命週期的概念設計的，但是 var 的行為不同：

```js
var a = 1;

for (var i = 1; i < 5; i++) {
  a += i;
}

console.log(a); // 11
console.log(i); // 5
```

迴圈跑完後可以查看 a 的值是 11，但是連 i 的值都可以存取...  
這是因為 var 的作用域是以**函式內**為限，  
而 for 的迭代只是一組大括號而已，並不是函式。

以上特性都有機率產生全域性的污染，  
進而取到錯誤的值，或是無意間修改了同名的資料，  
一般撰寫時幾乎不推薦使用 var 宣告。

### 比較

|          | var    | let    | const  |
| -------- | ------ | ------ | ------ |
| 作用域   | 函式   | 大括號 | 大括號 |
| 初始值   | 非必須 | 非必須 | 必須   |
| 重複宣告 | 可以   | 不行   | 不行   |

---

## 變數可以不宣告嗎

沒有任何宣告的關鍵字，直接寫出變數名稱，  
會變成**全域環境**下可以存取的值：

```js
function foo() {
  a = 1;
}

foo();
console.log(a); // 1
console.log(window.a); // 1
```

函式 foo 執行完後仍然可以找到 a，  
此時 a 是全域物件 **window** 的一個**屬性**（property），用 `window.a` 可以取出來，  
所以嚴格來說 a 目前不是一個獨立的變數。

屬性與變數最重要的差異在於，**屬性**可以使用 delete 運算子刪除：

```js
function foo() {
  a = 1;
}

foo();
delete a;
console.log(a); // Uncaught ReferenceError: a is not defined

let b = 2;
delete b;
console.log(b); // 2
```

`delete a` 之後印出 a 會報錯，因為 a 已經確實被刪除，  
而對使用 let 宣告的 b 使用 delete 後還是可以印出來，  
因為 delete 運算子對變數不生效但也不會報錯。

---

## 參考資料

- [JS 宣告變數， var 與 let / const 差異](https://www.programfarmer.com/articles/2020/javascript-var-let-const-for-loop)
- [一文了解無宣告、var、let、const 變數細節](https://www.lagagain.com/post/%E4%BD%A0%E5%8F%AF%E8%83%BD%E9%83%BD%E4%B8%8D%E7%9E%AD%E8%A7%A3%E7%9A%84js%E8%AE%8A%E6%95%B8%E7%A5%95%E5%AF%86/)
