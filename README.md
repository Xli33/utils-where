# utils-where

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

`getPathValue`

```ts
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

`makeObjectByPath`

```js
import { makeObjectByPath } from 'utils-where';

// return an object like {one: {two: {three: null}}}
const obj = makeObjectByPath('one.two.three', null);
obj => { one: { two: { three: null } } }

// return empty object if keyPath is invalid
makeObjectByPath('') => {}
```

`setPathValue`

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

`setClipboard` & `asyncCopy`

```js
import { setClipboard, asyncCopy } from 'utils-where';

// result is true if copied or false if failed
setClipboard('content to be copied');

// copy asynchronously
asyncCopy('xxx').then((res) => {
  // res is true if copied
});
```

`sprintf`

```js
import { sprintf } from 'utils-where';

// the sprintf is inspired by template string `${}` from es6
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

`deepMerge`

```js
import { deepMerge } from 'utils-where';

const obj = {
  some: {
    nums: [1, 3, 5, 7, 9]
  },
  all: {
    ok: null
  }
};
deepMerge(obj, {
  some: {
    nums: ['', false]
  },
  all: {
    total: {
      to: 0
    }
  }
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
    a: {
      c: 1,
      nums: [6, { hi: 'hey' }]
    }
  },
  {
    a: {
      d: 2,
      nums: [7, { ok: 'ok' }, 9]
    }
  }
);
// merge on sparse arrays
// return [1, 6, empty, 3]
deepMerge([, 2, ,], [1, 6, , 3]);
```

`scroller`

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

`toTopOrBottom`

```js
import { toTopOrBottom } from 'utils-where';

// scroll page to top, like window.scroll({top: 0, behavior: 'smooth'})
toTopOrBottom();
// scroll page to bottom with easeOut transition
toTopOrBottom(null, 'bottom', 'easeOut');
// scroll some element
toTopOrBottom(document.querySelector('#list'), 'top' /* 'easeIn' */);
```

`delArrItem`

```js
import { delArrItem } from 'utils-where';

// remove items at index 1,3. return the removed [5, {}]
delArrItem([null, 5, 'as', {}, false], [3, 1, 7]);
```

`Emitter`

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

### custom Scrollbar

only hide the default scrollbars and render custom ones for styling, based on [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#browser_compatibility)  
**it's unnecessary to manually call `Scrollbar.init` in advance, but it'd be ok/better to do so if not style window/page**

- for page/window

```html
<!-- add class scroller for <html> -->
<html class="scroller">
  <body>
    <script>
      <!-- call attach without param -->
      Scrollbar.attach();
    </script>
  </body>
</html>
```

- for some HTMLElement

```html
<div style="width:200px;height:300px">
  <!-- scrollable container, required class "scroller". and class "fill" for inheriting height/min-height/max-height -->
  <div class="scroller fill">
    <!-- the content, maybe a list -->
    <div id="list"></div>
  </div>
</div>

<!-- then call Scrollbar.attach -->
<script>
  Scrollbar.attach(document.getElementById('list'));
</script>
```

- for others like Vue

```js
// in main.js
import { Scrollbar } from 'utils-where';
import { createApp } from 'vue'
import App from './App.vue'

call 'Scrollbar.attach()' if style window, or only call 'Scrollbar.init()' in advance if not style window, which would be better for performance

createApp(App).mount('#app')
```

- vue sfc

```html
<template>
  <div class="custom">
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

### class

the synchronous "setVal()" and "save()" of new StoreXXX() only change localStorage/indexedDB once(in setTimeout callback)<br>
so call like `.setVal().setVal().save().save().setVal()` **modify local only once**

`StoreSimply`

```js
import { StoreSimply } from 'utils-where';

// localStorage[''] be like {theme: 1, other: ''}
const GlobalIni = new StoreSimply('', { theme: 'auto', other: '' }).setVal('theme', 1);
// remove the "other" key and the data in local store be like {theme: 1}
GlobalIni.setVal('other' /* undefined */); // same as passing undefined
```

`StoreById`

```ts
import { StoreById } from 'utils-where';

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
```

`StoreByIDB`

```ts
import { StoreByIDB } from 'utils-where';

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
};
```

`Countdown`

```js
import { Countdown } from 'utils-where';

// start a countdown in 1 min & 20 seconds
new Countdown({ minute: 1, second: 20 }, false, ({ minute, second }) => {
  console.log(minute, second);
});
// start a countdown till the target time and only run when page visible
new Countdown(new Date('2030-01-01 12:00:00'), true, ({ day, hour, minute, second }) => {
  console.log(`left tims:${day} days ${hour} hours ${minute} minutes ${second} seconds`);
});
```

`Clock`

```js
import { Clock } from 'utils-where';

// start a clock updating every second from now
const padZero = num => (num + '').padStart(2, '0')
new Clock(null, null or 1, false, ({year, month, day, week, hour, minute, second}, date) => {
 console.log(`now: ${year}-${month}-${padZero(day)} ${padZero(hour)}:${padZero(minute)}:${padZero(second)}`)
})
// start a clock updating every 60 seconds from given time, the first param and only run when page visible
new Clock(new Date('2000-01-01 00:00:00'), 60, true, (parts, date) => {
    console.log(date.toLocaleString())
})
```

### events

utils-where/events makes it possible to support "longpress" on mobile, which differs from contextmenu<br>
it simulates longpress by touchstart and touchend, **only import it when the contextmenu doesn't work as u wish!**

```js
import 'utils-where/events'; // this will import code from utils-where/dist/esm/events.js, and then use the "longpress" just like original event

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

## type list

|       name       |                     functionality                      |                                                         type                                                          |
| :--------------: | :----------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------: |
|    serialize     |         turn object into url param like a=1&b=         |                                                `(obj: Obj) => string`                                                 |
| makeObjectByPath |         make object from keypath like 'a.b.c'          |                                        `(keyPath: string, value?: any) => Obj`                                        |
|   getPathValue   |     get value in obj with the key path like a.b.c      | `<T = any>(obj: Obj, keyPath: string, check?: boolean) => T \| { isValidKeys: boolean; validKeys: string; value: T }` |
|   setPathValue   |     set value in obj with the key path like a.b.c      |                                 `(obj: Obj, keyPath: string, value?: any) => boolean`                                 |
|     scroller     |        smooth scroll content to target position        |            `({el?: Element; duration?: number; top?: number; left?: number; type?: timingTypes;}) =>void`             |
|  toTopOrBottom   | make scrollable element's content scroll to top/bottom |         `(el?: Element, dir: 'top' \| 'bottom' = 'top', type?: timingTypes, duration: number = 500) => void`          |
|   setClipboard   |                 copy text to clipboard                 |                                              `(val: string) => boolean`                                               |
|     sprintf      |     replace all %s or {a.b} in first param string      |                     `(...[str, ...args]: [string, ...(string \| number \| object)[]]) => string`                      |
|   moveArrItem    |      move some item to other "index" in an array       |                                   `(arr: any[], from: number, to: number) => any[]`                                   |
| getScrollBarSize |                 get the scrollbar size                 |                                             `(force?: boolean) => number`                                             |
|    deepMerge     |             deep merge for object & array              |      `(target: Obj, source: Obj, skipHandle?: (key: string, target: Obj, from: any) => boolean \| void) => Obj`       |
|    checkMail     |                  check email address                   |                                              `(val: string) => boolean`                                               |
|    delArrItem    |       remove items by given indexes in an array        |                                      `(arr: any[], indexes: number[]) => any[]`                                       |
|     Emitter      |                  get an event emitter                  |                                       `Emitter<T extends Evt>() => Emitter<T>`                                        |
|    Scrollbar     |       render a custom scrollbar for HTMLElement        |         `{disabled: boolean;watchPageStyle: boolean \| null;attach: (el?: HTMLElement \| null) => CustomBar}`         |

<br>

|    class    |             functionality              |                                              type                                               |
| :---------: | :------------------------------------: | :---------------------------------------------------------------------------------------------: |
| StoreSimply |     simple store with localStorage     |                          `constructor(id?: string \| null, data?: T)`                           |
|  StoreById  | store in object form with localStorage |                         `constructor(id?: string \| null, data?: Obj)`                          |
| StoreByIDB  |  store in object form with indexedDB   |                 `constructor(id?: string, table?: string \| null, data?: Obj)`                  |
|  Countdown  |          countdown in pure js          |       `constructor(to: Date \| Partial<dhms>, runOnVisible?: boolean, onCount?: onCount)`       |
|    Clock    |            clock in pure js            | `constructor(begin?: Date \| null, step?: number, runOnVisible?: boolean, onUpdate?: onUpdate)` |

## License

MIT
