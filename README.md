# utils-where

English | [简体中文](README.zh-CN.md)

pure js utils for web, original output for minimal integration, without any dependency

taking advantage of modern features (e.g. `?.` `??`) and providing minimal size, **it contains neither syntax transformation nor api polyfill**  
Determine your backward compatibility needs according to your actual use case (e.g., using `vite`, or only adding polyfills through `core-js`).

## Install

```bash
npm install utils-where

or

yarn add utils-where
```

## API

### function

[serialize](./md/en-US/serialize.md)  
turn object into url param like 'a=1&b='

[getPathValue](./md/en-US/getPathValue.md)  
get value in object with the key path like a.b.c

[makeObjectByPath](./md/en-US/makeObjectByPath.md)  
make object from key path like 'a.b.c'

[setPathValue](./md/en-US/setPathValue.md)  
set value in object with the key path like a.b.c

[setClipboard&asyncCopy](./md/en-US/setClipboard.md)  
synchronously or asynchronously copy text to clipboard

[sprintf](./md/en-US/sprintf.md)  
replace all `%s` or `{a.b}` in first string param, inspired by template string `${}` from es

[deepMerge](./md/en-US/deepMerge.md)  
deep merge for object & array

[scroller](./md/en-US/scroller.md)  
smooth scroll content to target position

[toTopOrBottom](./md/en-US/toTopOrBottom.md)  
make scrollable element's content scroll to top/bottom

[delArrItem](./md/en-US/delArrItem.md)  
remove array items by indexes

[delArrItemByVal](./md/en-US/delArrItemByVal.md)  
remove array items by equal values

[throttle](./md/en-US/throttle.md)  
get a throttled function, only to be **sync** called after `interval`. an `onEnd` listener to be async called could be added to the returned function

[debounceFirst](./md/en-US/debounceFirst.md)  
the next call will be **sync** triggerd after `timeout` the last call went by

[debounceLast](./md/en-US/debounceLast.md)  
each call will be **async** triggerd always after `timeout`

[onlyify](./md/en-US/onlyify.md)  
deduplication for source array

[genUID](./md/en-US/genUID.md)  
generate a unique id with given prefix

[omitOwnKeys](./md/en-US/omitOwnKeys.md)  
return a new object excluding the specified own properties and non-enumerable properties  
or remove the specified own properties from the given object and return the given object

[polling](./md/en-US/polling.md)  
polls the callback and only continues the next poll after the function call

[Emitter](./md/en-US/Emitter.md)  
get an event emitter with generics

### [custom Scrollbar](./md/en-US/Scrollbar.md)

only hide the default scrollbars and render custom ones for styling, based on [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#browser_compatibility)  
**it's unnecessary to manually call `Scrollbar.init` in advance, but it'd be ok/better to do so if not style window/page**

### class

the synchronous "setVal()" and "save()" of new StoreXXX() only change localStorage/indexedDB once(in setTimeout callback)<br>
so call like `.setVal().setVal().save().save().setVal()` **modify local only once**

[StoreSimply](./md/en-US/StoreSimply.md)  
simple store with localStorage

[StoreById](./md/en-US/StoreById.md)  
store in object form with localStorage

[StoreByIDB](./md/en-US/StoreByIDB.md)  
store in object form with indexedDB

[Countdown](./md/en-US/Countdown.md)  
countdown in pure js

[Clock](./md/en-US/Clock.md)  
clock in pure js

### [events](./md/en-US/events.md)

utils-where/events makes it possible to support "longpress" on mobile, which differs from contextmenu<br>
it simulates longpress by touchstart and touchend, **only import it when the contextmenu doesn't work as u wish!**

## ~~type list~~(deprecated)

| ~~name~~ | ~~functionality~~ | ~~type~~ |
| :------: | :---------------: | :------: |
|          |                   |          |

| ~~class~~ | ~~functionality~~ | ~~type~~ |
| :-------: | :---------------: | :------: |
|           |                   |          |

## License

MIT
