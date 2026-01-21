## delArrItem

remove array items by indexes

```ts
import { delArrItem } from 'utils-where';

// remove items at index 1,3. return the removed [5, {}]
delArrItem([null, 5, 'as', {}, false], [3, 1, 7]) => [5, {}]
```

- type

```ts
delArrItem(arr: any[], indexes: number[]): any[];
```
