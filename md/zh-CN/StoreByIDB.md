# StoreByIDB

使用 indexedDB 的对象形式存储

```ts
import { type SelfKeyPath, StoreByIDB } from 'utils-where';

// 存储在 indexedDB 中
const d = new StoreByIDB();
d.onsuccess = () => {
  console.log(d.data);
  d.setVal('APP.ui.theme', 'auto')
    .setVal('login.agree.read', null)
    .setVal('login.agree.remember', true)
    .setVal('login.accnt', { id: 123, pwd: 'abc' });

  console.log(d.getVal('login.agree.read') === d.getVal<true>('login.agree.read')); // true
  // 移除本地存储中的键。如果此处没有 useJSON:true，则值在 indexedDB 中将是实际的 undefined
  d.setVal('login.agree.read', undefined, { useJSON: true });
  // 仅设置成 `undefined`
  d.setVal('login.agree.read');
};

type Config = {
  user: {
    id: string;
    pwd: string;
  };
  app: {
    theme: string;
  };
};

// 需要访问 `data` 时获取其具体类型
const d = new StoreByIDB<Config>();
d.onsuccess = () => {
  d.data.user;
};

// 如果需要，检查键路径
const d = new StoreByIDB<Config, SelfKeyPath<Config>>();
d.onsuccess = () => {
  d.setVal('app.theme', '').getVal('user.id');
};
```

- type

```ts
StoreByIDB<T extends Obj = Obj, K extends string = string>(id?: string, table?: string | null, data?: T): StoreByIDB<T, K>
```