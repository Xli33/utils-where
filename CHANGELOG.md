# Changelog


## [0.5.0](https://github.com/Xli33/utils-where/compare/v0.4.3...v0.5.0) (2026-01-14)


### ⚠ BREAKING CHANGES

* 废弃`validator` 模块，不再提供导出
* 仅`Func` `Truthy` `Falsy` SelfKeyPath`类型可导出到外部使用

### build

* 废弃`validator` 模块，不再提供导出 ([765611a](https://github.com/Xli33/utils-where/commit/765611acf91f4f7249876a5116ba5535239e8c71))


* 仅`Func` `Truthy` `Falsy` SelfKeyPath`类型可导出到外部使用 ([1deffa8](https://github.com/Xli33/utils-where/commit/1deffa822e0f0a53736697f02d4e30e2f0c36bc2))


### Features

* 在 `unusual` 添加 `saveFile` 方法，用于保存文件到本地 ([78a6b1e](https://github.com/Xli33/utils-where/commit/78a6b1e9455a3da4da2a7e5480d7f9c739a71945))

## [0.4.3](https://github.com/Xli33/utils-where/compare/v0.4.2...v0.4.3) (2025-12-09)


### Features

* 新增 `polling` 方法，轮询给定函数 ([45e10ab](https://github.com/Xli33/utils-where/commit/45e10aba0ac0253451189d00acc978afbe164eb2))

## [0.4.2](https://github.com/Xli33/utils-where/compare/v0.4.1...v0.4.2) (2025-11-19)


### Features

* usual模块添加函数 `omitOwnKeys`：返回去除指定自有属性的新对象或原对象 ([f7416d5](https://github.com/Xli33/utils-where/commit/f7416d50a9b7e15f08366c004ed2d9316be8a634))

## [0.4.1](https://github.com/Xli33/utils-where/compare/v0.4.0...v0.4.1) (2025-11-19)


### Bug Fixes

* 优化deepMerge，优先尝试执行skipHandle，避免判断到自赋值时直接continue而漏跑skipHandle ([4dbe245](https://github.com/Xli33/utils-where/commit/4dbe2450cc2a5aa24b3043377027310a6c43bafe))
* 优化getPathValue的重载声明 ([1877ae3](https://github.com/Xli33/utils-where/commit/1877ae3812ae4a1dfa9df806f2c86677979436d7))

## [0.4.0](https://github.com/Xli33/utils-where/compare/v0.3.13...v0.4.0) (2025-11-11)


### ⚠ BREAKING CHANGES

* 对调 StoreById 与 StoreByIDB 的泛型参数顺序，第一个为 data 类型，第二个为有效键路径

### Features

* 对调 StoreById 与 StoreByIDB 的泛型参数顺序，第一个为 data 类型，第二个为有效键路径 ([6588f62](https://github.com/Xli33/utils-where/commit/6588f62fcf01a9bfcb36e147a701d4b8c924cd99))

## [0.3.13](https://github.com/Xli33/utils-where/compare/v0.3.12...v0.3.13) (2025-11-10)


### Features

* 优化StoreByIDB，原型方法setVal允许省略第2个参数，并支持传入第二个泛型参数用于指定实例data的类型（同StoreById) ([078f861](https://github.com/Xli33/utils-where/commit/078f861e7cf4f4b9b928690a9a1b955eb08c1108))

## [0.3.12](https://github.com/Xli33/utils-where/compare/v0.3.11...v0.3.12) (2025-11-07)


### Features

* 新增函数 genUID 用于生成唯一id ([b53a578](https://github.com/Xli33/utils-where/commit/b53a578aa653807c277b732bc8fc837b498fe3fd))

## [0.3.11](https://github.com/Xli33/utils-where/compare/v0.3.10...v0.3.11) (2025-11-05)

## [0.3.10](https://github.com/Xli33/utils-where/compare/v0.3.9...v0.3.10) (2025-11-05)


### Features

* 优化StoreById & StoreByIDB，支持在实例化时传入泛型参数用于限制读写时的keyPath ([1cbf02d](https://github.com/Xli33/utils-where/commit/1cbf02dabd946d0cbdae977202428c5c6325139e))

## [0.3.9](https://github.com/Xli33/utils-where/compare/v0.3.8...v0.3.9) (2025-09-14)


### Features

* 添加数组去重函数：onlyify ([667f711](https://github.com/Xli33/utils-where/commit/667f711d61e47c72c5051f3dcf92681699fc08df))


### Bug Fixes

* 优化部分涉及全局api的代码，使用/*@__PURE__*/防止rollup等打包工具在未导入相关api时依旧会打包部分代码 ([a14d3bd](https://github.com/Xli33/utils-where/commit/a14d3bdb474230933a1f4d733d6a4464814535d2))

## [0.3.8](https://github.com/Xli33/utils-where/compare/v0.3.7...v0.3.8) (2025-09-01)


### Features

* 添加函数：`throttle`  `debounceFirst` `debounceLast` ([2264dfc](https://github.com/Xli33/utils-where/commit/2264dfc92f52413985f8817e2e371c639918569f))

## [0.3.7](https://github.com/Xli33/utils-where/compare/v0.3.6...v0.3.7) (2025-08-16)


### Features

* 在types/events.d.ts扩展Node接口以提供longpress事件相关属性的类型检查 ([7021c10](https://github.com/Xli33/utils-where/commit/7021c107cbc8fae1b72e861597c49d87631f6f91))


### Bug Fixes

* 优化events.ts，完善longpress事件监听&移除逻辑 ([0b2ae2c](https://github.com/Xli33/utils-where/commit/0b2ae2c466613bbfb3c080f4329921ab2ac985fa))
* 优化sprintf参数类型声明，修复当第2个参数为null时仍可能会处理字符 ([21d031e](https://github.com/Xli33/utils-where/commit/21d031ea62d3621bf2d9636eb30ad290b2da5ee4))

## [0.3.6](https://github.com/Xli33/utils-where/compare/v0.3.5...v0.3.6) (2025-08-15)


### Features

* unusual模块新增delArrItemByVal函数，用于从给定数组中根据值移除指定项 ([746ec88](https://github.com/Xli33/utils-where/commit/746ec88b97527cb735e43b3313baf89ad1741158))

## [0.3.5](https://github.com/Xli33/utils-where/compare/v0.3.4...v0.3.5) (2025-08-15)


### Bug Fixes

* 修复在未手动调用Scrollbar.init的情况下第一次调用Scrollbar.attach时不会监听元素 ([550fea6](https://github.com/Xli33/utils-where/commit/550fea658aaedd05bafdde553fb2ec5d3a9e834c))

## [0.3.4](https://github.com/Xli33/utils-where/compare/v0.3.3...v0.3.4) (2025-08-15)


### Features

* 优化makeObjectByPath、getPathValue、setPathValue，不再过滤空字符键 '' 与空白符键如' ' ([865a223](https://github.com/Xli33/utils-where/commit/865a2234f534e608eb18ccb72685f4f8bca970de))

## [0.3.3](https://github.com/Xli33/utils-where/compare/v0.3.2...v0.3.3) (2025-08-13)

## [0.3.2](https://github.com/Xli33/utils-where/compare/v0.3.1...v0.3.2) (2025-08-13)


### Features

* 优化StoreById与StoreByIDB的getVal，支持传入泛型参数以指定返回值类型 ([e7a5801](https://github.com/Xli33/utils-where/commit/e7a5801979353084a42eeff8a07da556a4f3acc0))
* getPathValue支持传入泛型参数以限定返回值类型，并优化类型声明 ([402d0a3](https://github.com/Xli33/utils-where/commit/402d0a3b2b0987df04f80e761ab84a1164827c52))


### Bug Fixes

* 优化deepMerge ([e003afe](https://github.com/Xli33/utils-where/commit/e003afe5b05c450ae4df42818780a130814a3a2d))

## [0.3.1](https://github.com/Xli33/utils-where/compare/v0.3.0...v0.3.1) (2025-07-27)


### Features

* 增加函数asyncCopy & 对象Scrollbar ([3b5cb1a](https://github.com/Xli33/utils-where/commit/3b5cb1a359e061755ae46d325e9927561c50c4bc))

## [0.3.0](https://github.com/Xli33/utils-where/compare/v0.2.0...v0.3.0) (2025-01-21)


### ⚠ BREAKING CHANGES

* rename CountDown to Countdown

### Features

* rename CountDown to Countdown ([ee2d839](https://github.com/Xli33/utils-where/commit/ee2d83988dd3dc5c9f431a7e4e86fab791985eb5))

## [0.2.0](https://github.com/Xli33/utils-where/compare/v0.1.4...v0.2.0) (2025-01-04)


### ⚠ BREAKING CHANGES

* moveTo更名为moveArrItem避免与window.moveTo混淆

### Features

* 新增function delArrItem，根据索引删除数组对应项 ([84334fd](https://github.com/Xli33/utils-where/commit/84334fde74ce36addfda72547c3e976f92999903))
* 新增function Emmitter<T extends Evt>() ([686ae97](https://github.com/Xli33/utils-where/commit/686ae97ed55456cf780787195fbc64c563f9dca6))


### Bug Fixes

* 完善Emitter对象方法返回类型定义 ([4112230](https://github.com/Xli33/utils-where/commit/4112230329cf101dc280faf8509c8b1ce8807128))
* 完善scroller & toTopOrBottom ([ab224c0](https://github.com/Xli33/utils-where/commit/ab224c0548e2423d2e9078fe5c8a109919e83f2c))
* 修复测试用例 ([d1848db](https://github.com/Xli33/utils-where/commit/d1848db98d101982b826e05cf45f1ed2ea2dd172))
* 修复events.ts的type bug ([32078b6](https://github.com/Xli33/utils-where/commit/32078b6224d6051e0114d60e3a96953b73a1400a))
* moveTo更名为moveArrItem避免与window.moveTo混淆 ([f61fe81](https://github.com/Xli33/utils-where/commit/f61fe816db5019fc1126c1ccf79424a95c1e7e1b))

## [0.1.4](https://github.com/Xli33/utils-where/compare/v0.1.3...v0.1.4) (2024-12-28)


### Bug Fixes

* 修复StoreXXX的注释用例 ([5e962c7](https://github.com/Xli33/utils-where/commit/5e962c7f22e3fa56f118f83ff2afbf2a70951b7c))

## [0.1.3](https://github.com/Xli33/utils-where/compare/v0.1.2...v0.1.3) (2024-12-26)

## [0.1.2](https://github.com/Xli33/utils-where/compare/v0.1.1...v0.1.2) (2024-12-26)

## [0.1.1](https://github.com/Xli33/utils-where/compare/v0.1.0...v0.1.1) (2024-12-26)


### Bug Fixes

* 调整husky回prepare ([8e818db](https://github.com/Xli33/utils-where/commit/8e818dba25cbba13296641c982d5654e2736494b))

## 0.1.0 (2024-12-26)


### ⚠ BREAKING CHANGES

* 新增class：CountDown、Clock、StoreSimply、StoreById、StoreByIDB
* 原backToTop改为toTopOrBottom

### Features

* 新增class：CountDown、Clock、StoreSimply、StoreById、StoreByIDB ([c4cbbcb](https://github.com/Xli33/utils-where/commit/c4cbbcbe3a52ea6d2b90b2fc32d4d71a45d53d04))
* 新增deepMerge，用于深度合并对象&数组 ([a51ac4c](https://github.com/Xli33/utils-where/commit/a51ac4c870afc818de50abecee6a069fb1285275))
* 新增makeObjectByPath，按给定key路径与末端属性值生成相应对象 ([020ca65](https://github.com/Xli33/utils-where/commit/020ca65f3656e7ca29725128f4314ad30362a70c))
* 新增setPathValue，scroller与toTopOrBottom ([103c817](https://github.com/Xli33/utils-where/commit/103c8173756d2574bcae91043a38ab3ab1d5c027))
* 优化getPathValue，新增参数check?:boolean，用于检测给定keyPath是否有效 ([813ef5e](https://github.com/Xli33/utils-where/commit/813ef5e4b919e1ea530c6f45ea3b7225f23beff4))


### Bug Fixes

* 修复sprintf使用对象插值时无法赋予非null与undefined的falsy值 ([f92f7aa](https://github.com/Xli33/utils-where/commit/f92f7aa157ff3eedb3a10685ac4a6e11c40a5afd))
* 优化eslint配置 ([de6e734](https://github.com/Xli33/utils-where/commit/de6e7344084622a7fca66f89e3d30025c436f565))
* 优化toTopOrBottom参数顺序 ([b56b710](https://github.com/Xli33/utils-where/commit/b56b7103f2b8a59ed949f0bd1b3871b17463511c))
