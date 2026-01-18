## throttle

get a throttled function, only to be **sync** called after `interval`. an `onEnd` listener to be async called could be added to the returned function

```js
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
o.click() === 1; // the logged 'this' is not o
o.move() === ''; // the logged 'this' is o itself

// add an end listener if need, maybe unnecessary in some events like 'mousemove'. and `onEnd` is in task queue
const click = throttle(() => console.log(1), 500);
click.onEnd = () => console.log('the end call maybe unnecessary');
```

- type

```ts
throttle<T extends Func>(callback: T, interval: number): ThrottleWrap<T>
```
