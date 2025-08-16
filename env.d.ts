// 只要同目录下存在同名（除扩展名外）的 .ts 与 .d.ts
// TypeScript 会把 .d.ts 视为“实现文件 ev.ts 的附属声明”
// 从而不会把它当作独立的全局声明文件加载

// 当编译器发现 ev.ts 时，它会优先使用 ev.ts 本身作为源文件
// 与之同名的 ev.d.ts 被当成“仅用于描述 ev.ts 的声明”，不会再被额外加载为全局环境声明
// 因此在 ev.d.ts 里写的declare interface Foo{}不会被合并到全局命名空间，其他文件自然找不到 Foo

// 当使用import或export数据后当前文件会变成局部模块，导致无法直接扩展全局环境声明
// 此时可以通过declare global{}扩展全局，因为declare global必须用在模块里面。declare global只能扩充现有对象的类型描述，不能增加新的顶层类型
// declare global {
//   interface Node {
//     _longPressDelay?: number;
//     _longPressOption?: {
//       bubbles?: boolean;
//       cancelable?: boolean;
//       composed?: boolean;
//     };
//   }
//   const __FOO: unique symbol;
// }
// export {}; //or export declare module 'utils-where/events' {}
