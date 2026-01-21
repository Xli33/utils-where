## setPathValue

set value in object with the key path like a.b.c

```ts
import { setPathValue } from 'utils-where';

const obj = {
  one: {
    two: [3, {}]
  }
};
// return true
setPathValue(obj, 'one.two.1.three', '');
obj.one.two[1].three === ''; // true

// return undefined if unable to find path end
setPathValue(obj, 'one.two.four.five', []);

// special case: when a key is a string of dot connection, like { a: { 'b.c': [ { d: 1 } ] } }
const obj2 = { a: { 'b.c': [ { d: 1 } ] } }
setPathValue(obj2, 'a.[b.c].0.d', 2) => true
obj2.a['b.c'][0].d === 2 // true
```

- type

```ts
setPathValue(obj: Obj, keyPath: string, value?: any): boolean;
```
