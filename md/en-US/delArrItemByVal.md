# delArrItemByVal

remove array items by equal values

```js
import { delArrItemByVal } from 'utils-where';

// remove all same items from second param. return the handled array(first param) [2, false]
delArrItemByVal([2, '', alert, console, false, NaN], ['', alert, console, NaN]) => [2, false]
```

- type

```ts
delArrItemByVal(arr: any[], items: any[]): any[]
```
