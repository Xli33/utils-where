## toTopOrBottom

使可滚动元素的内容滚动到顶部/底部

```js
import { toTopOrBottom } from 'utils-where';

// 滚动页面到顶部，类似 window.scroll({top: 0, behavior: 'smooth'})
toTopOrBottom();
// 以 easeOut 过渡滚动页面到底部
toTopOrBottom(null, 'bottom', 'easeOut');
// 滚动某个元素
toTopOrBottom(document.querySelector('#list'), 'top' /* 'easeIn' */);
```

- type

```ts
toTopOrBottom(el?: Element, dir?: 'top' | 'bottom', type?: timingTypes, duration?: number): void;
```
