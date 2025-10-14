---
title: 'Admonitions 測試頁面'
description: '測試各種 admonition 類型的顯示效果'
date: 2025-10-14
keywords: [test, admonitions]
tags: ['測試']
slug: admonitions-test
---

這個頁面用來測試各種 admonition 類型的顯示效果。

## Note (筆記)

:::note
這是一個筆記區塊,使用 Bootstrap 的 primary 顏色(藍色)。
適合用來補充說明或提供額外資訊。
:::

## Tip (提示)

:::tip
這是一個提示區塊,使用 Bootstrap 的 success 顏色(綠色)。
適合用來分享最佳實踐或有用的建議。
:::

## Info (資訊)

:::info
這是一個資訊區塊,使用 Bootstrap 的 info 顏色(青色)。
適合用來提供背景知識或相關資訊。
:::

## Warning (警告)

:::warning
這是一個警告區塊,使用 Bootstrap 的 warning 顏色(黃色)。
適合用來提醒讀者注意潛在問題或需要小心的地方。
:::

## Caution (注意)

:::caution
這是一個注意區塊,同樣使用 Bootstrap 的 warning 顏色。
與 warning 類似,用來提醒讀者謹慎處理。
:::

## Danger (危險)

:::danger
這是一個危險區塊,使用 Bootstrap 的 danger 顏色(紅色)。
適合用來警告嚴重的問題或危險操作。
:::

## 自訂標題

:::note[自訂的標題]
你可以在方括號中指定自訂標題,像這樣。
:::

## 包含程式碼

:::info
Admonition 裡面也可以包含程式碼:

```js
const greeting = 'Hello, World!';
console.log(greeting);
```

以及行內程式碼 `const x = 42;`
:::

## 包含列表

:::tip
Admonition 裡面也可以包含列表:

- 第一個項目
- 第二個項目
- 第三個項目

有序列表也可以:

1. 步驟一
2. 步驟二
3. 步驟三
   :::

## 多段落內容

:::warning
這個 admonition 包含多個段落。

第二個段落在這裡。

第三個段落也可以正常顯示。
:::
