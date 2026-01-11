import type { Func, Obj, TimeoutId } from '../types';

interface ThrottleWrap<T extends Func> {
  (...args: Parameters<T>): ReturnType<T> | void;
  _last?: number;
  onEnd?: Func<{ _tid?: TimeoutId | null }>;
}

/**
 * get a throttled function, only to be called after `interval`. an `onEnd` listener could be added to the returned function
 * @param callback function to invoke every `interval` ms
 * @param interval milliseconds between each call
 * @returns function
 * @example
 * const o = {
 *  click: throttle(() => {console.log(this); return 1}, 1000),
 *  move: throttle(function () {console.log(this); return ''}, 500)
 * }
 *
 * o.click() === 1 // the logged 'this' is not o
 * o.move() === '' // the logged 'this' is o itself
 *
 * // add an end listener if need, maybe unnecessary in some events like 'mousemove'. and `onEnd` is in task queue
 * click.onEnd = () => console.log('the end call maybe unnecessary')
 */
export function throttle<T extends Func>(
  callback: T,
  interval: number
): ThrottleWrap<T> /* (...args: Parameters<T>) => ReturnType<T> | void */ {
  return function wrap(this: any, ...args: Parameters<T>) {
    if (Date.now() - ((<Obj>wrap)._last || 0) >= interval) {
      (<Obj>wrap).onEnd && clearTimeout((<Obj>wrap).onEnd._tid!);
      (<Obj>wrap)._last = Date.now();
      return callback.apply(this, args);
    }
    // debounceLast((<Obj>wrap).onEnd, interval).apply(this, args);
    if ((<Obj>wrap).onEnd) {
      clearTimeout((<Obj>wrap).onEnd._tid!);
      (<Obj>wrap).onEnd._tid = setTimeout(() => {
        (<Obj>wrap).onEnd._tid = null;
        (<Obj>wrap).onEnd.apply(this, args);
      }, interval);
    }
  };
}
