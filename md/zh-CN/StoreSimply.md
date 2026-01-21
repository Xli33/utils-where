## StoreSimply

使用 localStorage 的简单存储

```ts
import { StoreSimply } from 'utils-where';

// localStorage[''] 类似于 {theme: 1, other: ''}
const GlobalIni = new StoreSimply('', { theme: 'auto', other: '' }).setVal('theme', 1);
// 移除 "other" 键，本地存储中的数据类似于 {theme: 1}
GlobalIni.setVal('other' /* undefined */); // 传递 undefined 效果相同
```

- type

```ts
StoreSimply<T extends object>(id?: string | null, data?: T): StoreSimply<T>
```
