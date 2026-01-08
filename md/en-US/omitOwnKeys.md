# omitOwnKeys

return a new object excluding the specified own properties and non-enumerable properties  
or remove the specified own properties from the given object and return the given object

```js
import { omitOwnKeys } from 'utils-where';

// return a new object without removed attr 'b'
omitOwnKeys({ a: 1, b: 2 }, ['b'])

// remove attr 'a' in given object
omitOwnKeys<{ a: 1; b: 2 }, ['a']>({ a: 1, b: 2 }, ['a'], true)
```

- type

```ts
omitOwnKeys<T extends Obj, K extends ReadonlyArray<keyof T>>(obj: T, excludes: K, inSelf?: boolean): Omit<T, K[number]>
```
