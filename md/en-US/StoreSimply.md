## StoreSimply

simple store with localStorage

```js
import { StoreSimply } from 'utils-where';

// localStorage[''] be like {theme: 1, other: ''}
const GlobalIni = new StoreSimply('', { theme: 'auto', other: '' }).setVal('theme', 1);
// remove the "other" key and the data in local store be like {theme: 1}
GlobalIni.setVal('other' /* undefined */); // same as passing undefined
```

- type

```ts
StoreSimply<T extends object>(id?: string | null, data?: T): StoreSimply<T>
```
