declare interface Node {
  /**
   * 长按事件longpress的触发延时，默认延时500ms
   */
  _longPressDelay?: number;
  /**
   * 触发longpress时传递的[事件参数](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/Event#options)
   */
  _longPressOption?: {
    bubbles?: boolean;
    cancelable?: boolean;
    composed?: boolean;
  };
  /**
   * 存储监听的longpress事件的数组
   */
  _longPressEvents?: {
    touchstart(e: Event): void;
    touchend(): void;
    longpress: EventListenerOrEventListenerObject;
    options?: AddEventListenerOptions | boolean;
  }[];
}

// declare module 'utils-where/events' {}
