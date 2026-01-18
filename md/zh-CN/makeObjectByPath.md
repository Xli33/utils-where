## makeObjectByPath

通过 'a.b.c' 这样的键路径创建对象

```js
import { makeObjectByPath } from 'utils-where';

// 返回一个类似 {one: {two: {three: null}}} 的对象
const obj = makeObjectByPath('one.two.three', null);
obj => { one: { two: { three: null } } }

// 如果 keyPath 无效，返回空对象
makeObjectByPath('') => {}
```

- type

```ts
makeObjectByPath(keyPath: string, value?: any): Obj;
```
