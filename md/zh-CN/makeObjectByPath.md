## makeObjectByPath

通过 'a.b.c' 这样的键路径创建对象

```ts
import { makeObjectByPath } from 'utils-where';

// 返回一个类似 {one: {two: {three: null}}} 的对象
const obj = makeObjectByPath('one.two.three', null);
obj => { one: { two: { three: null } } }

// 如果 keyPath 无效，返回空对象
makeObjectByPath('') => {}

// 特殊情况：某层key本身是点连接的字符串，如 { a: { 'b.c': [ { d: 1 } ] } }
makeObjectByPath('a.[b.c].d', 1) => { a: { 'b.c': { d: 1 } } }
```

- type

```ts
makeObjectByPath(keyPath: string, value?: any): Obj;
```
