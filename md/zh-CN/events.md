## events

`utils-where/events` 使得在移动设备上支持 "longpress" 成为可能，不同于 contextmenu<br>
它通过 touchstart 和 touchend 模拟长按，**仅在 contextmenu 的行为不符合您的要求时才导入它！**

```ts
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
