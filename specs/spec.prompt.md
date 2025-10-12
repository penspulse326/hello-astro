# 個人技術部落格

## 開發環境

- Language: TypeScript
- Framework: Astro
- UI: Bootstrap
- Linter: Prettier

## 網站地圖

- 首頁
- 研究筆記
- 挑戰計畫
- 心得文章

## 建置階段

### Phase 1

驗收目標：建置首頁

建置區塊：

1. 導覽列：

- Logo（'public/logo.png'）
- 研究筆記
- 挑戰計畫
- 心得文章
- 搜尋（非輸入框，而是點擊後彈出 modal 以進行 algolia 搜尋 ）
- GitHub 連結（使用 bootstrap-icons）
- Theme Toggler

佈局說明：

- 導覽列內容會與 container 同寬，因此高解析度時導覽列內容左右不會貼齊畫面邊緣
- Logo、研究筆記、挑戰計畫、心得文章為站內連結，高解析度時靠左
- 其他按鈕或外部連結靠右
- 行動版時，導覽列會收縮成漢堡按鈕，點擊採用 collapse（drawer）方式展開選單

2. 介紹區塊：

- 網站介紹：介紹站內連結如研究筆記、挑戰計畫、心得文章各自的用途
- 個人介紹：簡短介紹自己

佈局說明：

- 全部內容在 container 中，最大寬度為 800px
- 桌面版為 2 列，皆為 card 形式，第 1 列為 3 欄 card，分別說明研究筆記、挑戰計畫、心得文章的用途
- 第 2 列為個人介紹、經歷、使用技術，個人介紹為 2 欄 card，經歷與使用技術為上下 1 個 card，佔 1 欄
- 行動版皆為單欄式
