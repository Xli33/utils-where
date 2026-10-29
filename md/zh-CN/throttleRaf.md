## throttle

获取一个节流函数，通过 `requestAnimationFrame` 控制在每一帧中只同步调用一次

```ts
import { throttleRaf } from 'utils-where';

onmousemove = throttleRaf(() => {
  console.log('move by fps');
});
```

- type

```ts
throttleRaf<T extends Func>(callback: T): FuncWrap<T, { _rid?: number | null }>
```
