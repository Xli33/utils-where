# debounceLast

each call will be **async** triggerd always after `timeout`

```js
import { debounceLast } from 'utils-where';

// resize window and callback triggered only after 1s when stop resizing
onresize = debounceLast(() => console.log('only happens after 1s when stop'), 1000);

// use clearTimeout to stop the next trigger if necessary
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
debounceLast<T extends Func>(callback: T, timeout: number): DebounceLastWrap<T>
```
