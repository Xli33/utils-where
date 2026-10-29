## debounceLastRaf

获取一个防抖函数，通过 `requestAnimationFrame` 控制在每一帧中最多调用一次

```ts
import { debounceLastRaf } from 'utils-where';

// 让mousemove在每一帧最多触发一次
onmousemove = debounceLastRaf(() => console.log('only happens per rAF'));
```

- type

```ts
debounceLastRaf<T extends Func>(callback: T): FuncWrap<T, { _rid?: number | null }, void>
```
