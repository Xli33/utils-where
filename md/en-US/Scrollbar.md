## custom Scrollbar

only hide the default scrollbars and render custom ones for styling, based on [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#browser_compatibility)  
**it's unnecessary to manually call `Scrollbar.init` in advance, but it'd be ok/better to do so if not style window/page**

- used for page/window

```html
<!-- add class scroller for <html> -->
<html class="scroller">
  <body>
    <script>
      // call attach without param
      Scrollbar.attach();
    </script>
  </body>
</html>
```

- used for some HTMLElement

```html
<div style="width:200px;height:300px">
  <!-- scrollable container, required class "scroller". and class "fill" for inheriting height/min-height/max-height -->
  <div class="scroller fill">
    <!-- the content, maybe a list -->
    <div id="list"></div>
  </div>
</div>

<script>
  // then call Scrollbar.attach
  Scrollbar.attach(document.getElementById('list'));
</script>
```

- integrated with others like Vue

```js
// in main.js
import { Scrollbar } from 'utils-where';
import { createApp } from 'vue'
import App from './App.vue'

call 'Scrollbar.attach()' if style window, or only call 'Scrollbar.init()' in advance if not style window, which would be better for performance

createApp(App).mount('#app')
```

- and vue sfc

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

- integrated with others like react

```jsx
// in main.js
import { Scrollbar } from 'utils-where';
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

call 'Scrollbar.attach()' if style window, or only call 'Scrollbar.init()' in advance if not style window, which would be better for performance

const app = createRoot(document.getElementById('app'));

app.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- and react component

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
