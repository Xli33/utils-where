import type { Func, Obj } from '../types';

interface DebounceFirstWrap<T extends Func> {
  (...args: Parameters<T>): ReturnType<T> | void;
  _tid?: number;
  flag?: true | null;
}

/**
 * the next call will be triggerd after `timeout` the last call went by
 * @param callback function to invoke only once till `timeout`
 * @param timeout  milliseconds
 * @returns function
 * @example
 * // not click for at least 1s and to be triggered
 * onclick = debounceFirst(() => console.log('1'), 1000)
 */
export function debounceFirst<T extends Func>(callback: T, timeout: number): DebounceFirstWrap<T> {
  return function wrap(this: any, ...args: Parameters<T>) {
    clearTimeout((<Obj>wrap)._tid);
    (<Obj>wrap)._tid = setTimeout(() => {
      (<Obj>wrap)._tid = (<Obj>wrap).flag = null;
    }, timeout);
    if ((<Obj>wrap).flag == null) {
      (<Obj>wrap).flag = true;
      return callback.apply(this, args);
    }
  };
}
