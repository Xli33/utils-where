## onlyify

deduplication for source array

```js
import { onlyify } from 'utils-where';

// the array to be deduplicated with `same` id
const arr = [{ id: 1 }, { id: 2 }, { id: 1, num: 3 }];

// get an array within only id: [{ id: 1 }, { id: 2 }]
onlyify(arr, (res, item) => res.every((e) => e.id !== item.id));

// get an array within only id at last: [{ id: 2 }, { id: 1, num: 3 }]
onlyify(arr, (res, item) => arr.findLast((e) => e.id === item.id) === item && res.every((e) => e.id !== item.id));
```

- type

```ts
onlyify<T>(source: T[], compare: (result: T[], sourceItem: T) => boolean | void): T[]
```
