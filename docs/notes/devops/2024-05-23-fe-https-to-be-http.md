---
title: '前端 HTTPS 對接後端 HTTP'
description: 'HTTPS 對接 HTTP時的 mixed content 問題'
date: 2024-05-23 18:45:53
keywords: [https-to-http, mix-content, devops, vercel, vite, 前端, 部署]
tags: ['踩坑', 'DevOps']
slug: fe-https-to-be-http
---

情境：  
前端是 `React` + `Vite`  
後端是運行在某個 `HTTP` 協定的 `ASP.NET` 程式  
此配置會在瀏覽器看到 Mixed-Content 的報錯

## Vercel 部署設定

假設前端是透過 Vercel 部署，可以在專案根目錄新增 `vercel.json`：

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "http://your.backend.server/api/:path*"
    }
  ]
}
```

source 是攔截指定路徑，destination 是自動改寫後的路徑，  
例如：對 `/api/member/signup` 發出請求，  
經過自動改寫後會對 `http://your.backend.server/api/member/signup` 請求。

:::warning
注意上面的動態路由是寫 `/:path*` 而不是 `/:path`，  
沒有星號 \* 的話只會捕捉這串路徑 `/api/member/signup` 的第一個區間 `/member`，  
後面的 `/signup` 就不會被捕捉到！
:::

網路請求的 URL 也要修改，將後端的 domain 移除，留下後面的路徑即可：

```js
// 原本的
fetch('http://your.backend.server/api/member/signup', config);

// 修改後
fetch('/api/member/signup', config);
```

上面修改後的 fetch 函式執行時就會被 Vercel 攔截，自動改寫完才向後端發出，  
不是用 Vercel 來部署的話，一般 PaaS 供應商也有提供類似的設定，  
去參考他們提供的文件即可。（~~就是不要問我 Vercel 以外的東西的意思~~）

---

## 本地端設定

一路改到這裡會有個問題：  
**我那些 fetch 的 url 全改了，那我在本地端開發的時候怎麼辦？**

本地端開發時當然不會被 Vercel 的設定攔截到，  
這個請求 `fetch('/api/member/signup', config)` 會直接對本地端發出，  
然後就報錯了。

在 `vite.config.js` 加入 server 設定：

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 加入以下設定
  server: {
    proxy: {
      '/api': {
        target: 'http://your.backend.server',
        changeOrigin: true,
        // 如果有字串需要替換可以加入 rewrite 這個屬性
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  },
});
```

本地端在開發時就會套用這個 proxy 代理設定，  
攔截到 `/api` 開頭的請求後會把這串請求的路徑加入到 target 的網址後面，  
跟剛剛 `vercel.json` 做的事情是一樣的！

Vercel 部署時是把我們的專案 build（打包）後再運行，  
而 Vite 在打包時不會把剛剛在 `vite.config.js` 加入的 server 設定也編譯進去，  
所以不用擔心這個代理設定會覆蓋到 `vercel.json` 的設定！

---

## 參考資料

- [混合內容](https://developer.mozilla.org/zh-TW/docs/Web/Security/Mixed_content)
- [Configuring Projects with vercel.json](https://vercel.com/docs/projects/project-configuration#rewrites)
- [Vercel 反向代理：解決 GitHub Pages 與後端 HTTP 限制](https://medium.com/@JammsL/%E5%BE%9E%E5%81%9A%E4%B8%AD%E5%AD%B8-vercel%E5%8F%8D%E5%90%91%E4%BB%A3%E7%90%86-%E8%A7%A3%E6%B1%BAgithub-pages%E8%88%87%E5%BE%8C%E7%AB%AFhttp%E9%99%90%E5%88%B6-2a04498e6d36)
