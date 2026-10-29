## debounceLastRaf

get a debounced function, only to be **async** called once in `requestAnimationFrame`

```ts
import { debounceLastRaf } from 'utils-where';

// let mousemove to be called only once per rAF
onmousemove = debounceLastRaf(() => console.log('only happens per rAF'));
```

- type

```ts
debounceLastRaf<T extends Func>(callback: T): FuncWrap<T, { _rid?: number | null }, void>
```
