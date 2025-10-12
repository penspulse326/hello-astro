---
title: '[元件] Controller'
description: 'NestJS 的 Controller 概念'
date: 2025-04-29 17:55:00
keywords: [程式語言, 後端框架, 設計模式, 物件導向, 依賴注入, JavaScript, TypeScript, NestJS, OOP, DI]
tags: ['筆記', 'NestJS']
slug: nestjs-controller
---

生成指令：

```bash
nest g controller <name>
```

## 路由

路由名稱會透過 `@Controller` 傳入元數據（metadata），  
在應用程式啟動時建立一個路由表並將這個元數據註冊進去，如：

```ts
@Controller('todos')
export class TodoController {}
```

`'todos'` 就會被註冊成可以存取的端點（endpoint）。

:::info
`@Controller` 也會被註冊到 DI Container 裡面。
:::

---

## 網路請求

controller 裡面必須使用網路請求相關的裝飾器才能正確存取路由，如：

```ts
@Controller('todos')
export class TodoController {
  @Get()
  getTodos() {
    return [];
  }
}
```

此時對 `/todos` 發送 GET 請求，會成功得到 status 為 200 的空陣列，  
這些存取路由的函式也叫做 `handler`。

---

## 子路由

子路由的概念也很直觀，直接在 `@Get` 裡面帶入字串，就可以生成一個端點，  
如在這個 controller 下面標記 `@Get('sub')`則表示，`/todos/sub` 會被捕捉，  
並執行 `getTodo`：

```ts
@Controller('todos')
export class TodoController {
  @Get()
  getTodos() {
    return [];
  }

  @Get('sub')
  getTodo() {
    return '這是子路由';
  }
}
```

### 裝飾器

`handler` 的參數可以用裝飾器來解析資料，如：

- `@Param`
- `@Query`
- `@Body`
- `@Header`

像上面的子路由，就可以透過 `@Param` 來解出：

```ts
// 解析 /todos/:id
@Get(':id')
getTodo(@Param() param: { id: string }) {
  return `這是 id 為 ${param.id} 的子路由`;
}

// 更簡短的寫法，不用取出整個物件
@Get(':id')
getTodo(@Param('id') id: string) {
  return `這是 id 為 ${id} 的子路由`;
}
```

`@Body` 可以解出 request body：

```ts
@Post()
createTodo(@Body() data: { content: string }) {
  const newTodo = {
    id: this.todos.length + 1,
    content: data.content,
  };

  this.todos.push(newTodo);

  return newTodo;
}
```

`@Query` 可以解出 query string：

```ts
// 解析 /todos?limit=3&offset=3
@Get()
getTodos(@Query('limit') limit?: string, @Query('offset') offset?: string) {
  if (!limit) {
    return this.todos;
  }

  if (!offset) {
    offset = '0';
  }

  const limitNum = parseInt(limit);
  const offsetNum = parseInt(offset);

  return this.todos.slice(offsetNum, offsetNum + limitNum);
}
```

以上是設計 API 必用的裝飾器的用法。

---

## 通用路由

可以透過符號（'\*\'、'?'、'+'）匹配特定的子路由，如：

```ts
// 這樣可以匹配 todos/bulk/goooooooood
@Get('bulk/goo*d')
getGood() {
  return '這是 /bulk 下面的通用路由 goo*d';
}
```

---

## HTTP Code

除了 POST 請求會回應 201 之外，其他方法預設都會回應 200，  
如果要自訂回傳的代號，可以使用 `@HttpCode` 裝飾器，並帶入內建的常數 `HttpStatus`：

```ts
@Get()
@HttpCode(HttpStatus.NO_CONTENT)
getTodos() {
  return [];
}
```

右鍵查看 `HttpStatus` 可以發現這些常數是 enum 資料，  
將常見的代號與基本含義都枚舉進去。

---

## 回應處理

有 3 種處理方式：

1. 標準模式
2. RxJS 模式
3. 函式庫模式

### 標準模式

標準模式支援同步和非同步，也是官方推薦的方式：

```ts
@Get()
getData() {
  return [];
}

// 被 setTimeout 延遲，會晚一點收到回應
@Get()
async getAsyncData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([]), 1000);
  })
}
```

### RxJS 模式

~~我不會 RxJS~~。

RxJS 可以回傳一個響應物件 `of`，如果沒有串上其他 RxJS 的串流任務的話，  
就會直接回傳資料：

```ts
@Get('data/rxjs')
getRxjsData() {
  return of([]);
}

// 使串流方法重新組織資料
@Get('data/rxjs')
getRxjsData() {
  return of(this.todos).pipe(
    map((todos) => todos.map((todo) => ({ ...todo, status: 'active' }))),
    catchError((err) => {
      console.error('Error occurred:', err);
      return of({ error: '獲取待辦事項失敗' });
    }),
  );
}
```

### 函式庫模式

可以從底層的服務來控制回應內容，需要在 handler 裡面加入裝飾器標記，  
如 `@Request`、`@Response`、`@Next`，對應到 Express 的 req, res, next：

```ts
@Get('data/lib')
getLibraryData(@Res() res: Response) {
  res.status(200).send('這是從 library 來的資料');
}
```

但就要自訂格式，並綁定特定底層服務（Express 或 Fastify），  
只有特定情境才會使用這種方法。

---

## 總結

controller 的功用大致等同 MVC 架構的 C，大部分的操作都需要用裝飾器取代，  
需要花點時間轉換，但只要記得 `裝飾器是一種函式`，給出對應的參數就能得到相應的操作，  
減少反覆宣告、賦值等等的程式碼。

---

## 參考資料

- [Controllers](https://docs.nestjs.com/controllers)
- [of](https://www.learnrxjs.io/learn-rxjs/operators/creation/of)
