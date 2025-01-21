# Changelog


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
