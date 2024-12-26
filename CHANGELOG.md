# Changelog


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
