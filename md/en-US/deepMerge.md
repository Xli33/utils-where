# deepMerge

deep merge for object & array

```js
import { deepMerge } from 'utils-where';

const obj = {
  some: { nums: [1, 3, 5, 7, 9] },
  all: { ok: null }
};
deepMerge(obj, {
  some: { nums: ['', false] },
  all: { total: { to: 0 } }
});
/*
{
  some: { nums: ['', false, 5, 7, 9] },
  all: { ok: null, total: { to: 0 } }
}
*/
console.log(obj);

/* return {
    a: {
        c: 1,
        nums: [ 7, { hi: 'hey', ok: 'ok' }, 9 ],
        d: 2
    }
}
*/
deepMerge(
  {
    a: { c: 1, nums: [6, { hi: 'hey' }] }
  },
  {
    a: { d: 2, nums: [7, { ok: 'ok' }, 9] }
  }
);

// merge on sparse arrays
// return [1, 6, empty, 3]
deepMerge([, 2, ,], [1, 6, , 3]);
```

- type

```ts
deepMerge(target: Obj, source: Obj, skipHandle?: (key: string, target: Obj, from: any) => boolean | void): Obj;
```
