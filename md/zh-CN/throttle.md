## throttle

获取一个节流函数，它只在 `interval` 之后被**同步**调用。一个用于**异步**调用的 `onEnd` 监听器可以被添加到返回的函数上

```ts
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
o.click() === 1; // 打印的 'this' 不是 o
o.move() === ''; // 打印的 'this' 是 o 本身

// 如果需要，添加一个结束监听器，在某些事件如 'mousemove' 中可能不需要。`onEnd` 在task队列中执行
const click = throttle(() => console.log(1), 500);
click.onEnd = () => console.log('the end call maybe unnecessary');
```

- type

```ts
throttle<T extends Func>(callback: T, interval: number): ThrottleWrap<T>
```
