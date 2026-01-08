# polling

轮询传入的函数，仅在当次函数调用后才继续下次轮询

```js
import { polling } from 'utils-where';

// 每2秒执行一次cb
const cb = (arg1, arg2) => {
  console.log('polling', arg1, arg2);
};
const poller = polling(cb, 2000, 'arg1', 'arg2');
poller.run();
// 大约5秒后停止轮询
setTimeout(poller.stop(), 5000);

// 直接在`run`中传入对应参数，优先级高于`polling(...args)`所传参数
const poller = polling();
poller.run(cb, 1000, 'arg1', 'arg2');
```

- type

```ts
polling(callback?: Func, interval?: number, ...args: any[]): {
    tid: TimeoutId | null;
    run(handle?: Func, handleInterval?: number, ...handleArgs: any[]): void;
    stop(): void;
}
```
