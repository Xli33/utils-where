# sprintf

replace all `%s` or `{a.b}` in first string param, inspired by template string `${}` from es

```js
import { sprintf } from 'utils-where';

// return 'this is a demo and see'
sprintf('this %s a %s and see', 'is', 'demo');

// return 'a demo to show and see'
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
