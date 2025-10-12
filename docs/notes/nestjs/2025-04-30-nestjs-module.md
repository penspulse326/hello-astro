---
title: '[元件] Module'
description: 'NestJS 的 Module 概念'
date: 2025-04-30 17:55:00
keywords: [程式語言, 後端框架, 設計模式, 物件導向, 依賴注入, JavaScript, TypeScript, NestJS, OOP, DI]
tags: ['筆記', 'NestJS']
slug: nestjs-module
---

生成指令：

```bash
nest g module <name>
```

## 功能分類

NestJS 的基本架構是基於功能（ feature based）做分類，  
使用 CLI 生成 module 或是其他元件時，會建立一個 `name` 的資料夾，

module 生成後元數據是空的，需要自己填入，有以下選項可以填：

- controllers：註冊負責處理 HTTP 請求的 controller
- providers：註冊可以被依賴注入（DI）的 service、repository 等
- exports：將 provider 匯出，供其他 module 使用
- imports：匯入其他 module，匯入後就能使用其他 module 中有填入 `exports` 的 provider

```ts
@Module({
  controllers: [TodoController],
  providers: [TodoService],
  exports: [TodoService],
})
export class TodoModule {}
```

生成 module 之後，後續用 CLI 生成的元件都會自動寫入到 module 的元數據，
在 `controllers` 和 `providers` 中註冊進去的元件都會在載入 module 後實例化。

module 會規範好作用域，`controllers` 和 `providers` 只能填入該模組下的元件，  
否則會報錯，因為無法找到正確的依賴。

`exports` 可以將 module 下面的 service 匯出，在其他模組就可以用 `imports` 匯入，  
只要其中一個地方沒有做，在元件中要注入時會報錯：

```ts
// 這個 import 只是匯入類別的定義
import { CopyService } from 'src/copy/copy.service';

// NestJS 用 CopyService 這個標記去尋找依賴注入容器中的實例時會報錯
// 因為沒有在各自的 @Module 中定義 imports 或 exports
@Controller('todos')
export class TodoController {
  constructor(private readonly copyService: CopyService) {}

  @Get('copy')
  getCopy() {
    return this.copyService.getCopy();
  }
}
```

`imports` 與 `exports` 都要填上：

```ts
// 必須將 CopyService 填入 CopyModule 的 exports
@Module({
  //...
  exports: [CopyService],
})
export class CopyModule {}

// 必須在 TodoModule 的 imports 載入 CopyModule
@Module({
  //...
  imports: [CopyModule],
})
export class TodoModule {}
```

---

## 常用模組

如果是經常同時出現、互相綁定的模組，可以製作成常用模組（common module）一起匯出：

```ts
@Module({
  imports: [TodoModule, CopyModule],
  exports: [TodoModule, CopyModule],
})
export class CommonModule {}
```

---

## 全域模組

在 `@Module` 前加入 `@Global()`，就會被標記成全域模組，  
只要在根模組匯入之後，其他模組就可以不用再次匯入：

```ts
@Global()
@Module({
  imports: [TodoModule, CopyModule],
  exports: [TodoModule, CopyModule],
})
export class CommonModule {}
```

```ts
// 在根模組匯入
@Module({
  controllers: [AppController, TodoController],
  providers: [AppService],
  imports: [TestModule, CommonModule],
})
export class AppModule {}
```

在任意模組中使用時就不用在 `@Module` 裡面匯入：

```ts
import { Module } from '@nestjs/common';
import { TestController } from './test.controller';

@Module({
  controllers: [TestController],
  // 不用寫 imports
})
export class TestModule {}
```

依賴注入後就可以成功呼叫：

```ts
import { Controller, Get } from '@nestjs/common';
import { TodoService } from 'src/todo/todo.service';

@Controller('test')
export class TestController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getTest() {
    return this.todoService.getTodos();
  }
}
```

:::warning
大量使用的話也會有隱性耦合的問題。
:::

---

## 總結

Module 主要是限制該資料夾下所有元件的作用域，  
由 `imports` 和 `exports` 來決定 module 可以存取的元件。

---

## 參考資料

- [Exception filters](https://docs.nestjs.com/modules)
