## StoreById

store in object form with localStorage

```ts
import { type SelfKeyPath, StoreById } from 'utils-where';

// localStorage.app be like {theme: 1, head: {show: true, title: 0}, foot: {show: false, tip: 'xxx'}, {one: {two: {three: {four: null}}}}}
const ini = new StoreById('app', {
  theme: 0,
  head: {
    show: false
  }
})
  .setVal('head.show', true)
  .save({ theme: 1 })
  .setVal('foot.show', false)
  .save({ head: { title: 0 } })
  .save({
    foot: {
      tip: 'xxx'
    }
  })
  .setVal('one.two.three.four', null);
ini.getVal('foot.show') === ini.getVal<false>('foot.show');

new StoreById('app2', {
  custom: {
    lang: '',
    theme: 'light'
  }
})
  // remove some key in local store
  .setVal('custom.theme' /* undefined */) // same as passing undefined
  .save({
    custom: {
      lang: undefined // undefined is needed here
    }
  });

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
new StoreById<Config>().data.user;

// check keypath if necessary
new StoreById<Config, SelfKeyPath<Config>>().setVal('app.theme', '').getVal('user.id');
```

- type

```ts
StoreById<T extends Obj = Obj, K extends string = string>(id?: string | null, data?: T): StoreById<T, K>
```
