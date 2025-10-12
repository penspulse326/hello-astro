---
title: '導入 Tailwind'
description: 'Tailwind 的安裝方法'
date: 2023-10-12 23:54:38
keywords: [Tailwind, CSS, PostCSS]
tags: ['筆記', 'CSS', 'Tailwind']
slug: tailwind-intro
---

當前流行的 Tailwind 與行之有年的 Bootstrap 類似，  
可以在 html class 寫上各種封裝好的樣式，減少手刻 CSS 的負擔，

但不像 Bootstrap 有蠻多成套的元件可以直接拿來用，  
取而代之的是更容易客製化~~花式手刻~~的特性，

網路上有很多寫好的 Tailwind 元件可以摳來用 ^\_^  
這邊不講宗教戰爭，直接看看怎麼安裝吧～～

## CLI

沒什麼特殊需求的話建議用 CLI 的方式做出環境直接開刻就好：

```bash
npm install -D tailwindcss
npx tailwindcss init
```

**tailwind.config.js**可以在 content 設定要抓取的檔案路徑，  
要注意**所有使用到 tailwind 功能的檔案都要寫到 content 裡面抓取**，  
否則可能會有某個頁面載入 css 時會沒有樣式！

因為 tailwind 是根據抓取到的檔案裡面，有用到的功能就從它的工具包抽出來，  
再編譯到最後的 css 檔裡面，並不會整個工具包都拿進來一起編譯，  
所以要是有某個頁面沒抓取到，那一頁才用到的 class 或其他功能就不會被編譯到。

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: { extend: {} },
  plugins: [],
};
```

因為這個編譯特性，可以發現編譯出來的 css 檔是非常小的。

建立 input.css 把 Tailwind 的功能抓進來用：

```CSS
@tailwind base;
@tailwind components;
@tailwind utilities;
```

用 CLI 指令去指向 input.css 以及輸出的檔案，  
加入參數 --watch 監聽就不用一直重新輸入指令編譯：

```bash
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
```

最後 html 檔記得載入剛剛用 CLI 編譯出來的 output.css  
不然就做白工啦～～～

---

## PostCSS

官方示範預設你有裝 PostCSS-CLI，而且 npm script 的指令，  
也是~~隨意~~預設你完全知道 PostCSS 編譯指令所寫的，  
所以要記得順便裝 CLI 跟~~**召喚 GPT**~~查一下編譯指令。

```bash
npm install -D tailwindcss postcss postcss-cli autoprefixer
npx tailwindcss init
```

安裝完後照慣例設定 postcss.config.js，此時 tailwind 就像是 PostCSS 的插件一起載入即可：

```js title="postcss.config.js"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

接下來的步驟和上面 Tailwind CLI 的方式一樣，設定 **tailwind.config.js** 要解析的檔案，  
然後在 css 檔裡面載入 tailwind 的工具包。

最後編譯的部分改成用 PostCSS CLI 就可以了，指令會有點不一樣，但一樣可以啟用監聽模式：

```bash
npx postcss ./src/style/input.css -o ./src/style/output.css -w
```

---

## CDN

CDN 在過去有很多限制，但經過開發團隊~~變魔術~~努力後，常見的功能都可以使用了。  
載入後 class 都能直接寫：

```html
<script src="https://cdn.tailwindcss.com"></script>
<div class="w-10 h-10 bg-black"></div>
```

但開始寫之前我會建議像前面的方法一樣，npm 安裝 tailwind 再下 init 產生 **tailwind.config.js**，  
因為 VS code 的 Tailwind 提示插件要讀取到這個檔案才會運作，  
如果單純載入 CDN 就沒提示可以看了...會變得很不方便 QQ

以前無法自定義主題，現在可以了：

```html
<script>
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          superRed: 'red',
        },
      },
    },
  };
</script>
<div class="w-10 h-10 bg-superRed"></div>
```

layer 的功能也能使用了，可以輕鬆 @apply 組合 class：

```html
<style type="text/tailwindcss">
  @layer components {
    .blue-box {
      @apply rounded-sm bg-blue-400 w-10 h-10;
    }
  }
</style>
<div class="blue-box"></div>
```

插件也能載入，可以看到官方示範的是在 CDN 的 url 上寫 query string 載入插件：

```html
<script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>
<div class="prose">
  <!-- ... -->
</div>
```

不過因為是 CDN 所以還是有祖傳通病：無法離線使用。

---

## 客製化

tailwind 的設定檔裡面，extend 裡面所寫的自定義屬性，也就是如其名的功能「**延伸**」，  
是基於 Tailwind 原本就有的屬性去增加新的值，所以需要有前綴詞：

```js title="tailwind.config.js"
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      backgroundImage: {
        banner: "url('../images/banner.png')",
      },
      colors: {
        primary: '#891818',
        secondary: '#F75000',
      },
    },
  },
  plugins: [],
};
```

如 colors 新增的顏色，在 class 裡面可以直接後綴在任何需要顏色的屬性，  
如文字顏色、背景顏色、框線顏色等等...

backgroundImage 裡面指定 url，  
這時 class 就能讓 bg 吃到 banner 這張背景圖。

```html
<section class="p-10 bg-banner">
  <div class="bg-primary">
    <p class="text-secondary font-robo italic">this is text</p>
  </div>
</section>
```

能夠自定義的 class 片段可以在 Tailwind 官網查到，格式寫法大部分都如同這篇的示範～

---

## 全域樣式

如果不寫在 extend 裡面，代表的是全域的自定義樣式，意義上和 extend 不太一樣，  
所以如果寫到 Tailwind 原本就有封裝的屬性，就會覆蓋過去，要特別注意這點。

```js
module.exports = {
	content: ["./src/**/*.{html,js}"],
	theme: {
		colors: {
			blue: "#1fb6ff",
	},
	fontFamily: {
		sans: ["Graphik", "sans-serif"],
		serif: ["Merriweather", "serif"],
	},
};
```

上面是稍微修改一下官方示範的部分，  
原本的 utility 就有 blue 這個顏色，所以這邊再定義一個 blue 的顏色就會覆蓋掉原本的，  
Tailwind 也很聰明，此時 blue-100 這樣後綴的數字都是基於覆蓋過後的顏色計算出來的，  
所以不用一個一個去重新定義色階的顏色哦！（除非你不喜歡它線性計算後的顏色）

---

## 核心設定

在安裝階段有設置一個 input.css 檔，該檔案所載入的正是 Tailwind 的核心功能：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

要編輯這些功能會用到 **@layer** 語法，以下示範。

## base

還記得 SASS 7-1 patterns 裡面會分出一個資料夾叫做「base」嗎？  
它們的意義是相似的，在 Tailwind 裡面 base 也掌管部分的全局樣式。

首先是此處必有 reset，Tailwind 採用 **modern-normalize** 的規範，  
modern-normalize 正如其名是從 normalize 延伸出來，移除一些過時樣式，  
而 [Preflight](https://tailwindcss.tw/docs/preflight)是 Tailwind 加工 modern-normalize 設計出來的基礎樣式。

因為功能性的標籤已經在 reset 階段移除所有屬性了，所以通常也會在 base 重新定義標籤。

既然都導入 Tailwind 了，應該會覺得這時候重新寫個 font-size: 48px 之類的原生 CSS，  
看起來好像笨笨的......沒錯，Tailwind 提供 **@apply** 語法，可以直接寫入 utility class：

```css
@layer base {
  h1 {
    @apply text-4xl font-bold;
  }
  h2 {
    @apply text-2xl font-bold;
  }
  a {
    @apply text-cyan-700 !important;
  }
}
```

額外提醒 !important 要寫在 @apply 後面才會強制作用（但我從來沒用過 important 去蓋樣式）。

---

## components

網頁上有重複的元件時（個人覺得用到三次以上就算有重複性），
可以在 components 封裝起來，語法如下：

```css
@layer components {
  .btn {
    @apply py-2 px-4 font-semibold rounded-lg shadow-md;
  }
}
```

在切割元件時我們也會希望遵守 OOCSS 的概念，  
結構性質（形狀、間距等）的屬性可以與外觀性質（顏色、字體粗細等）做分離，  
所以上面的按鈕範例並沒有把顏色相關的 class 一起封裝進去。  
後續使用時可以 class 補上顏色，重複使用 btn 同時也能做出各種顏色的按鈕，提高重用性。

開頭強調**重複的元件**是因為官方並不推薦無止境地封裝自己的樣式，  
首先要封裝就必須想 class 命名，這時候就會陷入手刻地獄的回憶了 QQ  
所以若非得已的話盡量在重複性比較高的情況下去封裝 components。

---

## utilities

Tailwind 已經將很多常用的屬性封裝好了，但還是會有落網之魚，  
像是官方示範的 content-visibility，或是它們沒有提供的組合模式，  
就可以自己在 utilities 封裝：

```css
@layer utilities {
  .content-auto {
    content-visibility: auto;
  }
}
```

封裝的時候也要記得 Atomic CSS 的原則，  
一個 class 僅代表一個屬性，盡量不要同時寫入很多屬性，  
不然這樣跟手刻就沒兩樣了 XD

---

## 參考資料

- [Get started with Tailwind CSS](https://tailwindcss.com/docs/installation)
- [Theme Configuration](https://tailwindcss.tw/docs/theme#extending-the-default-theme)
- [Configuration](https://tailwindcss.tw/docs/configuration)
- [@layer base/components/utilities](https://medium.com/@jelly771001/tailwind-layer-base-components-utilities-28c1e0652b7d)
