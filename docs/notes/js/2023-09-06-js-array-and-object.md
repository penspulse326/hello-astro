---
title: '陣列與物件'
description: 'JavaScript 的物件型別簡介'
date: 2023-09-06 10:19:47
keywords: [JavaScript, 陣列, 物件, array, object, shallow-copy]
tags: ['筆記', 'JavaScript']
slug: js-array-and-object
---

number、string、null 等等是為「**原始型別**」（primitive type），內容通常是純值。

object、array 則為「**物件型別**」（object type），  
它們比較像是箱子，裡面可以包含各種型別的資料。

注意陣列是一種 object，所以用 typeof 檢查不出來內容到底是否為陣列，  
和 `NaN` 一樣需要用其他方法判定：

```js
let arr = [];

console.log(arr === []); // false
console.log(Array.isArray(arr)); // true
```

---

## call by value

原始型別在存取時時只會拷貝到值，函式在帶入這些變數時，  
實際上是把這些值複製一份到函式裡面使用，這種情況稱為 `call by value`：

```js
let a = 1;
let b = a;

a = 2;
console.log(a); // 2
console.log(b); // 1
```

---

## call by sharing

物件型別在在存取時是**把記憶體位址拷貝過去**，  
不是裡面的內容，如 `arr1 = [1]`，所以 arr1 存的是一個記憶體位址 `0x01`，  
這個位址裡面放的才是陣列的內容：

```JS
let arr1 = [];
let arr2 = arr1;

arr1.push(1);
arr1.push(2);

// arr2 存的是 arr1 的記憶體位址，所以查看 arr2 等同於 arr1
console.log(arr2); // [1, 2];
```

---

由上面範例可以看到，雖然 arr2 拷貝了 arr1，  
但是對 arr1 新增了資料後，arr2 的值居然也發生改變了！  
這種情況稱為 **call by sharing**。

在進行比對時，物件並不等於物件，因為它們比對的並不是值或內容，  
而是記憶體位址，所以寬鬆比較的結果還是 false：

```js
let arr1 = [];
let arr2 = [];

console.log(arr1 == arr2); // false

let obj1 = {};
let obj2 = {};

console.log(obj1 == obj2); // false
```

---

## const 宣告

sharing 代表可以共享物件內的屬性，所以在剛剛的範例裡，  
`arr1 = arr2` 拷貝之後去操作 `arr2.push`，實際上是在執行 `arr1.push`。

透過**參數**傳進函式內的話會有點不一樣：

```js
let data = { name: 'Jack' };

function changeContent(obj) {
  obj.name = 'Vic';
  console.log(obj.name); // 'Vic'

  obj = { name: 'Merry' };
  console.log(obj.name); // 'Merry'
}

changeContent(data);
console.log(data.name); // 'Vic'
```

透過參數接到該物件，等同於在函式內宣告變數然後拷貝該物件，  
所以 `obj.name` 同時改變到原本的 data 裡的 name 了，  
但是**重新賦值並不會改變原始變數所指向的記憶體位址**，  
所以最後印出來的 name 仍然是 Vic。

如果沒有清空內容等等的特殊需求，物件型別一般都是用 const 宣告，  
語意上可以表示這是「不可任意改變位址綁定」的物件，  
也可以防止在撰寫的過程中意外改寫內容。

---

## 淺拷貝

知道 call by sharing 後，就產生了一個問題：

「**到底應該怎麼複製物件的內容而且形成一個獨立的物件**？」

直接賦值的拷貝也叫做**淺拷貝（shallow copy）**，  
想要形成獨立的物件就只能透過其他方式：

```js
let arr1 = [1, 2];
let arr2 = [...arr1];

arr1.push(3);

console.log(arr2); // [1, 2]
```

使用展開運算子看起來似乎沒問題，arr2 的值並沒有被 arr1 的行為影響，  
但這只限在第一層而已：

```js
let arr1 = [{ a: 1 }];
let arr2 = [...arr1];

arr1[0].a = 2;
console.log(arr2); // [{ a : 2 }]
```

展開運算子只能重新分配第一層的記憶體，  
如果物件內容裡面又是另一層的物件，  
第二層以後還是會指向原本的記憶體空間，  
所以展開運算還是一種淺拷貝。

不考慮其他工具的話，要達成深拷貝（deep copy）的方法是 **JSON 字串轉換**：

```js
let arr1 = [{ a: 1 }, { b: 2 }];
let arr2 = JSON.parse(JSON.stringify(arr1));

arr1[1].b = 0;

console.log(arr2); // [{ a : 1 },{ b : 2}]
```

把原本的內容強制轉型成字串，
再還原成物件的格式，形成一個全新的記憶體空間。

---

## 參考資料

- [所有東西都是物件(或純值)](https://israynotarray.com/jsweirdworld/20190521/1329212743/)
- [JS 原力覺醒 Day9 - 原始型別與物件型別](https://ithelp.ithome.com.tw/articles/10220005)
- [關於 JS 中的淺拷貝(shallow copy)以及深拷貝(deep copy)](https://medium.com/andy-blog/%E9%97%9C%E6%96%BCjs%E4%B8%AD%E7%9A%84%E6%B7%BA%E6%8B%B7%E8%B2%9D-shallow-copy-%E4%BB%A5%E5%8F%8A%E6%B7%B1%E6%8B%B7%E8%B2%9D-deep-copy-5f5bbe96c122)
