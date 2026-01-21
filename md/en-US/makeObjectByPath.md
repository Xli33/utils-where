## makeObjectByPath

make object from key path like 'a.b.c'

```ts
import { makeObjectByPath } from 'utils-where';

// return an object like {one: {two: {three: null}}}
const obj = makeObjectByPath('one.two.three', null);
obj => { one: { two: { three: null } } }

// return empty object if keyPath is invalid
makeObjectByPath('') => {}

// special case: when a key is a string of dot connection, like { a: { 'b.c': [ { d: 1 } ] } }
makeObjectByPath('a.[b.c].d', 1) => { a: { 'b.c': { d: 1 } } }
```

- type

```ts
makeObjectByPath(keyPath: string, value?: any): Obj;
```
