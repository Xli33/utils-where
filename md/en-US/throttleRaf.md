## throttle

get a throttled function, only to be **sync** called once per rAF

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
