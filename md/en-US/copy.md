# `setClipboard` & `asyncCopy`

synchronously or asynchronously copy text to clipboard

```js
import { setClipboard, asyncCopy } from 'utils-where';

// result is true if copied or false if failed
setClipboard('content to be copied');

// copy asynchronously
asyncCopy('xxx').then((res) => {
  // res is true if copied
});
```

- type

```ts
setClipboard(val: string): boolean;
asyncCopy(val: string): Promise<void> | Promise<boolean>;
```
