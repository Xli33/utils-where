# makeObjectByPath

make object from key path like 'a.b.c'

```js
import { makeObjectByPath } from 'utils-where';

// return an object like {one: {two: {three: null}}}
const obj = makeObjectByPath('one.two.three', null);
obj => { one: { two: { three: null } } }

// return empty object if keyPath is invalid
makeObjectByPath('') => {}
```

- type

```ts
makeObjectByPath(keyPath: string, value?: any): Obj;
```
