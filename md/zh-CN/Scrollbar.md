## custom Scrollbar

仅隐藏默认滚动条并渲染自定义滚动条以进行样式设置，基于 [`ResizeObserver`](<https://www.google.com/search?q=%5Bhttps://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver%23browser_compatibility%5D(https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver%23browser_compatibility)>)<br>
**不必提前手动调用 `Scrollbar.init`，但如果不为窗口/页面设置样式，这样做会更好/更佳**

- 用于页面/窗口

```html
<html class="scroller">
  <body>
    <script>
      // 不带参数调用 attach
      Scrollbar.attach();
    </script>
  </body>
</html>
```

- 用于某些 HTMLElement

```html
<div style="width:200px;height:300px">
  <div class="scroller fill">
    <div id="list"></div>
  </div>
</div>

<script>
  // 然后调用 Scrollbar.attach
  Scrollbar.attach(document.getElementById('list'));
</script>
```

- 与其他框架（如 Vue）集成

```js
// 在 main.js 中
import { Scrollbar } from 'utils-where';
import { createApp } from 'vue'
import App from './App.vue'

如果对窗口设置样式，请调用 'Scrollbar.attach()'；如果不对窗口设置样式，仅提前调用 'Scrollbar.init()'，这会更利于性能

createApp(App).mount('#app')
```

- 具体 Vue SFC

```vue
<template>
  <div class="custom" style="max-height: 50vh">
    <div :class="['scroller', 'fill', { scrollClass }]">
      <div ref="list">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Scrollbar } from 'utils-where';
import { useTemplateRef, onMounted } from 'vue';

defineProps(['scrollClass']);
const $list = useTemplateRef('list');

onMounted(() => {
  Scrollbar.attach($list.value);
});
</script>
```

- 与其他框架（如 React）集成

```jsx
// 在 main.js 中
import { Scrollbar } from 'utils-where';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

如果对窗口设置样式，请调用 'Scrollbar.attach()'；如果不对窗口设置样式，仅提前调用 'Scrollbar.init()'，这会更利于性能

const app = createRoot(document.getElementById('app'));

app.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- 具体 React 组件

```jsx
import { Scrollbar } from 'utils-where';
import React, { useRef, useEffect } from 'react';

export default function ({ scrollClass, children }) {
  const listRef = useRef();

  useEffect(() => {
    if (listRef.current) {
      Scrollbar.attach(listRef.current);
    }
  }, []);

  return (
    <div className="custom" style={{ height: '60vh' }}>
      <div className={`scroller fill ${scrollClass || ''}`}>
        <div ref={listRef}>{children}</div>
      </div>
    </div>
  );
}
```

- type

```ts
Scrollbar: {
  disabled: boolean;
  clearSelection: boolean | null;
  stopSelect: boolean | null;
  watchPageStyle: boolean | null;
  syncPos: boolean | null;
  attach: (el?: HTMLElement | null) => this;
  init?: () => void;
}
```
