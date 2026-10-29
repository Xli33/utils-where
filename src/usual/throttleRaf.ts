import type { Func, FuncWrap, Obj } from '../types';

/**
 * get a throttled function, only to be **sync called** once per `requestAnimationFrame`
 *
 * @param callback function to invoke
 * @returns throttled function
 */
export function throttleRaf<T extends Func>(callback: T): FuncWrap<T, { _rid?: number | null }> {
  return function wrap(this: any, ...args: Parameters<T>) {
    // 拦截同一帧内的重复触发
    if ((<Obj>wrap)._rid) return;

    // raf是跟随屏幕刷新率的，到下一帧时 _rid 才变成null，保证每一帧只执行一次回调
    (<Obj>wrap)._rid = requestAnimationFrame(() => {
      (<Obj>wrap)._rid = null;
    });

    return callback.apply(this, args);
  };
}
