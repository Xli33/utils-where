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

[view doc](https://xli33.github.io/utils-where)

### function

`serialize`  
turn object into url param like 'a=1&b='

`getPathValue`  
get value in object with the key path like a.b.c

`makeObjectByPath`  
make object from key path like 'a.b.c'

`setPathValue`  
set value in object with the key path like a.b.c

`setClipboard&asyncCopy`  
synchronously or asynchronously copy text to clipboard

`sprintf`  
replace all `%s` or `{a.b}` in first string param, inspired by template string `${}` from es

`deepMerge`  
deep merge for object & array

`scroller`  
smooth scroll content to target position

`toTopOrBottom`  
make scrollable element's content scroll to top/bottom

`delArrItem`  
remove array items by indexes

`delArrItemByVal`  
remove array items by equal values

`throttle`  
get a throttled function, only to be **sync** called after `interval`. an `onEnd` listener to be async called could be added to the returned function

`debounceFirst`  
the next call will be **sync** triggerd after `timeout` the last call went by

`debounceLast`  
each call will be **async** triggerd always after `timeout`

`onlyify`  
deduplication for source array

`genUID`  
generate a unique id with given prefix

`omitOwnKeys`  
return a new object excluding the specified own properties and non-enumerable properties  
or remove the specified own properties from the given object and return the given object

`polling`  
polls the callback and only continues the next poll after the function call

`saveFile`  
saves file to local

`Emitter`  
get an event emitter with generics

## custom Scrollbar

only hide the default scrollbars and render custom ones for styling, based on [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver#browser_compatibility)  
**it's unnecessary to manually call `Scrollbar.init` in advance, but it'd be ok/better to do so if not style window/page**

### class

the synchronous "setVal()" and "save()" of new StoreXXX() only change localStorage/indexedDB once(in setTimeout callback)<br>
so call like `.setVal().setVal().save().save().setVal()` **modify local only once**

`StoreSimply`  
simple store with localStorage

`StoreById`  
store in object form with localStorage

`StoreByIDB`  
store in object form with indexedDB

`Countdown`  
countdown in pure js

`Clock`  
clock in pure js

### events

`utils-where/events` makes it possible to support "longpress" on mobile, which differs from contextmenu<br>
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
