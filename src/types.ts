export interface Obj {
  [x: string]: any;
}

// export type AnyFunc<T extends Obj = object> = ((...args: any[]) => any) & T;
// export type SomeFunc<F extends (...args: any[]) => any = (...args: any[]) => any, T extends Obj = object> = F & T;

export type Func<T extends Obj = object, F = (...args: any[]) => any> = F extends (...args: infer A) => infer R // 判断F是否是函数类型
  ? ((...args: A) => R) & T
  : never;

export type TimeoutId = ReturnType<typeof setTimeout>;

export type Falsy = null | undefined | false | '' | 0 | 0n;

export type Truthy<T> = T extends Falsy ? never : T;

// 1. 辅助类型：连接 K 和 P
type Join<K, P> = K extends string | number
  ? P extends string | number
    ? P extends '' // 仅当 P 明确是空字符串字面量时
      ? `${K}`
      : `${K}.${P}` // P 是 string 或 number 或其他路径，则加上 '.'
    : `${K}`
  : never;

// 2. 核心递归类型：生成所有路径
type KeyPath<T> = T extends object
  ? {
      // 遍历对象 T 的所有 key
      [K in keyof T]-?: K extends string | number
        ? K extends Array<any>
          ? never // 排除数组原型方法
          : // 当前 key K 本身就是一个可访问的路径
            | K
              // 递归连接：Join<当前 key, 递归路径>
              | Join<
                  K,
                  T[K] extends Array<infer E> // *** 数组特殊处理 ***
                    ? number | Join<number, KeyPath<E>> // 强制路径为 number 或 number.子路径
                    : KeyPath<T[K]> // 对象递归
                >
        : never;
    }[keyof T]
  : ''; // 基础类型返回空字符串，用于 Join 停止递归并返回 'K'

/**
 * 检测传入对象自身的可用key路径，搭配泛型如 `<T>(path: SelfKeyPath<T>)` 慎用！
 * @example
 * type MyData = {
 *   a: {
 *     b: {
 *       c: Array<{
 *         g: number
 *         h: boolean
 *       }>
 *     }
 *   }
 * }
 * // "a" | "a.b" | "a.b.c" | `a.b.c.${number}` | `a.b.c.${number}.g` | `a.b.c.${number}.h`
 * type MyDataPaths = SelfKeyPath<MyData>;
 */
export type SelfKeyPath<T = any> = Exclude<KeyPath<T>, '' | never>;

// type MyData = {
//   a: {
//     1: Record<string, any>
//     c:Array<{
//       g: number
//     }>
//   },
//   q: {
//     s: Array<{
//       m: boolean
//     }>
//   }
// }
// type MyDataPaths = SelfKeyPath<MyData>;

// const s: MyDataPaths = 'a.1';
