# utils-where

用于 web 的纯 js 工具库，原始输出用于最小集成，不包含任何其它依赖

为利用现代特性（例如 `?.` `??`）并提供最小体积，**既不包含语法转换也不包含 api polyfill**

## Install

```bash
npm install utils-where

or

yarn add utils-where
```

## API

### function

`serialize`  
将对象转换为类似 'a=1\&b=' 的 url 参数

```js
import { serialize } from 'utils-where';
// 或者在必要时使用 commonJS 风格：const {serialize} = require('utils-where')

// 结果是 'name=unknown&num=1&null=&undefined=&more=false'
serialize({
  name: 'unknown',
  num: 1,
  null: null,
  undefined: void 0,
  more: false
});
```

- type

```ts
serialize(obj: Obj): string;
```

`getPathValue`  
通过 a.b.c 这样的键路径在对象中获取值

```js
import { getPathValue } from 'utils-where';

const obj = {
  first: {
    second: {
      third: 3
    }
  }
};
// 结果是 3
getPathValue(obj, 'first.second.third');
// 使用泛型
getPathValue<3>(obj, 'first.second.third') === 3;
// 检查路径
getPathValue(obj, 'first.second.third', true) => {isValidKeys: true, validKeys: 'first.second.third', value: 3}
obj.first.second.third = 'str'
getPathValue<'str'>(obj, 'first.second.third', true) => {isValidKeys: true, validKeys: 'first.second.third', value: 'str'}
```

- type

```ts
serialize<T = any>(obj: Obj, keyPath: string, check: true): { isValidKeys: boolean; validKeys: string; value: T };
serialize<T = any>(obj: Obj, keyPath: string, check?: any): T;
```

`makeObjectByPath`  
通过 'a.b.c' 这样的键路径创建对象

```js
import { makeObjectByPath } from 'utils-where';

// 返回一个类似 {one: {two: {three: null}}} 的对象
const obj = makeObjectByPath('one.two.three', null);
obj => { one: { two: { three: null } } }

// 如果 keyPath 无效，返回空对象
makeObjectByPath('') => {}
```

- type

```ts
makeObjectByPath(keyPath: string, value?: any): Obj;
```

`setPathValue`  
通过 a.b.c 这样的键路径在对象中设置值

```js
import { setPathValue } from 'utils-where';

const obj = {
  one: {
    two: [3, {}]
  }
};
// 返回 true
setPathValue(obj, 'one.two.1.three', '');
obj.one.two[1].three === ''; // true

// 如果无法找到路径终点，返回 undefined
setPathValue(obj, 'one.two.four.five', []);
```

- type

```ts
setPathValue(obj: Obj, keyPath: string, value?: any): boolean;
```

`setClipboard` & `asyncCopy`  
同步或异步复制文本到剪贴板

```js
import { setClipboard, asyncCopy } from 'utils-where';

// 如果复制成功返回 true，失败返回 false
setClipboard('content to be copied');

// 异步复制
asyncCopy('xxx').then((res) => {
  // 如果复制成功 res 为 true
});
```

- type

```ts
setClipboard(val: string): boolean;
asyncCopy(val: string): Promise<void> | Promise<boolean>;
```

`sprintf`  
替换第一个字符串参数中的所有 `%s` 或 `{a.b}`，灵感来源于 es 的模板字符串 `${}`

```js
import { sprintf } from 'utils-where';

// 返回 'this is a demo and see'
sprintf('this %s a %s and see', 'is', 'demo');

// 返回 'a demo to show and see'
sprintf('a {first} to show and {second.txt}', {
  first: 'demo',
  second: {
    txt: 'see'
  }
});
```

- type

```ts
sprintf(str: string, ...args: (string | number)[] | [object]): string
```

`deepMerge`  
对象和数组的深度合并

```js
import { deepMerge } from 'utils-where';

const obj = {
  some: { nums: [1, 3, 5, 7, 9] },
  all: { ok: null }
};
deepMerge(obj, {
  some: { nums: ['', false] },
  all: { total: { to: 0 } }
});
/*
{
  some: { nums: ['', false, 5, 7, 9] },
  all: { ok: null, total: { to: 0 } }
}
*/
console.log(obj);

/* 返回 {
    a: {
        c: 1,
        nums: [ 7, { hi: 'hey', ok: 'ok' }, 9 ],
        d: 2
    }
}
*/
deepMerge(
  {
    a: { c: 1, nums: [6, { hi: 'hey' }] }
  },
  {
    a: { d: 2, nums: [7, { ok: 'ok' }, 9] }
  }
);

// 合并稀疏数组
// 返回 [1, 6, empty, 3]
deepMerge([, 2, ,], [1, 6, , 3]);
```

- type

```ts
deepMerge(target: Obj, source: Obj, skipHandle?: (key: string, target: Obj, from: any) => boolean | void): Obj;
```

`scroller`  
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

`toTopOrBottom`  
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

`delArrItem`  
通过索引移除数组项

```js
import { delArrItem } from 'utils-where';

// 移除索引 1,3 处的项。返回被移除的项 [5, {}]
delArrItem([null, 5, 'as', {}, false], [3, 1, 7]) => [5, {}]
```

- type

```ts
delArrItem(arr: any[], indexes: number[]): any[];
```

`delArrItemByVal`  
通过相等的值移除数组项

```js
import { delArrItemByVal } from 'utils-where';

// 移除与第二个参数中所有相同值的项。返回处理后的数组（第一个参数） [2, false]
delArrItemByVal([2, '', alert, console, false, NaN], ['', alert, console, NaN]) => [2, false]
```

`throttle`  
获取一个节流函数，它只在 `interval` 之后被**同步**调用。一个用于**异步**调用的 `onEnd` 监听器可以被添加到返回的函数上

```js
import { throttle } from 'utils-where';

const o = {
  click: throttle(() => {
    console.log(this);
    return 1;
  }, 1000),
  move: throttle(function () {
    console.log(this);
    return '';
  }, 500)
};
o.click() === 1; // 打印的 'this' 不是 o
o.move() === ''; // 打印的 'this' 是 o 本身

// 如果需要，添加一个结束监听器，在某些事件如 'mousemove' 中可能不需要。`onEnd` 在task队列中执行
const click = throttle(() => console.log(1), 500);
click.onEnd = () => console.log('the end call maybe unnecessary');
```

- type

```ts
throttle<T extends Func>(callback: T, interval: number): ThrottleWrap<T>
```

`debounceFirst`  
下一次调用将在上一次调用经过 `timeout` 后被**同步**触发

```js
import { debounceFirst } from 'utils-where';

// 至少 1 秒没有点击时触发
onclick = debounceFirst(() => console.log('1'), 1000);
```

结合使用 `debounceFirst` 和 `debounceLast` 可以实现视频播放器中常见的某些效果  
当光标移动时，它显示出来；如果停止移动约 2 秒，它就隐藏。

原始代码可能像这样

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

使用 debounceFirst & debounceLast

```js
import { debounceFirst, debounceLast } from 'utils-where';

const showCursor = debounceFirst(() => (document.body.style.cursor = ''), 2000),
  hideCursor = debounceLast(() => (document.body.style.cursor = 'none'), 2000);

// 或者使用 addEventListener
// addEventListener('mousemove', showCursor);
// addEventListener('mousemove', hideCursor);
onmousemove = () => {
  showCursor();
  hideCursor();
};
```

- type

```ts
debounceFirst<T extends Func>(callback: T, timeout: number): DebounceFirstWrap<T>
```

`debounceLast`  
每次调用总是在 `timeout` 之后被**异步**触发

```js
import { debounceLast } from 'utils-where';

// 调整窗口大小，停止调整 1 秒后才触发回调
onresize = debounceLast(() => console.log('only happens after 1s when stop'), 1000);

// 如果需要，使用 clearTimeout 停止下一次触发
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

`onlyify`  
源数组的去重

```js
import { onlyify } from 'utils-where';

// 需要根据 `same` id 去重的数组
const arr = [{ id: 1 }, { id: 2 }, { id: 1, num: 3 }];

// 获取一个仅包含 id 的数组: [{ id: 1 }, { id: 2 }]
onlyify(arr, (res, item) => res.every((e) => e.id !== item.id));

// 获取一个仅包含最后一个 id 的数组: [{ id: 2 }, { id: 1, num: 3 }]
onlyify(arr, (res, item) => arr.findLast((e) => e.id === item.id) === item && res.every((e) => e.id !== item.id));
```

- type

```ts
onlyify<T>(source: T[], compare: (result: T[], sourceItem: T) => boolean | void): T[]
```

`genUID`  
生成带有给定前缀的唯一 ID

```js
import { genUID } from 'utils-where';

// 获取一个不带前缀的随机数字 ID
genUID();

// 获取一个带前缀的唯一 ID，应为 'Some' + 小于 1000 的数字
genUID('Some', 1000);
```

- type

```ts
genUID(prefix?: string, level?: number, step?: number): string
```

`Emitter`  
获取一个事件触发器，支持泛型

```ts
import { Emitter } from 'utils-where';

// 事件触发器
const appEmitter = Emitter<{
  start: [() => void];
  end: (() => void)[];
}>();
appEmitter
  .on('start', console.log)
  .on('start', console.info)
  .once('end', () => console.log(2))
  .emit('end')
  .emit('start', null)
  .off('start', console.log);

const emitter = Emitter<{
  hi: [(m: string) => void];
  tell: ((t: boolean) => boolean)[];
}>();
emitter
  .once('hi', (s) => alert(s))
  .on('tell', (s) => !!s)
  .emit('hi')
  .emit('tell')
  .off('tell');
```

- type

```ts
interface Evt {
  [x: string]: ((...args: any[]) => any)[];
}
interface Emitter<T extends Evt> {
  evts: T;
  on<K extends keyof T>(name: K, func: T[K][number]): this;
  once<K extends keyof T>(name: K, func: T[K][number]): this;
  off<K extends keyof T>(name: K, func?: T[K][number]): this;
  emit(name: keyof T, ...args: any[]): this;
}
Emitter<T extends Evt>() => Emitter<T>
```

### custom Scrollbar

仅隐藏默认滚动条并渲染自定义滚动条以进行样式设置，基于 [`ResizeObserver`](<https://www.google.com/search?q=%5Bhttps://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver%23browser_compatibility%5D(https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver%23browser_compatibility)>)
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

- 和 Vue 单文件组件 (SFC)

```html
<template>
  <div class="custom" style="max-height: 50vh">
    <div :class="['scroller', 'fill', {scrollClass}]">
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

- 和 React 组件

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

### class

新的 `StoreXXX()` 的同步方法 "setVal()" 和 "save()" 只会改变 localStorage/indexedDB 一次（在 setTimeout 回调中）<br>
因此，像 `.setVal().setVal().save().save().setVal()` 这样的调用**只会修改本地存储一次**

`StoreSimply`  
使用 localStorage 的简单存储

```js
import { StoreSimply } from 'utils-where';

// localStorage[''] 类似于 {theme: 1, other: ''}
const GlobalIni = new StoreSimply('', { theme: 'auto', other: '' }).setVal('theme', 1);
// 移除 "other" 键，本地存储中的数据类似于 {theme: 1}
GlobalIni.setVal('other' /* undefined */); // 传递 undefined 效果相同
```

- type

```ts
StoreSimply<T extends object>(id?: string | null, data?: T): StoreSimply<T>
```

`StoreById`  
使用 localStorage 的对象形式存储

```ts
import { type SelfKeyPath, StoreById } from 'utils-where';

// localStorage.app 类似于 {theme: 1, head: {show: true, title: 0}, foot: {show: false, tip: 'xxx'}, {one: {two: {three: {four: null}}}}}
const ini = new StoreById('app', {
  theme: 0,
  head: {
    show: false
  }
})
  .setVal('head.show', true)
  .save({ theme: 1 })
  .setVal('foot.show', false)
  .save({ head: { title: 0 } })
  .save({
    foot: {
      tip: 'xxx'
    }
  })
  .setVal('one.two.three.four', null);
ini.getVal('foot.show') === ini.getVal<false>('foot.show');

new StoreById('app2', {
  custom: {
    lang: '',
    theme: 'light'
  }
})
  // 移除本地存储中的某个键
  .setVal('custom.theme' /* undefined */) // 传递 undefined 效果相同
  .save({
    custom: {
      lang: undefined // 此处需要 undefined
    }
  });

// 如果需要，检查键路径
type Config = {
  user: {
    id: string;
    pwd: string;
  };
  app: {
    theme: string;
  };
};
new StoreById<SelfKeyPath<Config>>().setVal('app.theme', '').getVal('user.id');
```

- type

```ts
StoreById<K extends string>(id?: string | null, data?: Obj): StoreById
```

`StoreByIDB`  
使用 indexedDB 的对象形式存储

```ts
import { type SelfKeyPath, StoreByIDB } from 'utils-where';

// 存储在 indexedDB 中
const d = new StoreByIDB();
d.onsuccess = () => {
  console.log(d.data);
  d.setVal('APP.ui.theme', 'auto')
    .setVal('login.agree.read', null)
    .setVal('login.agree.remember', true)
    .setVal('login.accnt', { id: 123, pwd: 'abc' });

  console.log(d.getVal('login.agree.read') === d.getVal<true>('login.agree.read')); // true
  // 移除本地存储中的键。如果此处没有 useJSON:true，则值在 indexedDB 中将是实际的 undefined
  d.setVal('login.agree.read', undefined, { useJSON: true });
};

// 如果需要，检查键路径
type Config = {
  user: {
    id: string;
    pwd: string;
  };
  app: {
    theme: string;
  };
};
const d = new StoreByIDB<SelfKeyPath<Config>>();
d.onsuccess = () => {
  d.setVal('app.theme', '').getVal('user.id');
};
```

- type

```ts
StoreByIDB<K extends string>(id?: string, table?: string | null, data?: Obj): StoreByIDB
```

`Countdown`  
纯 js 倒计时

```js
import { Countdown } from 'utils-where';

// 开始一个 1 分 20 秒的倒计时
new Countdown({ minute: 1, second: 20 }, false, ({ minute, second }) => {
  console.log(minute, second);
});

// 开始一个 1 小时的倒计时，但暂停，然后手动启动
const cd = new Countdown(new Date(Date.now() + 3600000), false, ({ day, hour, minute, second }) => {
  console.log(`days: ${day} hours: ${hour} minutes: ${minute} seconds: ${second}`);
});
cd.stop();
// 3 秒后启动。如果调用 cd.start(true)，它将在当前时间结束!!
setTimeout(() => cd.start(), 3000);

// 开始一个直到目标时间的倒计时，并且只在页面可见时运行
new Countdown(new Date(2030, 1, 1, 0, 0, 0), true, ({ day, hour, minute, second }) => {
  console.log(`left tims:${day} days ${hour} hours ${minute} minutes ${second} seconds`);
});
```

- integrated with vue

```jsx
import { ref, onBeforeUnmount, onDeactivated } from 'vue';
import { Countdown } from 'utils-where';

export default {
  props: {
    end: Number
  },
  setup(props, ctx) {
    const leftH = ref(),
      leftM = ref(),
      leftS = ref();
    const cd = new Countdown(new Date(Date.now() + props.end), false, ({ hour, minute, second }) => {
      leftH.value = hour;
      leftM.value = minute;
      leftS.value = second;
    });
    cd.stop();

    ctx.expose({ cd });

    onBeforeUnmount(() => {
      cd.remove();
    });
    onDeactivated(() => {
      cd.stop();
    });

    return () => (
      <p>
        {leftH.value}:{leftM.value}:{leftS.value}
      </p>
    );
  }
};
```

- integrated with react

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { Countdown } from 'utils-where';

export default function ({ end, run }) {
  const [leftH, setLeftH] = useState(0),
    [leftM, setLeftM] = useState(0),
    [leftS, setLeftS] = useState(0);

  const cdRef = useRef(null);

  useEffect(() => {
    if (!cdRef.current) {
      cdRef.current = new Countdown(new Date(Date.now() + end), false, ({ hour, minute, second }) => {
        setLeftH(hour);
        setLeftM(minute);
        setLeftS(second);
      });
      cdRef.current.stop();
    }

    return () => {
      cdRef.current.remove();
      cdRef.current = null;
    };
  }, []);

  useEffect(() => {
    cdRef.current[run ? 'start' : 'stop']();

    return () => {
      if (cdRef.current) {
        cdRef.current.remove();
        cdRef.current = null;
      }
    };
  }, [run]);

  return (
    <p>
      {leftH}:{leftM}:{leftS}
    </p>
  );
}
```

- type

```ts
Countdown(to: Date | Partial<dhms>, runOnVisible?: boolean, onCount?: onCount): Countdown
```

`Clock`  
纯 js 时钟

```js
import { Clock } from 'utils-where';

// 从现在开始每秒更新一次的时钟
const padZero = num => (num + '').padStart(2, '0')
new Clock(null, null or 1, false, ({year, month, day, week, hour, minute, second}, date) => {
 console.log(`now: ${year}-${month}-${padZero(day)} ${padZero(hour)}:${padZero(minute)}:${padZero(second)}`)
})

// 从 2000-01-01 00:00:00 开始每 5 秒更新一次，但暂停，需要手动启动
const clock = new Clock(new Date(2000, 0,1,0,0,0), 5, false, ({year, month, day, week, hour, minute, second}, date) => {})
clock.stop()

// 3 秒后启动。如果调用 clock.start(true)，它将从现在开始!!
setTimeout(() => clock.start(), 3000)

// 从给定时间开始每 60 秒更新一次的时钟，第一个参数，且只在页面可见时运行
new Clock(new Date(2000, 0,1,0,0,0), 60, true, (parts, date) => {
    console.log(date.toLocaleString())
})
```

- integrated with vue

```jsx
import { ref, onBeforeUnmount, onDeactivated } from 'vue';
import { Clock } from 'utils-where';

export default {
  setup(props, ctx) {
    const y = ref(),
      m = ref(),
      d = ref(),
      h = ref(),
      w = ref(),
      mn = ref(),
      s = ref();
    const ck = new Clock(null, 1, false, ({ year, month, day, week, hour, minute, second }) => {
      y.value = year;
      m.value = month;
      d.value = day;
      w.value = week;
      h.value = hour;
      mn.value = minute;
      s.value = second;
    });
    const padZero = (num) => (num + '').padStart(2, '0');

    onBeforeUnmount(() => {
      ck.remove();
    });
    onDeactivated(() => {
      ck.stop();
    });

    return () => (
      <p>
        {y.value}-{m.value}-{d.value} day of week: {w.value} &nbsp;&nbsp; {padZero(h.value)}:{padZero(m.value)}:
        {padZero(s.value)}
      </p>
    );
  }
};
```

- integrated with react

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'utils-where';

export default function ({ end, run }) {
  const [y, setY] = useState(),
    [m, setM] = useState(),
    [d, setD] = useState(),
    [h, setH] = useState(),
    [w, setW] = useState(),
    [mn, setMn] = useState(),
    [s, setS] = useState();

  const ckRef = useRef(null);
  const padZero = (num) => (num + '').padStart(2, '0');

  useEffect(() => {
    if (!ckRef.current) {
      ckRef.current = new Clock(null, 1, false, ({ year, month, day, week, hour, minute, second }) => {
        setY(year);
        setM(month);
        setD(day);
        setW(week);
        setH(hour);
        setMn(minute);
        setS(second);
      });
    }

    return () => {
      ckRef.current.remove();
      ckRef.current = null;
    };
  }, []);

  return (
    <p>
      {y}-{m}-{d} day of week: {w} &nbsp;&nbsp; {padZero(h)}:{padZero(mn)}:{padZero(s)}
    </p>
  );
}
```

- type

```ts
Clock(begin?: Date | null, step?: number, runOnVisible?: boolean, onUpdate?: onUpdate): Clock
```

### events

utils-where/events 使得在移动设备上支持 "longpress" 成为可能，不同于 contextmenu<br>
它通过 touchstart 和 touchend 模拟长按，**仅在 contextmenu 的行为不符合您的要求时才导入它！**

```js
import 'utils-where/events'; // 这将导入 utils-where/dist/esm/events.js 中的代码，然后像原始事件一样添加 "longpress"

const longPress = e => {
    console.log('the longpress event will happen after 500ms')
}
document.addEventListener('longpress', longPress)

// 移除监听器
document.removeEventListener('longpress', longPress)

// 通过节点的 _longPressDelay 更改超时时间
document._longPressDelay = 1000
document.addEventListener('longpress', e => {
    console.log('the longpress event will happen after 1000ms')
})

// 除非您真的需要，否则不要设置此属性！大多数情况下无需更改！
// "_longPressOption" 包含 EventInit 属性，它更改 longpress 事件的 bubbles, cancelable 和 composed
document._longPressOption: {
    bubbles: false,
    cancelable: false,
    composed: false
}
```

## License

MIT
