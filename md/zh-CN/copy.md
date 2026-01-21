## `setClipboard` & `asyncCopy`

同步或异步复制文本到剪贴板

```ts
import { setClipboard, asyncCopy } from 'utils-where';

// 如果复制成功返回 true，失败返回 false
setClipboard('content to be copied');

// 异步复制
asyncCopy('xxx').then((res) => {
  // 如果复制成功 res 为 true
});
```

- type

```ts
setClipboard(val: string): boolean;
asyncCopy(val: string): Promise<void> | Promise<boolean>;
```
