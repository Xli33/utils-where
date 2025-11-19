# utils-where

English | [简体中文](README.zh-CN.md)

pure js utils for web, original output for minimal integration, without any dependency

taking advantage of modern features (e.g. `?.` `??`) and providing minimal size, **it contains neither syntax transformation nor api polyfill**

## Install

```bash
npm install utils-where

or

yarn add utils-where
```

## API

### function

`serialize`  
turn object into url param like 'a=1&b='

```js
import { serialize } from 'utils-where';
// or use commonJS style if necessary: const {serialize} = require('utils-where')

// result is 'name=unknown&num=1&null=&undefined=&more=false'
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
get value in object with the key path like a.b.c

```js
import { getPathValue } from 'utils-where';

const obj = {
  first: {
    second: {
      third: 3
    }
  }
};
// result is 3
getPathValue(obj, 'first.second.third');
// with generics
getPathValue<3>(obj, 'first.second.third') === 3;
// check the path
getPathValue(obj, 'first.second.third', true) => {isValidKeys: true, validKeys: 'first.second.third', value: 3}
obj.first.second.third = 'str'
getPathValue<'str'>(obj, 'first.second.third', true) => {isValidKeys: true, validKeys: 'first.second.third', value: 'str'}
```

- type

```ts
getPathValue<T = any>(obj: Obj, keyPath: string): T;
getPathValue<T = any>(obj: Obj, keyPath: string, check: false | undefined): T;
getPathValue<T = any>(obj: Obj, keyPath: string, check: true): { isValidKeys: boolean; validKeys: string; value: T };
```

`makeObjectByPath`  
make object from key path like 'a.b.c'

```js
import { makeObjectByPath } from 'utils-where';

// return an object like {one: {two: {three: null}}}
const obj = makeObjectByPath('one.two.three', null);
obj => { one: { two: { three: null } } }

// return empty object if keyPath is invalid
makeObjectByPath('') => {}
```

- type

```ts
makeObjectByPath(keyPath: string, value?: any): Obj;
```

`setPathValue`  
set value in object with the key path like a.b.c

```js
import { setPathValue } from 'utils-where';

const obj = {
  one: {
    two: [3, {}]
  }
};
// return true
setPathValue(obj, 'one.two.1.three', '');
obj.one.two[1].three === ''; // true

// return undefined if unable to find path end
setPathValue(obj, 'one.two.four.five', []);
```

- type

```ts
setPathValue(obj: Obj, keyPath: string, value?: any): boolean;
```

`setClipboard` & `asyncCopy`  
synchronously or asynchronously copy text to clipboard

```js
import { setClipboard, asyncCopy } from 'utils-where';

// result is true if copied or false if failed
setClipboard('content to be copied');

// copy asynchronously
asyncCopy('xxx').then((res) => {
  // res is true if copied
});
```

- type

```ts
setClipboard(val: string): boolean;
asyncCopy(val: string): Promise<void> | Promise<boolean>;
```

`sprintf`  
replace all `%s` or `{a.b}` in first string param, inspired by template string `${}` from es

```js
import { sprintf } from 'utils-where';

// return 'this is a demo and see'
sprintf('this %s a %s and see', 'is', 'demo');

// return 'a demo to show and see'
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
deep merge for object & array

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

/* return {
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

// merge on sparse arrays
// return [1, 6, empty, 3]
deepMerge([, 2, ,], [1, 6, , 3]);
```

- type

```ts
deepMerge(target: Obj, source: Obj, skipHandle?: (key: string, target: Obj, from: any) => boolean | void): Obj;
```

`scroller`  
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

`toTopOrBottom`  
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

`delArrItem`  
remove array items by indexes

```js
import { delArrItem } from 'utils-where';

// remove items at index 1,3. return the removed [5, {}]
delArrItem([null, 5, 'as', {}, false], [3, 1, 7]) => [5, {}]
```

- type

```ts
delArrItem(arr: any[], indexes: number[]): any[];
```

`delArrItemByVal`  
remove array items by equal values

```js
import { delArrItemByVal } from 'utils-where';

// remove all same items from second param. return the handled array(first param) [2, false]
delArrItemByVal([2, '', alert, console, false, NaN], ['', alert, console, NaN]) => [2, false]
```

`throttle`  
get a throttled function, only to be **sync** called after `interval`. an `onEnd` listener to be async called could be added to the returned function

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
o.click() === 1; // the logged 'this' is not o
o.move() === ''; // the logged 'this' is o itself

// add an end listener if need, maybe unnecessary in some events like 'mousemove'. and `onEnd` is in task queue
const click = throttle(() => console.log(1), 500);
click.onEnd = () => console.log('the end call maybe unnecessary');
```

- type

```ts
throttle<T extends Func>(callback: T, interval: number): ThrottleWrap<T>
```

`debounceFirst`  
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
debounceFirst<T extends Func>(callback: T, timeout: number): DebounceFirstWrap<T>
```

`debounceLast`  
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

`onlyify`  
deduplication for source array

```js
import { onlyify } from 'utils-where';

// the array to be deduplicated with `same` id
const arr = [{ id: 1 }, { id: 2 }, { id: 1, num: 3 }];

// get an array within only id: [{ id: 1 }, { id: 2 }]
onlyify(arr, (res, item) => res.every((e) => e.id !== item.id));

// get an array within only id at last: [{ id: 2 }, { id: 1, num: 3 }]
onlyify(arr, (res, item) => arr.findLast((e) => e.id === item.id) === item && res.every((e) => e.id !== item.id));
```

- type

```ts
onlyify<T>(source: T[], compare: (result: T[], sourceItem: T) => boolean | void): T[]
```

`genUID`  
generate a unique id with given prefix

```js
import { genUID } from 'utils-where';

// get a random number id without prefix
genUID();

// get a unique id with prefix, should be 'Some' + number less than 1000
genUID('Some', 1000);
```

- type

```ts
genUID(prefix?: string, level?: number, step?: number): string
```

`Emitter`  
get an event emitter with generics

```ts
import { Emitter } from 'utils-where';

// event emitter
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

### class

the synchronous "setVal()" and "save()" of new StoreXXX() only change localStorage/indexedDB once(in setTimeout callback)<br>
so call like `.setVal().setVal().save().save().setVal()` **modify local only once**

`StoreSimply`  
simple store with localStorage

```js
import { StoreSimply } from 'utils-where';

// localStorage[''] be like {theme: 1, other: ''}
const GlobalIni = new StoreSimply('', { theme: 'auto', other: '' }).setVal('theme', 1);
// remove the "other" key and the data in local store be like {theme: 1}
GlobalIni.setVal('other' /* undefined */); // same as passing undefined
```

- type

```ts
StoreSimply<T extends object>(id?: string | null, data?: T): StoreSimply<T>
```

`StoreById`  
store in object form with localStorage

```ts
import { type SelfKeyPath, StoreById } from 'utils-where';

// localStorage.app be like {theme: 1, head: {show: true, title: 0}, foot: {show: false, tip: 'xxx'}, {one: {two: {three: {four: null}}}}}
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
  // remove some key in local store
  .setVal('custom.theme' /* undefined */) // same as passing undefined
  .save({
    custom: {
      lang: undefined // undefined is needed here
    }
  });

type Config = {
  user: {
    id: string;
    pwd: string;
  };
  app: {
    theme: string;
  };
};

// get the actual type of `data` when u need access to it
new StoreById<Config>().data.user;

// check keypath if necessary
new StoreById<Config, SelfKeyPath<Config>>().setVal('app.theme', '').getVal('user.id');
```

- type

```ts
StoreById<T extends Obj = Obj, K extends string = string>(id?: string | null, data?: T): StoreById<T, K>
```

`StoreByIDB`  
store in object form with indexedDB

```ts
import { type SelfKeyPath, StoreByIDB } from 'utils-where';

// store in indexedDB
const d = new StoreByIDB();
d.onsuccess = () => {
  console.log(d.data);
  d.setVal('APP.ui.theme', 'auto')
    .setVal('login.agree.read', null)
    .setVal('login.agree.remember', true)
    .setVal('login.accnt', { id: 123, pwd: 'abc' });

  console.log(d.getVal('login.agree.read') === d.getVal<true>('login.agree.read')); // true
  // remove key in local store. if no useJSON:true here, the value will be actual undefined in indexedDB
  d.setVal('login.agree.read', undefined, { useJSON: true });
  // or just set `undefined`
  d.setVal('login.agree.read');
};

type Config = {
  user: {
    id: string;
    pwd: string;
  };
  app: {
    theme: string;
  };
};

// get the actual type of `data` when u need access to it
const d = new StoreByIDB<Config>();
d.onsuccess = () => {
  d.data.user;
};

// check keyPath if necessary
const d = new StoreByIDB<Config, SelfKeyPath<Config>>();
d.onsuccess = () => {
  d.setVal('app.theme', '').getVal('user.id');
};
```

- type

```ts
StoreByIDB<T extends Obj = Obj, K extends string = string>(id?: string, table?: string | null, data?: T): StoreByIDB<T, K>
```

`Countdown`  
countdown in pure js

```js
import { Countdown } from 'utils-where';

// start a countdown in 1 min & 20 seconds
new Countdown({ minute: 1, second: 20 }, false, ({ minute, second }) => {
  console.log(minute, second);
});

// start a countdown in 1 hour but paused, then start it manually
const cd = new Countdown(new Date(Date.now() + 3600000), false, ({ day, hour, minute, second }) => {
  console.log(`days: ${day} hours: ${hour} minutes: ${minute} seconds: ${second}`);
});
cd.stop();
// start in 3s. if call cd.start(true), it ends at current time!!
setTimeout(() => cd.start(), 3000);

// start a countdown till the target time and only run when page visible
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
clock in pure js

```js
import { Clock } from 'utils-where';

// start a clock updating every second from now
const padZero = num => (num + '').padStart(2, '0')
new Clock(null, null or 1, false, ({year, month, day, week, hour, minute, second}, date) => {
 console.log(`now: ${year}-${month}-${padZero(day)} ${padZero(hour)}:${padZero(minute)}:${padZero(second)}`)
})

// start from 2000-01-01 00:00:00 and updates every 5s, but paused to manually start
const clock = new Clock(new Date(2000, 0,1,0,0,0), 5, false, ({year, month, day, week, hour, minute, second}, date) => {})
clock.stop()

// start in 3s. if call clock.start(true), it will start from now!!
setTimeout(() => clock.start(), 3000)

// start a clock updating every 60 seconds from given time, the first param and only run when page visible
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

utils-where/events makes it possible to support "longpress" on mobile, which differs from contextmenu<br>
it simulates longpress by touchstart and touchend, **only import it when the contextmenu doesn't work as u wish!**

```js
import 'utils-where/events'; // this will import code from utils-where/dist/esm/events.js, and then add the "longpress" just like original event

const longPress = e => {
    console.log('the longpress event will happen after 500ms')
}
document.addEventListener('longpress', longPress)

// remove the listener
document.removeEventListener('longpress', longPress)

// change the timeout by node's _longPressDelay
document._longPressDelay = 1000
document.addEventListener('longpress', e => {
    console.log('the longpress event will happen after 1000ms')
})

// do not set this prop unless u really need! mostly it's needless to change!
// the "_longPressOption" consists of EventInit props, which changes bubbles, cancelable and composed of longpress event
document._longPressOption: {
    bubbles: false,
    cancelable: false,
    composed: false
}
```

## ~~type list~~(deprecated)

| ~~name~~ | ~~functionality~~ | ~~type~~ |
| :------: | :---------------: | :------: |
|          |                   |          |

| ~~class~~ | ~~functionality~~ | ~~type~~ |
| :-------: | :---------------: | :------: |
|           |                   |          |

## License

MIT
