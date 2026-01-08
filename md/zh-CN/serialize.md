# serialize

将对象转换为类似 'a=1\&b=' 的 url 参数

```js
import { serialize } from 'utils-where';
// 或者在必要时使用 commonJS 风格：const {serialize} = require('utils-where')

// 结果是 'name=unknown&num=1&null=&undefined=&more=false'
serialize({
  name: 'unknown',
  num: 1,
  null: null,
  undefined: void 0,
  more: false
});
```

- type

```ts
serialize(obj: Obj): string;
```
