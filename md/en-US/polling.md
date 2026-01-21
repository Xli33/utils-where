## polling

polls the callback and only continues the next poll after the function call

```ts
import { polling } from 'utils-where';

// polls the function every 2s
const cb = (arg1, arg2) => {
  console.log('polling', arg1, arg2);
};
const poller = polling(cb, 2000, 'arg1', 'arg2');
poller.run();
// stop after 5s
setTimeout(poller.stop(), 5000);

// pass custom callback, interval and args when calling `run`, which override the corresponding params from `polling(...args)`
const poller = polling();
poller.run(cb, 1000, 'arg1', 'arg2');
```

- type

```ts
polling(callback?: Func, interval?: number, ...args: any[]): {
    tid: TimeoutId | null;
    run(handle?: Func, handleInterval?: number, ...handleArgs: any[]): void;
    stop(): void;
}
```
