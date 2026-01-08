# StoreById

使用 localStorage 的对象形式存储

```ts
import { type SelfKeyPath, StoreById } from 'utils-where';

// localStorage.app 类似于 {theme: 1, head: {show: true, title: 0}, foot: {show: false, tip: 'xxx'}, {one: {two: {three: {four: null}}}}}
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
  // 移除本地存储中的某个键
  .setVal('custom.theme' /* undefined */) // 传递 undefined 效果相同
  .save({
    custom: {
      lang: undefined // 此处需要 undefined
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

// 需要访问 `data` 时获取其具体类型
new StoreById<Config>().data.user;

// 如果需要，检查键路径
new StoreById<Config, SelfKeyPath<Config>>().setVal('app.theme', '').getVal('user.id');
```

- type

```ts
StoreById<T extends Obj = Obj, K extends string = string>(id?: string | null, data?: T): StoreById<T, K>
```