---
title: '[元件] Exception'
description: 'NestJS 的 Exception 概念'
date: 2025-05-02 17:55:00
keywords: [程式語言, 後端框架, 設計模式, 物件導向, 依賴注入, JavaScript, TypeScript, NestJS, OOP, DI]
tags: ['筆記', 'NestJS']
slug: nestjs-exception
---

錯誤處理器（Exception Filter）也是一種元件，可以透過 `HttpException` 這個類別，  
建立一個拋回 response 物件。

只要是用 `HttpException` 建立或繼承出來的實例，  
都會被內建的錯誤處理器捕捉。

## 標準 exception

直接建立一個 `HttpException` 實例並 throw，可以帶入自訂訊息和回應代號：

```ts
@Get('test-standard-exception')
getStandardException() {
  throw new HttpException('這是標準的 exception', HttpStatus.BAD_REQUEST);
}
```

得到：

```json
{
  "statusCode": 400,
  "message": "這是標準的 exception"
}
```

自訂訊息的位置也可以改為物件，來取代預設的格式：

```ts
@Get('test-standard-exception')
getStandardException() {
  const customExceptionObj = {
    code: HttpStatus.BAD_REQUEST,
    msg: '這是自訂格式的標準 exception',
  };

  throw new HttpException(customExceptionObj, HttpStatus.BAD_REQUEST);
}
```

```json
{
  "code": 400,
  "msg": "這是自訂格式的標準 exception"
}
```

---

## 內建 exception

可以直接選擇要實例化哪一個代號的 exception，  
該類別的名稱等同於 `HttpStatus` 各個狀態的名稱，如 `new BadRequestException`：

```ts
@Get('test-built-in-exception')
getBuiltInException() {
  throw new UnauthorizedException('這是內建的 unauthorized exception');
}
```

回應會多了 `error` 這個欄位描述這個 exception，以及自動帶入指定的 http code：

```json
{
  "message": "這是內建的 unauthorized exception",
  "error": "Unauthorized",
  "statusCode": 401
}
```

一樣可以自訂格式：

```ts
@Get('test-built-in-exception')
getBuiltInException() {
  const customExceptionObj = {
    code: HttpStatus.UNAUTHORIZED,
    msg: '這是自訂格式的 unauthorized exception',
  };

  throw new UnauthorizedException(customExceptionObj);
}
```

```json
{
  "code": 401,
  "msg": "這是自訂格式的 unauthorized exception"
}
```

---

## 自訂 exception

錯誤處理器也可以自己生成：

```
nest g filter filter/http
```

初始架構是一個帶有 `@Catch` 裝飾器的類別，泛型 T 可以改寫成我們要實作的類型：

```ts
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class HttpFilter<T> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
```

假設我要做一個捕捉 http 請求的 filter，就會在 `@Catch` 傳入 `HttpException`，  
並拓展泛型 T，確保稍後 `exception` 能夠存取 `HttpException` 的屬性和方法：

```ts
@Catch(HttpException)
export class HttpFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {}
}
```

### ArgumentsHost

host 本身是一個類別，它是由 `ArgumentsHost` 來定義不同架構來源的介面（interface），  
如 `RESTful API`、`RPC`、`WebSocket`，因為這些架構的參數內容不太一樣，  
所以可以透過封裝好的方法來取得對應參數：

```ts
catch(exception: T, host: ArgumentsHost) {
  // getType 可以知道是什麼架構，並根據對應架構撰寫邏輯
  console.log(host.getType()); // 'http' | 'rpc' | 'ws'

  // 使用 switchToHttp 轉換架構內容，並指定型別為 HttpArgumentsHost
  const httpCtx: HttpArgumentsHost = host.switchToHttp();

  // 取出 response 並指定為 Express 的 Response
  const response = httpCtx.getResponse<Response>();
  const message = exception.getResponse();
  const statusCode = exception.getStatus();

  const responseBody = {
    code: statusCode,
    message: message,
    timestamp: new Date().toISOString(),
  };

  // 同 Express 的 router，接上 .json 直接拋出回應
  response.status(statusCode).json(responseBody);
}
```

`ArgumentsHost` 的定義檔裡面包含了這一系列的介面，  
像 `HttpArgumentsHost` 就是很標準的 3 個老朋友：

```ts
export interface HttpArgumentsHost {
  /**
   * Returns the in-flight `request` object.
   */
  getRequest<T = any>(): T;
  /**
   * Returns the in-flight `response` object.
   */
  getResponse<T = any>(): T;
  getNext<T = any>(): T;
}
```

:::warning
ArgumentsHost 的 getResponse 是 HTTP 物件，exception 的 getResponse 是繼承自 HttpException，內容是被捕捉到的錯誤提示物件。
:::

---

### 部分套用

使用 `@UseFilter` 標注在 controller 的方法上就可以套用指定的 filter：

```ts
@UseFilters(HttpFilter)
@Get('test-http-filter')
getHttpFilterException() {
  throw new UnprocessableEntityException('這是自訂格式的 422 錯誤');
}
```

也可以標注在 `@Controller` 上，讓整個 controller 都套用：

```ts
@UseFilters(HttpFilter)
@Controller()
export class AppController {
  //...
}
```

---

### 全域套用

可以在根模組進行注入（推薦）：

```ts
@Module({
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpFilter,
    },
  ],
})
export class AppModule {}
```

:::warning
注入的 token 名稱必須是 APP_FILTER 才能全域套用。
:::

或是在啟動函式裡面呼叫 `useGlobalFilters` 並傳入一個 filter 的實例後套用：

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 建立實例
  app.useGlobalFilters(new HttpFilter());
  await app.listen(process.env.PORT ?? 3000);
}
```

---

### 格式修正

目前的套用方式會得到這樣的回應：

```json
{
  "code": 422,
  "message": {
    "message": "這是自訂格式的 422 錯誤",
    "error": "Unprocessable Entity",
    "statusCode": 422
  },
  "timestamp": "2025-05-05T04:05:51.714Z"
}
```

外層的 message 被塞入的是內建的 exception 資料，所以需要調整 `getResponse` 的判斷，  
`exception.getResponse()` 的型別是 `string | object`：

```ts
const message = (() => {
  const res = exception.getResponse();

  if (typeof res === 'string') {
    return res;
  }

  // 暫時斷言型別
  return (res as { message: string }).message;
})();
```

這樣 throw 出去的 exception 參數進到 HttpFilter 後就會進行上面的判斷，  
傳入字串就會直接把字串當成 message 的值，傳入物件就取出物件裡面的 message 作為值：

```ts
@Get('test-http-filter')
getHttpFilterException() {
  // 不傳任何東西
  throw new UnprocessableEntityException();
}
```

不傳任何東西，預設會 throw 出內建的 exception 格式，  
此時就會帶出 422 exception 的 `message`：

```json
{
  "code": 422,
  "message": "Unprocessable Entity",
  "timestamp": "2025-05-05T07:00:13.501Z"
}
```

傳入字串：

```ts
@Get('test-http-filter')
getHttpFilterException() {
  // 傳入字串
  throw new UnprocessableEntityException('這是自訂格式的 422 錯誤');
}
```

回應：

```json
{
  "code": 422,
  "message": "這是自訂格式的 422 錯誤",
  "timestamp": "2025-05-05T07:05:36.365Z"
}
```

因為剛剛修正 `getResponse` 時沒有做額外的型別檢查，所以回應會取不出來 message：

```ts
@Get('test-http-filter')
getHttpFilterException() {
  // 傳一個空物件
  throw new UnprocessableEntityException({});
}
```

回應：

```json
{
  "code": 422,
  "timestamp": "2025-05-05T07:12:10.939Z"
}
```

---

## 總結

一般來說內建的 exception 只要能訂出回應的物件型別，已經能應付大多情境，  
接入外部的服務或是 `ValidationPipe` 產生的報錯，如果也需要被固定在統一格式的話，  
就會需要自訂的 exception filter 來實現邏輯判斷，這樣也會讓前後端比較容易對照。

---

## 參考資料

- [Exception filters](https://docs.nestjs.com/exception-filters)
