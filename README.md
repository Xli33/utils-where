# utils-where
a pack of pure js utils for web, original output, clean & simple, without any extra dependencies

## Install
```
npm install utils-where

or

yarn add utils-where
``` 

## Usage

### function
```js
import { serialize, getPathValue, setClipboard, sprintf, makeObjectByPath, setPathValue, deepMerge, scroller, toTopOrBottom, delArrItem, Emitter } from 'utils-where'; 
// or use commonJS style if necessary: const {serialize} = require('utils-where')

// result is 'name=unknown&num=1&null=&undefined=&more=false'
serialize({
    name: 'unknown',
    num: 1,
    null: null,
    undefined: void 0,
    more: false
})

const obj = {
    first: {
        second: {
            third: 3
        }
    }
}
// result is 3
getPathValue(obj, 'first.second.third')

// result is true if copied or false if failed
setClipboard('content to be copied')

// the sprintf is inspired by template string `${}` from es6
// return 'this is a demo and see'
sprintf('this %s a %s and see', 'is', 'demo')
// return 'a demo to show and see'
sprintf('a {first} to show and {second.txt}', {
    first: 'demo',
    second: {
        txt: 'see'
    }
})

// return an object like {one: {two: {three: null}}}
makeObjectByPath('one.two.three', null)

const obj = {
    one: {
        two: [3, {}]
    }
}
// return true 
setPathValue(obj, 'one.two.1.three', '')
obj.one.two[1].three === '' // true

/* return {
    a: {
        b: {
            c: 1,
            nums: [
                7,
                {
                    hi: 'hey',
                    ok: 'ok'
                },
                9
            ],
            d: 2
        }
    }
}
*/
deepMerge({
    a: { 
        b: {
            c: 1,
            nums: [6,{
                hi: 'hey'
            }]
        } 
    }
}, {
    a: {
        b: {
            d: 2,
            nums: [7, {
                ok: 'ok'
            }, 9]
        }
    }
})
// merge on sparse arrays
// return [1, 6, empty, 3]
deepMerge([,2,,],[1,6,,3])

// try the element's smooth scroll
scroller({
    top: 0
})
// scroll element[id=list]
scroller({
    el: document.querySelector('#list'),
    top: 0
})
// try other smooth scroll, done in 500ms
scroller({
    top: 0,
    duration: 500,
    type: 'easeOut'
})
// scroll element[id=list]
scroller({
    el: document.querySelector('#list'),
    top: 0,
    duration: 500,
    type: 'easeOut'
})

// scroll page to top, like window.scroll({top: 0, behavior: 'smooth'})
toTopOrBottom()
// scroll page to bottom with easeOut transition
toTopOrBottom(null, 'bottom', 'easeOut')
// scroll some element
toTopOrBottom(document.querySelector('#list'), 'top', /* 'easeIn' */)

// remove items at index 1,3, 5 and {}. return [5, {}]
delArrItem([null, 5, 'as', {}, false], [3, 1, 7])

// event emitter
const emitter = Emitter<{
  hi: [(m: string) => void]
  tell: ((t: boolean) => boolean)[]
 }>()
emitter
  .once('hi', (s) => alert(s))
  .on('tell', (s) => !!s)
  .emit('hi')
  .emit('tell')
  .off('tell')
```

### class
the synchronous "setVal()" and "save()" of new StoreXXX() only change localStorage/indexedDB once(in setTimeout callback)<br>
so `.setVal().setVal().save().save().setVal()` modify local only once
```js
import {StoreSimply, StoreById, StoreByIDB, Countdown, Clock} from 'utils-where';

// localStorage[''] be like {theme: 1, other: ''}
const GlobalIni = new StoreSimply('', {theme: 'auto', other: ''})
    .setVal('theme', 1)
// remove the "other" key and the data in local store be like {theme: 1}
GlobalIni.setVal('other', undefined)

// localStorage.app be like {theme: 1, head: {show: true, title: 0}, foot: {show: false, tip: 'xxx'}, {one: {two: {three: {four: null}}}}}
new StoreById('app', {
    theme: 0,
    head: {
        show: false
    }
}).setVal('head.show', true)
  .save({theme: 1})
  .setVal('foot.show', false)
  .save({head: {title: 0}})
  .save({
    foot: {
        tip: 'xxx'
    }
  }).setVal('one.two.three.four', null)
// remove some key in local store
new StoreById('app2', {
    custom: {
        lang: '',
        theme: 'light'
    }
}).setVal('custom.theme', undefined)
  .save({
    custom: {
        lang: undefined
    }
  })

// store in indexedDB
const d = new StoreByIDB()
d.onsuccess = () => {
  console.log(d.data)
  const read = d.setVal('APP.ui.theme', 'auto')
                .setVal('login.agree.read', true)
                .getVal('login.agree.read')
  console.log(read) // true
  // remove key in local store
  d.setVal('login.agree.read', undefined, {useJSON: true})
}

// start a countdown in 1 min & 20 seconds
new Countdown({minute: 1, second: 20}, false, ({minute, second}) => {
    console.log(minute, second)
})
// start a countdown till the target time and only run when page visible
new Countdown(new Date('2030-01-01 12:00:00'), true, ({day, hour, minute, second}) => {
    console.log(`left tims:${day} days ${hour} hours ${minute} minutes ${second} seconds`)
})

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

## API

| name | functionality | type
| :--: | :--: | :--: |
| serialize | turn object into url param like a=1&b= | ` (obj: Obj) => string ` |
| makeObjectByPath | make object from keypath like 'a.b.c' | ` (keyPath: string, value?: any) => Obj ` |
| getPathValue | get value in obj with the key path like a.b.c | ` (obj: Obj, keyPath: string, check?: boolean) => any ` |
| setPathValue | set value in obj with the key path like a.b.c | ` (obj: Obj, keyPath: string, value?: any) => boolean ` |
| scroller | smooth scroll content to target position | ` ({el?: Element; duration?: number; top?: number; left?: number; type?: timingTypes;}) => void ` |
| toTopOrBottom | make scrollable element's content scroll to top/bottom | ` (el?: Element, dir: 'top' \| 'bottom' = 'top', type?: timingTypes, duration: number = 500) => void `|
| setClipboard | copy text to clipboard | ` (val: string) => boolean ` |
| sprintf | replace all %s or {a.b} in first param string | ` (...[str, ...args]: [string, ...(string \| number \| object)[]]) => string ` |
| moveArrItem | move some item to other "index" in an array | ` (arr: any[], from: number, to: number) => any[] ` |
| getScrollBarSize | get the scrollbar size | ` (force?: boolean) => number ` |
| deepMerge | deep merge for object & array | ` (target: Obj, source: Obj, skipHandle?: (key: string, target: Obj, from: any) => boolean \| void) => Obj ` |
| checkMail | check email address | ` (val: string) => boolean ` |
| delArrItem | remove items by given indexes in an array | ` (arr: any[], indexes: number[]) => any[] ` |
| Emitter | get an event emitter | ` Emitter<T extends Evt>() => Emitter<T> ` |

<br>

| class | functionality | type
| :--: | :--: | :--: |
| StoreSimply | simple store with localStorage | ` constructor(id?: string \| null, data?: T) ` |
| StoreById | store in object form with localStorage | ` constructor(id?: string \| null, data?: Obj) ` |
| StoreByIDB | store in object form with indexedDB | ` constructor(id?: string, table?: string \| null, data?: Obj) ` |
| Countdown | countdown in pure js | ` constructor(to: Date \| Partial<dhms>, runOnVisible?: boolean, onCount?: onCount) ` |
| Clock | clock in pure js | ` constructor(begin?: Date \| null, step?: number, runOnVisible?: boolean, onUpdate?: onUpdate) ` |


## License

MIT
