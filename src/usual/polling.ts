import type { Func, TimeoutId } from '../types';

/**
 * 轮询传入的函数，仅在当次函数调用后才继续下次轮询
 *
 * @param callback function to be called periodically
 * @param interval milliseconds between each call
 * @param args arguments passed to callback
 * @returns poller with `run` and `stop` methods
 * @example
 * const poller = polling((arg1, arg2) => { console.log('polling', arg1, arg2); }, 2000, 'arg1', 'arg2');
 * poller.run();
 *
 * // pass custom callback, interval and args when calling `run`, which override the corresponding params from `polling(...args)`
 * const poller = polling();
 * poller.run((arg1, arg2) => { console.log('custom polling', arg1, arg2); }, 1000, 'arg1', 'arg2');
 */
export function polling(callback?: Func, interval?: number, ...args: any[]) {
  const poller = {
    tid: null as TimeoutId | null,
    run(handle?: Func, handleInterval?: number, ...handleArgs: any[]) {
      if (poller.tid != null) return;
      // poller.tid != null && poller.stop();
      poller.tid = setTimeout(async () => {
        const tid = poller.tid; // 记录当前的tid
        await (handle! || callback)(...(handleArgs.length ? handleArgs : args));
        //  仅当tid未被更改时（如在await期间外部stop或run了）才继续下一次轮询
        if (poller.tid === tid) {
          poller.tid = null;
          poller.run(handle, handleInterval, ...handleArgs);
          return;
        }
        poller.tid = null;
      }, handleInterval ?? interval);
    },
    stop() {
      clearTimeout(poller.tid!);
      poller.tid = null;
    }
  };

  return poller;
}
