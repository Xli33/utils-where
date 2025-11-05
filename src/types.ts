export declare interface Obj {
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

/**
 * 滚动容器，即可滚动的元素自身，其overflow应为auto/scroll
 */
export type Scroller = HTMLElement & {
  _scrollAt: number | null;
  _scrollTid: number | null;
  _scrollbars?: {
    barX: HTMLElement;
    barY: HTMLElement;
    // [x:string]: Element
  } | null;
};
/**
 * 滚动条滑块
 */
export type Thumb = HTMLElement & {
  _ratio: number;
};
/**
 * 内容区域，为了便于监测到内容改动导致的尺寸变化
 */
export type List = HTMLElement & {
  _barUpdated: boolean | null;
  _scrollbars: [barX: HTMLElement, barY: HTMLElement] | null;
};
/**
 * 自定义滚动条对象
 */
export type CustomBar = {
  /**
   * 是否禁用自定义滚动条。默认在移动端上停用
   *
   * 可按需修改生效条件如 Scrollbar.disabled = Scrollbar.disabled && /Firefox|Linux|Macintosh/.test(navigator.userAgent)
   */
  disabled: boolean;
  /**
   * 是否在使用滚动条时清除页面已选项，默认禁用
   */
  clearSelection: boolean | null;
  /**
   * 是否在使用滚动条时阻止（chromium）默认的selectstart事件，默认禁用
   */
  stopSelect: boolean | null;
  /**
   * 是否监听body&html的样式变化从而切换window的滚动条，默认禁用
   *
   * 如需要展示modal时，通常组件会将body的overflow改为hidden从而隐藏滚动条以及避免scroll chaining
   */
  watchPageStyle: boolean | null;
  /**
   * @description
   * 更新滚动条尺寸后是否同步位置
   */
  syncPos: boolean | null;
  _stylingPage: boolean | null;
  stylingPage: boolean | null;
  pageWatcher?: MutationObserver | null;
  sizeWatcher?: ResizeObserver | null;
  scrollerWatcher?: ResizeObserver;
  getBar: (el: HTMLElement) => {
    isPage: boolean;
    barX?: HTMLElement;
    barY?: HTMLElement;
    thumbX?: Thumb;
    thumbY?: Thumb;
    scrollTarget: Scroller;
  };
  /**
   * 移除滚动条，无需手动调用
   *
   * @param el 使用Scrollbar.attach附加过滚动条的元素
   */
  remove: (el: Scroller) => void;
  /**
   * 对指定元素附加自定义滚动条
   *
   * @param el html元素
   * @returns this
   *
   * @example
   * // 只给窗口本身使用时仅需为html添加scroller类并调用attach，无需传参
   * <html class="scroller"> & Scrollbar.attach()
   * @example
   * // 给局部元素使用，为便于监测滚动容器&内容区域的尺寸变化，应符合类似下列结构
   * <!-- 用于包裹滚动容器&滚动条的非静态定位元素，添加定位属性如style="position:relative"以适配不支持原生:has()的环境 -->
   * <div style="width:200px;height:200px">
   *  <!-- 滚动容器。必须添加scroller类，添加fill类以继承父元素高度（便于调整样式） -->
   *  <div class="scroller fill">
   *   <!-- 内容区域，如列表 -->
   *   <div id="list"></div>
   *  </div>
   * </div>
   *
   * Scrollbar.attach(document.getElementById('list'))
   *
   * // attach支持链式调用
   * Scrollbar.attach().attach(document.querySelector('.list'))
   */
  attach: (el?: HTMLElement | null) => CustomBar;
  init?: () => void;
  updateBar: (container: HTMLElement) => void;
  updatePos: (thumbX: Thumb, thumbY: Thumb, scrollTarget: HTMLElement) => void;
  getDownData: (
    dir: 'X' | 'Y',
    bar: HTMLElement,
    thumb: Thumb,
    scrollTarget: HTMLElement
  ) => {
    distance: number;
    lastScroll: number;
  };
  mouseMove: (
    dir: 'top' | 'left',
    type: 'scrollTop' | 'scrollLeft',
    pos: number,
    distance: number,
    thumb: Thumb,
    scrollTarget: HTMLElement
  ) => void;
  addMouseUp: (
    onmousemove: (e: MouseEvent) => void,
    listenOn: Scroller | Window,
    scrollTarget: Scroller,
    onScroll: () => void
  ) => void;
  showBar: (this: Scroller) => void;
  hideBar: (obj: Scroller) => void;
};

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
