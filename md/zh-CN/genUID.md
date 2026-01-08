# genUID

生成带有给定前缀的唯一 ID

```js
import { genUID } from 'utils-where';

// 获取一个不带前缀的随机数字 ID
genUID();

// 获取一个带前缀的唯一 ID，应为 'Some' + 小于 1000 的数字
genUID('Some', 1000);
```

- type

```ts
genUID(prefix?: string, level?: number, step?: number): string
```
