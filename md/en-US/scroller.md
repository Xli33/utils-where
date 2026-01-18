## scroller

smooth scroll content to target position

```js
import { scroller } from 'utils-where';

// try the element's smooth scroll
scroller({
  top: 0
});
// scroll element[id=list]
scroller({
  el: document.querySelector('#list'),
  top: 0
});
// try other smooth scroll, done in 500ms
scroller({
  top: 0,
  duration: 500,
  type: 'easeOut'
});
// scroll element[id=list]
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
