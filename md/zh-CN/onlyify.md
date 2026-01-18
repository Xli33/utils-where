## onlyify

源数组的去重

```js
import { onlyify } from 'utils-where';

// 需要根据 `same` id 去重的数组
const arr = [{ id: 1 }, { id: 2 }, { id: 1, num: 3 }];

// 获取一个仅包含 id 的数组: [{ id: 1 }, { id: 2 }]
onlyify(arr, (res, item) => res.every((e) => e.id !== item.id));

// 获取一个仅包含最后一个 id 的数组: [{ id: 2 }, { id: 1, num: 3 }]
onlyify(arr, (res, item) => arr.findLast((e) => e.id === item.id) === item && res.every((e) => e.id !== item.id));
```

- type

```ts
onlyify<T>(source: T[], compare: (result: T[], sourceItem: T) => boolean | void): T[]
```
