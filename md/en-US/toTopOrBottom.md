## toTopOrBottom

make scrollable element's content scroll to top/bottom

```js
import { toTopOrBottom } from 'utils-where';

// scroll page to top, like window.scroll({top: 0, behavior: 'smooth'})
toTopOrBottom();
// scroll page to bottom with easeOut transition
toTopOrBottom(null, 'bottom', 'easeOut');
// scroll some element
toTopOrBottom(document.querySelector('#list'), 'top' /* 'easeIn' */);
```

- type

```ts
toTopOrBottom(el?: Element, dir?: 'top' | 'bottom', type?: timingTypes, duration?: number): void;
```
