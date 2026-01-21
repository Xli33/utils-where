## setPathValue

通过 a.b.c 这样的键路径在对象中设置值

```ts
import { setPathValue } from 'utils-where';

const obj = {
  one: {
    two: [3, {}]
  }
};
// 返回 true
setPathValue(obj, 'one.two.1.three', '');
obj.one.two[1].three === ''; // true

// 如果无法找到路径终点，返回 undefined
setPathValue(obj, 'one.two.four.five', []);

// 特殊情况：某层key本身是点连接的字符串，如 { a: { 'b.c': [ { d: 1 } ] } }
const obj2 = { a: { 'b.c': [ { d: 1 } ] } }
setPathValue(obj2, 'a.[b.c].0.d', 2) => true
obj2.a['b.c'][0].d === 2 // true
```

- type

```ts
setPathValue(obj: Obj, keyPath: string, value?: any): boolean;
```
