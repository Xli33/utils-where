## debounceFirst

the next call will be **sync** triggerd after `timeout` the last call went by

```js
import { debounceFirst } from 'utils-where';

// not click for at least 1s and to be triggered
onclick = debounceFirst(() => console.log('1'), 1000);
```

use `debounceFirst` and `debounceLast` together to achieve some effect usually in video player  
when cursor moves, it shows as well, then it be hidden if it stops for about 2s.

the original code could be like

```js
let tid;
onmousemove = () => {
  clearTimeout(tid);
  if (!tid) {
    document.body.style.cursor = '';
    console.log('%cshow', 'font-size:15px');
  }
  tid = setTimeout(() => {
    tid = null;
    document.body.style.cursor = 'none';
    console.log('%chidden', 'font-size:15px;color:coral');
  }, 2000);
};
```

with debounceFirst & debounceLast

```js
import { debounceFirst, debounceLast } from 'utils-where';

const showCursor = debounceFirst(() => (document.body.style.cursor = ''), 2000),
  hideCursor = debounceLast(() => (document.body.style.cursor = 'none'), 2000);

// or use addEventListener
// addEventListener('mousemove', showCursor);
// addEventListener('mousemove', hideCursor);
onmousemove = () => {
  showCursor();
  hideCursor();
};
```

- type

```ts
interface DebounceFirstWrap<T extends Func> {
  (...args: Parameters<T>): ReturnType<T> | void;
  _tid?: number;
  flag?: true | null;
}

debounceFirst<T extends Func>(callback: T, timeout: number): DebounceFirstWrap<T>
```
