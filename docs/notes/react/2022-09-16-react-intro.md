---
title: '框架概念'
description: 'React 與框架的概念'
date: 2022-09-16 17:55:00
keywords: [程式語言, 前端框架, JavaScript, React, Virtual DOM]
tags: ['筆記', 'React']
slug: react-intro
---

我們原本是如何使用 在 JavaScript 讓網頁畫面產生互動呢？

1. 選取 DOM 元素
2. 用 `addEventListener` 綁定選到的元素，監聽點擊、滑動等「特定行為」
3. 被監聽的元素如果觸發「特定行為」就執行對應函式

監聽的事件越來越多，程式碼自然就會變得繁雜，  
也會感覺到畫面更新越來越久，且常常會出錯，  
即便只是慢了 0.3 秒，例如：

```
撰寫按鈕 A 的事件，可能會需要新增 B 區塊，而 B 區塊的內容又有其他互動事件，
產生 C 或 D 元素等，一層又一層的衍生，不僅同時操作很多 DOM 元素，
不斷嵌套的程式碼也會造成追蹤 bug 的困難，很難梳理是哪部分有問題。
```

前端框架的目標就是減少直接操作 DOM，強調的是對資料模型的操作，  
形成一個容易追溯的資料流：

`使用者操作畫面的資料 => 觸發資料更新 => 資料內容改變就同步到畫面上`

---

## Virtual DOM

以往會用 `innerHTML` 直接替換 DOM，而 React 設計了 **Virtual DOM** 的機制，  
透過比對 DOM 的狀態，來決定要從哪裡開始來更新 DOM 元素。

在 React 操作資料時會先作用在新的 Virtual DOM 上，再與舊的 Virtual DOM 比對，  
定位出所有會被此資料影響的 DOM 的起始點，再更新到瀏覽器的 DOM 上，  
減少直接操作大量 DOM 的重繪。

:::info
但不論 React 如何設計，底層運作的邏輯最終還是會執行 DOM 的操作，  
React 只是讓我們能更細緻地去操控和管理每個 DOM 元素之間的關係，  
不代表使用 React 後，網頁效能會突飛猛進。
:::

---

## 開發彈性

React 的撰寫模式沒有太多硬性的慣例，寫起來相對彈性，  
但也沒有太多開箱即用的功能，所以經常要搭配其他套件來完善功能。

初學需多多嘗試各種練習題來熟悉 React 的語法和流程，  
這點我覺得現在的 React 官網做得蠻好的，  
在 [Learn](https://react.dev/learn) 頁面的子章節都會附上一些練習題。

之後就可以實作經典的留言板、to-do list 等小型應用，  
來認識常用套件，像是 react-hook-form、react-router、redux 等，  
藉此慢慢熟悉整個 React 生態圈。

---

## 學習路徑

初期最重要的目標，個人覺得會是以下這些：

1. 理解 React 與原生 JS 整體操作 DOM 的流程差異
2. 學習最常用的 `useState` 與 `useEffect` 的用法
3. 嘗試改寫 to-do list
4. 透過各種練習慢慢熟悉其他 hook 和常用套件的用法
5. 嘗試建構一個完整功能的網站

---

## 　參考資料

- [[筆記] Why React?](https://medium.com/%E9%BA%A5%E5%85%8B%E7%9A%84%E5%8D%8A%E8%B7%AF%E5%87%BA%E5%AE%B6%E7%AD%86%E8%A8%98/%E7%AD%86%E8%A8%98-why-React-424f2abaf9a2)
- [從 Native 到 React：初學 React.js 角度的 JavaScript「升級」整理](https://hackmd.io/@BOBYZH/H1JqsfYg9)
- [你了解 React JS 嗎 15 個 React JS 的面試問題](https://linyencheng.github.io/2021/05/07/React-interview-questions/#React-%E6%9C%89%E4%BB%80%E9%BA%BC%E7%BC%BA%E9%BB%9E%E5%92%8C%E9%99%90%E5%88%B6)
