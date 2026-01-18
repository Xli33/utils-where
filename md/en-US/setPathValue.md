## setPathValue

set value in object with the key path like a.b.c

```js
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
```

- type

```ts
setPathValue(obj: Obj, keyPath: string, value?: any): boolean;
```
