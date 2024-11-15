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
import { serialize, getPathValue, setClipboard, sprintf } from 'utils-where'; // or use commonJS style if necessary: const {serialize} = require('utils-where')

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
| getPathValue | get some value in obj with the key path like a.b.c | ` (obj: Obj, keyPath: string) => any ` |
| backToTop | make scrollable element's content scroll to top | ` (selector?: string, step?: number, cb?: () => void) => void `|
| setClipboard | copy text to clipboard | ` (val: string) => boolean ` |
| sprintf | replace all %s or {a.b} in first param string | ` (...[str, ...args]: [string, ...(string \| number \| object)[]]): string ` |
| moveTo | move some item to other "index" in an array | ` (arr: any[], from: number, to: number): void ` |
| getScrollBarSize | get the scrollbar size | ` (force?: boolean): number ` |
| checkMobile | check phone number | ` (val: string, lazy?: boolean) => boolean ` |
| checkTel | check telephone number | ` (val: string) => boolean ` |
| checkMail | check email address | ` (val: string) => boolean ` |

## License

MIT
