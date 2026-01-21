## omitOwnKeys

返回不含指定自有属性及不可枚举属性的新对象，或剔除给定对象的指定自有属性并返回该对象

```ts
import { omitOwnKeys } from 'utils-where';

// 返回一个不含属性 b 的新对象
omitOwnKeys({ a: 1, b: 2 }, ['b']);

// 直接去除给定对象的属性 a
omitOwnKeys<{ a: 1; b: 2 }, ['a']>({ a: 1, b: 2 }, ['a'], true);
```

- type

```ts
omitOwnKeys<T extends Obj, K extends ReadonlyArray<keyof T>>(obj: T, excludes: K, inSelf?: boolean): Omit<T, K[number]>
```
