# delArrItem

通过索引移除数组项

```js
import { delArrItem } from 'utils-where';

// 移除索引 1,3 处的项。返回被移除的项 [5, {}]
delArrItem([null, 5, 'as', {}, false], [3, 1, 7]) => [5, {}]
```

- type

```ts
delArrItem(arr: any[], indexes: number[]): any[];
```
