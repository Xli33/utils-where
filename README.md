# utils-where
a util of js for web

## Install
```
npm install utils-where

or

yarn add utils-where
``` 

## Usage
```
import { serialize, getPathValue, setClipboard, sprintf, makeObjectByPath, setPathValue, deepMerge, scroller, toTopOrBottom } from 'utils-where'; 
// or use commonJS style if necessary: const {serialize} = require('utils-where')

// result is 'name=unknown&num=1&null=&undefined=&more=false'
serialize({
    name: 'unknown',
    num: 1,
    null: null,
    undefined: void 0,
    more: false
})

// result is 3
const obj = {
    first: {
        second: {
            third: 3
        }
    }
}
getPathValue(obj, 'first.second.third')

// result is true if copied or false if failed
setClipboard('content to be copied')

// the sprintf is inspired by template string `${}` from es6
sprintf('this %s a %s and see', 'is', 'demo') // return 'this is a demo and see'
sprintf('a {first} to show and {second.txt}', {
    first: 'demo',
    second: {
        txt: 'see'
    }
}) // return 'a demo to show and see'

// return an object like {one: {two: {three: null}}}
makeObjectByPath('one.two.three', null)

// return true
setPathValue({one: {two: [3, {}]}}, 'one.two.1.three', '')

// return {a: {b: {c: 1, d: 2}}}
deepMerge({a: { b: {c: 1} }}, {a: {b: { d: 2 }}})

// try the element's smooth scroll
scroller({
    top: 0
})
// try other smooth scroll, done in 500ms
scroller({
    top: 0,
    duration: 500,
    type: 'easeOut'
})

// scroll page to top, like window.scroll({top: 0, behavior: 'smooth'})
toTopOrBottom()
// scroll page to bottom with easeOut transition
toTopOrBottom(null, 'bottom', 'easeOut')
```

### class
```
import {StoreSimply, StoreById, StoreByIDB, CountDown, Clock} from 'utils-where';

// result in localStorage[''] = {theme: 1}
new StoreSimply('', {theme: 'auto'}).setVal('theme', 1).getVal('theme') === 1

// localStorage.app = {theme: 1, head: {show: true, title: 0}, foot: {show: false, tip: 'xxx'}, {one: {two: {three: {four: null}}}}}
new StoreById('app', {
    theme: 0,
    head: {
        show: false
    }
}).setVal('head.show', true).save({theme: 1})
  .setVal('foot.show', false).save({head: {title: 0}})
  .save({
    foot: {
        tip: 'xxx'
    }
  }).setVal('one.two.three.four', null)

// store in indexedDB
const d = new StoreByIDB()
d.onsuccess = () => {
    console.log(d.data)
    d.setVal('APP.ui.theme', 'auto').setVal('login.agree.read', true).get('login.agree.read')
}
```

utils-where/events makes it possible to support "longpress" on mobile, which differs from contextmenu<br>
it simulates longpress by touchstart, **only import it when contextmenu doesn't work well**
```
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
| moveTo | move some item to other "index" in an array | ` (arr: any[], from: number, to: number) => void ` |
| getScrollBarSize | get the scrollbar size | ` (force?: boolean) => number ` |
| deepMerge | deep merge for object & array | ` (target: Obj, source: Obj, skipHandle?: (key: string, target: Obj, from: any) => boolean \| void) => Obj ` |
| checkMobile | check phone number | ` (val: string, lazy?: boolean) => boolean ` |
| checkTel | check telephone number | ` (val: string) => boolean ` |
| checkMail | check email address | ` (val: string) => boolean ` |

| class | functionality | type
| :--: | :--: | :--: |
| StoreSimply | simple store with localStorage | ` constructor(id?: string \| null, data?: T) ` |
| StoreById | store in object form with localStorage | ` constructor(id?: string \| null, data?: Obj) ` |
| StoreByIDB | store in object form with indexedDB | ` constructor(id?: string, table?: string \| null, data?: Obj) ` |
| CountDown | countdown in pure js | ` constructor(to: Date \| Partial<dhms>, runOnVisible?: boolean, onCount?: onCount) ` |
| Clock | clock in pure js | ` constructor(begin?: Date \| null, step?: number, runOnVisible?: boolean, onUpdate?: onUpdate) ` |


## License

MIT
