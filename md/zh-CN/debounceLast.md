## debounceLast

每次调用总是在 `timeout` 之后被**异步**触发

```js
import { debounceLast } from 'utils-where';

// 调整窗口大小，停止调整 1 秒后才触发回调
onresize = debounceLast(() => console.log('only happens after 1s when stop'), 1000);

// 如果需要，使用 clearTimeout 停止下一次触发
addEventListener(
  'resize',
  debounceLast(() => {
    clearTimeout(onresize._tid);
    console.log('cleared');
  }, 999)
);
```

- type

```ts
interface DebounceLastWrap<T extends Func> {
  (...args: Parameters<T>): void;
  _tid?: number;
}

debounceLast<T extends Func>(callback: T, timeout: number): DebounceLastWrap<T>
```
