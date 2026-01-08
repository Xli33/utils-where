# sprintf

替换第一个字符串参数中的所有 `%s` 或 `{a.b}`，灵感来源于 es 的模板字符串 `${}`

```js
import { sprintf } from 'utils-where';

// 返回 'this is a demo and see'
sprintf('this %s a %s and see', 'is', 'demo');

// 返回 'a demo to show and see'
sprintf('a {first} to show and {second.txt}', {
  first: 'demo',
  second: {
    txt: 'see'
  }
});
```

- type

```ts
sprintf(str: string, ...args: (string | number)[] | [object]): string
```
