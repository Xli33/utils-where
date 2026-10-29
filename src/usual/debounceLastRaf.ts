import type { Func, FuncWrap, Obj } from '../types';

// interface DebounceLastRafWrap<T extends Func> {
//   (...args: Parameters<T>): void;
//   _rid?: number | null;
// }

/**
 * get a debounced function, only to be **async called** once in `requestAnimationFrame`
 * @param callback function to invoke
 * @returns debounced function
 * @example
 * onresize = debounceLastRaf(() => console.log('only happens after next animation frame'))
 */
export function debounceLastRaf<T extends Func>(callback: T): FuncWrap<T, { _rid?: number | null }, void> {
  return function wrap(this: any, ...args: Parameters<T>) {
    cancelAnimationFrame((<Obj>wrap)._rid);
    (<Obj>wrap)._rid = requestAnimationFrame(() => {
      (<Obj>wrap)._rid = null;
      callback.apply(this, args);
    });
  };
}
