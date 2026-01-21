## events

utils-where/events makes it possible to support "longpress" on mobile, which differs from contextmenu<br>
it simulates longpress by touchstart and touchend, **only import it when the contextmenu doesn't work as u wish!**

```ts
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
