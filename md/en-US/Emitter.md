## Emitter

get an event emitter with generics

```ts
import { Emitter } from 'utils-where';

// event emitter
const appEmitter = Emitter<{
  start: [() => void];
  end: (() => void)[];
}>();
appEmitter
  .on('start', console.log)
  .on('start', console.info)
  .once('end', () => console.log(2))
  .emit('end')
  .emit('start', null)
  .off('start', console.log);

const emitter = Emitter<{
  hi: [(m: string) => void];
  tell: ((t: boolean) => boolean)[];
}>();
emitter
  .once('hi', (s) => alert(s))
  .on('tell', (s) => !!s)
  .emit('hi')
  .emit('tell')
  .off('tell');
```

- type

```ts
interface Evt {
  [x: string]: ((...args: any[]) => any)[];
}

interface Emitter<T extends Evt> {
  evts: T;
  on<K extends keyof T>(name: K, func: T[K][number]): this;
  once<K extends keyof T>(name: K, func: T[K][number]): this;
  off<K extends keyof T>(name: K, func?: T[K][number]): this;
  emit(name: keyof T, ...args: any[]): this;
}

Emitter<T extends Evt>() => Emitter<T>
```
