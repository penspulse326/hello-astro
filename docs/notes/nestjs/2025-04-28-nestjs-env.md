---
title: '環境建置'
description: 'NestJS 的環境設定'
date: 2025-04-28 17:55:00
keywords: [程式語言, 後端框架, 設計模式, 物件導向, 依賴注入, JavaScript, TypeScript, NestJS, OOP, DI]
tags: ['筆記', 'NestJS']
slug: nestjs-env
---

## 專案架構

NestJS 採用大量的設計模式，建立好專案後，  
`src/` 下預設就有就有根模組 `AppModule`（root module）的元件：

1. module（各功能的出入口管理）
2. controller（就是原本 MVC 中的 Controller）
3. service（處理業務邏輯，不直接操作資料庫）

可以依據架構需要，還會再分出：

- entity（映設資料表的資料主體）
- repository（去操作 entity 對資料庫 I/O 的邏輯）

來將原本 model 層的作業分得更細緻，讓 service 不再需要操作到資料表，  
元件的分工也比較單一化，顆粒度更細。

---

## 進入點

`main.ts` 就像 Express 的啟動檔，在這裡會透過 `NestFactory` 傳入根模組來啟動應用程式。

預設以 Express 啟動，要用 Fastify 的話可以傳入 [`NestFastifyApplication`](https://docs.nestjs.com/techniques/mvc#fastify) 這個泛型。

---

## 根模組

從根模組開始會看到一系列的以 `@` 開頭的裝飾器（decorator）語法，  
如`@Module`、`@Controller` 等，在 Nest 裡面會大量使用。

裝飾器是一種函式，會用來改寫下面一行的程式碼的部分內容，  
例如類別（class）、函式（function）等都是可以被裝飾器修改的類型。

因為通常不會在根模組寫入太多業務邏輯，所以 `app.controller` 和 `app.service` 可以先考慮移除。

---

## 依賴注入

任何被被 `@Injectable` 標記的類別，  
都會變成依賴注入（dependency injection）的對象。

依賴注入主要是將實例化（new）的過程，改為在外部完成後才`做為建構函式的參數傳入`：

```ts
// 在 class 裡面實例化另外一個 class
class A {
  private readonly b: B = new B();
}

// 依賴注入
class A {
  constructor(private readonly b: B) {}
}
```

這樣做的目的是降低 class 之間的依賴關係（耦合度），也間接減少改 A 壞 B 的情形。

實例化會在依賴注入容器（DI Container）裡面完成， 確保每個被標記的類別都**只會被實例化一次**。

:::info
只存在一個實例的設計模式也叫做單例模式（singleton）。
:::

根模組也會載入應用程式啟動時需要一起實例化的其他功能模組，  
所以整體的依賴關係會是一個樹狀結構（tree），應用程式啟動時會依照依賴的順序建立實例。

:::info
在建構函式中注入實例時通常會標記 private readonly，
private 會限制可以存取的作用域，readonly 可以防止實例的來源被修改或是被重新賦值。
:::

---

## 總結

NestJS 提供了有規模的架構，並整合許多套件，但前置作業和預備知識也就更多，  
光是元件和中介函式就被分類成好幾種，所以才會寫下這篇筆記記錄 XDDD

要用來邊做邊學 OOP 和設計模式的話，應該是不錯的選擇，  
但只是拿來做小練習就會很像用 Redux 寫 todo，殺雞焉用斬艦刀的感覺...  
不過萬物皆 todo，沒有什麼工具是做不出 todo list 的！

---

## 參考資料

- [[學習筆記] 依賴注入(DI)](https://ithelp.ithome.com.tw/articles/10211847)
- [單例模式](https://zh.wikipedia.org/zh-tw/%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F)
