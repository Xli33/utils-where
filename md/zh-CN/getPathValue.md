## getPathValue

通过 a.b.c 这样的键路径在对象中获取值

```js
import { getPathValue } from 'utils-where';

const obj = {
  first: {
    second: {
      third: 3
    }
  }
};
// 结果是 3
getPathValue(obj, 'first.second.third');
// 使用泛型
getPathValue<3>(obj, 'first.second.third') === 3;
// 检查路径
getPathValue(obj, 'first.second.third', true) => {isValidKeys: true, validKeys: 'first.second.third', value: 3}
obj.first.second.third = 'str'
getPathValue<'str'>(obj, 'first.second.third', true) => {isValidKeys: true, validKeys: 'first.second.third', value: 'str'}
```

- type

```ts
getPathValue<T = any>(obj: Obj, keyPath: string): T;
getPathValue<T = any>(obj: Obj, keyPath: string, check: false | undefined): T;
getPathValue<T = any>(obj: Obj, keyPath: string, check: true): { isValidKeys: boolean; validKeys: string; value: T };
```
