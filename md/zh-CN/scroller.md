# scroller

平滑滚动内容到目标位置

```js
import { scroller } from 'utils-where';

// 尝试元素的平滑滚动
scroller({
  top: 0
});
// 滚动 element[id=list]
scroller({
  el: document.querySelector('#list'),
  top: 0
});
// 尝试其他平滑滚动，在 500ms 内完成
scroller({
  top: 0,
  duration: 500,
  type: 'easeOut'
});
// 滚动 element[id=list]
scroller({
  el: document.querySelector('#list'),
  top: 0,
  duration: 500,
  type: 'easeOut'
});
```

- type

```ts
scroller({ el, duration, top, left, type }: { el?: Element; duration?: number; top?: number; left?: number; type?: timingTypes; }): void;
```
