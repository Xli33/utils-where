## getPathValue

get value in object with the key path like a.b.c

```ts
import { getPathValue } from 'utils-where';

const obj = {
  first: {
    second: {
      third: 3
    }
  }
};
// result is 3
getPathValue(obj, 'first.second.third');
// with generics
getPathValue<3>(obj, 'first.second.third') === 3;
// check the path
getPathValue(obj, 'first.second.third', true) => {isValidKeys: true, validKeys: 'first.second.third', value: 3}
obj.first.second.third = 'str'
getPathValue<'str'>(obj, 'first.second.third', true) => {isValidKeys: true, validKeys: 'first.second.third', value: 'str'}

// special case: when a key is a string of dot connection, like { a: { 'b.c': [ { d: 1 } ] } }
const obj2 = {
  a: {
    'b.c': [ { d: 1 } ]
  }
}
getPathValue(obj2, 'a.[b.c].0.d') === 1
getPathValue(obj2, 'a.[b.c].0.d', true) => {isValidKeys: true, validKeys: 'a.[b.c].0.d', value: 1}
```

- type

```ts
getPathValue<T = any>(obj: Obj, keyPath: string): T;
getPathValue<T = any>(obj: Obj, keyPath: string, check: false | undefined): T;
getPathValue<T = any>(obj: Obj, keyPath: string, check: true): { isValidKeys: boolean; validKeys: string; value: T };
```
