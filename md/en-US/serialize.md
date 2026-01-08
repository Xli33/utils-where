# serialize

turn object into url param like 'a=1&b='

```js
import { serialize } from 'utils-where';
// or use commonJS style if necessary: const {serialize} = require('utils-where')

// result is 'name=unknown&num=1&null=&undefined=&more=false'
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
