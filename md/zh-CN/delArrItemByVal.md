## delArrItemByVal

通过相等的值移除数组项

```ts
import { delArrItemByVal } from 'utils-where';

// 移除与第二个参数中所有相同值的项。返回处理后的数组（第一个参数） [2, false]
delArrItemByVal([2, '', alert, console, false, NaN], ['', alert, console, NaN]) => [2, false]
```

- type

```ts
delArrItemByVal(arr: any[], items: any[]): any[]
```
