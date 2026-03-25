# utils-where

用于 web 的纯 js 工具库，原始输出用于最小集成，不包含任何其它依赖

为利用现代特性（例如 `?.` `??`）并提供最小体积，**既不包含语法转换也不包含 api polyfill**  
请自行按实际情况决定是否要向下兼容（如使用打包工具像 `vite`，或单独使用 `core-js` 添加 polyfill）

## 安装

```bash
npm install utils-where

or

yarn add utils-where
```

## API

[view doc](https://xli33.github.io/utils-where/index_zh-CN.html)

### function

`serialize`  
将对象转换为类似 'a=1\&b=' 的 url 参数

`getPathValue`  
通过 a.b.c 这样的键路径在对象中获取值

`makeObjectByPath`  
通过 'a.b.c' 这样的键路径创建对象

`setPathValue`  
通过 a.b.c 这样的键路径在对象中设置值

`setClipboard&asyncCopy`  
同步或异步复制文本到剪贴板

`sprintf`  
替换第一个字符串参数中的所有 `%s` 或 `{a.b}`，灵感来源于 es 的模板字符串 `${}`

`deepMerge`  
对象和数组的深度合并

`scroller`  
平滑滚动内容到目标位置

`toTopOrBottom`  
使可滚动元素的内容滚动到顶部/底部

`delArrItem`  
通过索引移除数组项

`delArrItemByVal`  
通过相等的值移除数组项

`throttle`  
获取一个节流函数，它只在 `interval` 之后被**同步**调用。一个用于**异步**调用的 `onEnd` 监听器可以被添加到返回的函数上

`debounceFirst`  
下一次调用将在上一次调用经过 `timeout` 后被**同步**触发

`debounceLast`  
每次调用总是在 `timeout` 之后被**异步**触发

`onlyify`  
源数组的去重

`genUID`  
生成带有给定前缀的唯一 ID

`omitOwnKeys`  
返回不含指定自有属性及不可枚举属性的新对象，或剔除给定对象的指定自有属性并返回该对象

`polling`  
轮询传入的函数，仅在当次函数调用后才继续下次轮询

`saveFile`  
保存文件到本地

`Emitter`  
获取一个事件触发器，支持泛型

### custom Scrollbar

仅隐藏默认滚动条并渲染自定义滚动条以进行样式设置，基于 [`ResizeObserver`](<https://www.google.com/search?q=%5Bhttps://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver%23browser_compatibility%5D(https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver%23browser_compatibility)>)  
**不必提前手动调用 `Scrollbar.init`，但如果不为窗口/页面设置样式，提前调用 `init` 会更好/更佳**

### class

新的 `StoreXXX()` 的同步方法 "setVal()" 和 "save()" 只会改变 localStorage/indexedDB 一次（在 setTimeout 回调中）<br>
因此，像 `.setVal().setVal().save().save().setVal()` 这样的调用**只会修改本地存储一次**

`StoreSimply`  
使用 localStorage 的简单存储

`StoreById`  
使用 localStorage 的对象形式存储

`StoreByIDB`  
使用 indexedDB 的对象形式存储

`Countdown`  
纯 js 倒计时

`Clock`  
纯 js 时钟

### events

`utils-where/events` 使得在移动设备上支持 "longpress" 成为可能，不同于 contextmenu<br>
它通过 touchstart 和 touchend 模拟长按，**仅在 contextmenu 的行为不符合您的要求时才导入它！**

## License

MIT
