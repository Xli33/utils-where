import type { Func, Obj } from '../types';

interface DebounceLastWrap<T extends Func> {
  (...args: Parameters<T>): void;
  _tid?: number;
}

/**
 * each call will be **async** triggerd always after `timeout`
 * @param callback function to invoke only once after `timeout`
 * @param timeout milliseconds
 * @returns function
 * @example
 * // resize window and callback triggered only after 1s when stop resizing
 * onresize = debounceLast(() => console.log('only happens after 1s when stop'), 1000)
 *
 * // use clearTimeout to stop the next trigger if necessary
 * addEventListener('resize', debounceLast(() => {
 *  clearTimeout(onresize._tid);
 *  console.log('cleared')
 * }, 999))
 */
export function debounceLast<T extends Func>(callback: T, timeout: number): DebounceLastWrap<T> {
  return function wrap(this: any, ...args: Parameters<T>) {
    clearTimeout((<Obj>wrap)._tid);
    (<Obj>wrap)._tid = setTimeout(() => {
      (<Obj>wrap)._tid = null;
      callback.apply(this, args);
    }, timeout);
  };
}
