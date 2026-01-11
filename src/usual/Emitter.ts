import type { Obj } from '../types';

interface Evt {
  [x: string]: ((...args: any[]) => any)[];
}
interface Emitter<T extends Evt> {
  evts: T;
  on<K extends keyof T>(name: K, func: T[K][number]): this;
  once<K extends keyof T>(name: K, func: T[K][number]): this;
  off<K extends keyof T>(name: K, func?: T[K][number]): this;
  emit(name: keyof T, ...args: any[]): this;
}

/**
 * event emitter
 *
 * @example
 * const emitter = Emitter()
 * emitter.on('some', (arg) => {console.log(arg)})
 *  .emit('some', 123).off('some')
 *
 * const emitter = Emitter<{
 *  hi: [(m: string) => void]
 *  tell: ((t: boolean) => boolean)[]
 * }>()
 * emitter
 *  .once('hi', (s) => alert(s))
 *  .on('tell', (s) => !!s)
 *  .emit('hi')
 *  .emit('tell')
 *  .off('tell')
 */
export function Emitter<T extends Evt>() {
  return {
    evts: {} as T,
    /**
     * add listener for given name
     * @param name listener type
     * @param func listener
     * @returns this
     * @example
     * Emitter().on('hi', (s) => { alert(s) }).emit('hi')
     * // with type
     * Emitter<{
     *  hi: [(m:string) => void]
     * }>().on('hi', (s) => { alert(s) }).emit('hi', 'hiii')
     */
    on<K extends keyof T>(name: K, func: T[K][number]): Emitter<T> {
      if (typeof name !== 'string' || typeof func !== 'function')
        throw new Error('require name of string and function');
      const list = this.evts[name];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Array.isArray(list) ? !list.includes(func) && list.push(func) : (this.evts[name] = [func]);
      return this;
    },
    /**
     * add listener only running once for given name
     * @param name listener type
     * @param func listener
     * @returns this
     * @example
     * Emitter().once('hi', (s) => { alert(s) }).emit('hi')
     * // with type
     * Emitter<{
     *  hi: [(m:string) => void]
     * }>().once('hi', (s) => { alert(s) }).emit('hi', 'hiii')
     */
    once<K extends keyof T>(name: K, func: T[K][number]): Emitter<T> {
      if (typeof func === 'function') (func as Obj)._once = true;
      return this.on(name, func);
    },
    /**
     * remove listener for given name
     * @param name listener type
     * @param func listener
     * @returns this
     * @example
     * const emitter = Emitter(),
     *       tell = (s) => alert(s)
     * emitter.on('hi', tell)
     *        .on('hi', (s) => alert('1: ' + s))
     *        .on('hi', (s) => alert('2: ' + s))
     *        // remove the "tell"
     *        .off('hi', tell)
     *        // remove all of the type 'hi'
     *        .off('hi')
     */
    off<K extends keyof T>(name: K, func?: T[K][number]): Emitter<T> {
      const arr = this.evts[name];
      if (!Array.isArray(arr)) return this;
      if (func == null) {
        // arr.splice(0);
        delete this.evts[name];
      } else {
        const index = arr.indexOf(func);
        index > -1 && arr.splice(index, 1) && arr.length < 1 && delete this.evts[name];
      }
      return this;
    },
    /**
     * call the listener for given name
     * @param name listener type
     * @param args arguments passed to listener
     * @returns this
     * @example
     * const say = (m: string) => console.log(m)
     * Emitter().once('runOnce', say)
     *          .emit('runOnce', 'called once only')
     *          .on('run', say)
     *          .emit('run', '1st run')
     *          .emit('run', '2st run')
     */
    emit(name: keyof T, ...args: any[]): Emitter<T> {
      const arr = this.evts[name];
      if (!Array.isArray(arr)) return this;
      for (let i = 0; i < arr.length; i++) {
        arr[i](...args);
        if ((arr[i] as Obj)._once) {
          arr.splice(i, 1);
          i--;
        }
      }
      arr.length < 1 && delete this.evts[name];
      return this;
    }
  };
}
