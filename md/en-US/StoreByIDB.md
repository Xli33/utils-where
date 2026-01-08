# StoreByIDB

store in object form with indexedDB

```ts
import { type SelfKeyPath, StoreByIDB } from 'utils-where';

// store in indexedDB
const d = new StoreByIDB();
d.onsuccess = () => {
  console.log(d.data);
  d.setVal('APP.ui.theme', 'auto')
    .setVal('login.agree.read', null)
    .setVal('login.agree.remember', true)
    .setVal('login.accnt', { id: 123, pwd: 'abc' });

  console.log(d.getVal('login.agree.read') === d.getVal<true>('login.agree.read')); // true
  // remove key in local store. if no useJSON:true here, the value will be actual undefined in indexedDB
  d.setVal('login.agree.read', undefined, { useJSON: true });
  // or just set `undefined`
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

// get the actual type of `data` when u need access to it
const d = new StoreByIDB<Config>();
d.onsuccess = () => {
  d.data.user;
};

// check keyPath if necessary
const d = new StoreByIDB<Config, SelfKeyPath<Config>>();
d.onsuccess = () => {
  d.setVal('app.theme', '').getVal('user.id');
};
```

- type

```ts
StoreByIDB<T extends Obj = Obj, K extends string = string>(id?: string, table?: string | null, data?: T): StoreByIDB<T, K>
```
