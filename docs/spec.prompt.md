# 個人技術部落格

## 開發環境

- Language: TypeScript
- Framework: Astro
- UI: Bootstrap
- Linter: Prettier

## 建置階段

### Phase 1

驗收目標：建置首頁

建置區塊：

1. 導覽列：

- Logo（'public/logo.png'）
- 研究筆記
- 挑戰計畫
- 心得文章
- 搜尋
- GitHub 連結（使用 bootstrap-icons）
- Theme Toggler（已有）

佈局說明：

- 導覽列內容會與 container 同寬，因此高解析度時導覽列內容左右不會貼齊畫面邊緣
- Logo、研究筆記、挑戰計畫、心得文章為站內連結，高解析度時靠左
- 搜尋在高解析度時在 container 正中（注意，不是內容集合的中間，是容器的正中）
- 剩下的東西靠右
