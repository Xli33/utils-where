import type { Obj } from './types';
import { getPathValue } from './usual';

/**
 * 替换字符串中的 "%s"
 *
 * 当第二个参数是对象时，以相应的属性值替换字符串中的“{}”插值部分
 *
 * @returns string
 * @example sprintf('hel %s %s', 'l', 'o');
 * sprintf('he{a} {b.c}', {a: 'l', b: {c: 'lo'}})
 */
export function sprintf(...[str, ...args]: [string, ...(string | number | object)[]]): string {
  if (typeof str !== 'string') {
    console.warn('the 1st argument must be a string!');
    return '';
  }

  // if(rep == undefined) return str
  const rep = args[0];
  if (typeof rep === 'string' || typeof rep === 'number') {
    /*var i
        for (i = 1; i < argLen; i++) {
            str = str.replace('%s', arguments[i])
        }
        return str*/

    let i = 0;
    return str.replace(/%s/g, () => <string>args[i++] ?? '%s');
  }

  /**
   * eg. the return value of sprintf('{a.b}', {a: {b: 33}}) should be string 33
   */
  if (typeof rep === 'object') {
    // const chars = str.match(/{[^{}]+}/g);
    // if (chars) {
    //   for (const v of chars) {
    //     str = str.replace(v, getPath(rep, v.replace(/[{}]/g, '')) ?? '');
    //   }
    // }
    // return str;
    return str.replace(/{[^{}]+}/g, (v) => getPathValue(rep, v.replace(/[{}]/g, '')) ?? '');
  }

  return str;
}

/**
 * 移动数组某项
 * @param arr 数组
 * @param from 移动前的index
 * @param to 移动后的index
 */
export function moveArrItem(arr: any[], from: number, to: number) {
  if (Array.isArray(arr) && arr.length > 0 && from != undefined && to != undefined) {
    arr.splice(to, 0, ...arr.splice(from, 1));
  }
  return arr;
}

/**
 * 获取滚动条尺寸
 * @param force 是否重新计算一次
 * @returns 滚动条尺寸
 */
export function getScrollBarSize(force?: boolean): number {
  if (force || (<Obj>getScrollBarSize).barSize === undefined) {
    const outer = document.createElement('div'),
      style = outer.style;
    style.position = 'absolute';
    style.top = '0';
    style.left = '0';
    style.zIndex = '-1';
    style.visibility = 'hidden';
    style.width = '50px';
    style.height = '50px';
    style.overflow = 'scroll';
    style.pointerEvents = 'none';
    document.body.appendChild(outer);
    (<Obj>getScrollBarSize).barSize = outer.offsetWidth - outer.clientWidth;
    document.body.removeChild(outer);
  }
  return (<Obj>getScrollBarSize).barSize;
}

export function isObject(obj: any) {
  return obj != null && typeof obj === 'object';
  // return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * 深度合并对象与数组
 * @param target 待合并的目标对象或数组
 * @param source 深度合并至target的对象或数组
 * @param skipHandle 单独处理合并过程中的每一项，返回Truthy则不进行深度合并
 * @returns target
 */
export function deepMerge(
  target: Obj,
  source: Obj,
  skipHandle?: (key: string, target: Obj, from: any) => boolean | void
) {
  if (!target || !source) return;
  // 只合并 source 自身可枚举属性，不处理不可枚举及原型上的属性
  for (const [k, v] of Object.entries(source)) {
    if (v === target[k]) continue;
    if (typeof skipHandle === 'function' && skipHandle(k, target, v)) continue;
    if (isObject(v) && isObject(target[k])) {
      deepMerge(target[k], v, skipHandle);
    } else {
      target[k] = v;
    }
  }
  return target;
}

/**
 * 根据给定索引删除源数组对应项
 * @param arr any[]
 * @param indexes 包含待删除索引的数组
 * @returns 包含被删除项的数组
 * @example delArrItem([null, 5, 'as', {}, false], [3,1,7]) => [5, {}]
 */
// export function delArrItem(arr: any[], indexes: number[]): any[];
// export function delArrItem(arr: any, indexes: any): void;
export function delArrItem(arr: any[], indexes: number[]) {
  if (!Array.isArray(arr) || !Array.isArray(indexes)) return [];
  const len = arr.length,
    res: any[] = [];
  new Set(indexes.filter((e) => e >= 0 && e < len).sort((a, b) => b - a)).forEach((e) => {
    res.unshift(arr.splice(e, 1)[0]);
  });
  return res;
}

/**
 * 复制到剪贴板
 * @param val
 * @returns boolean
 */
export function setClipboard(val: string) {
  if (!val) return;
  const el = document.createElement('textarea');
  el.value = val;
  el.readOnly = true;
  el.style.position = 'fixed';
  el.style.top = '0';
  el.style.left = '0';
  el.style.zIndex = '-1';
  el.style.opacity = '0';
  document.body.appendChild(el);
  el.select();
  el.setSelectionRange(0, val.length);
  const res = document.execCommand('copy');
  el.remove();
  return res;
}

/**
 * 通过id判断性别 1：男，2：女
 * @param id
 * @returns 1: male, 2: female
 */
export function getSexById(id: string) {
  return id ? (Number(id.slice(-2, -1)) % 2 !== 0 ? 1 : 2) : null;
}

/**
 * 通过id获取出生日期
 * @param id
 * @returns YYYY-MM-DD
 */
export function getBirthById(id: string) {
  return id ? id.slice(6, 14).replace(/(\d{4})(\d{2})/, '$1-$2-') : '';
}

interface Evt {
  [x: string]: ((...args: any[]) => any)[];
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
    on<K extends keyof T>(name: K, func: T[K][number]) {
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
    once<K extends keyof T>(name: K, func: T[K][number]) {
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
    off<K extends keyof T>(name: K, func?: T[K][number]) {
      const arr = this.evts[name];
      if (!Array.isArray(arr)) return this;
      if (!func) {
        arr.splice(0);
      } else {
        const index = arr.indexOf(func);
        index > -1 && arr.splice(index, 1);
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
    emit(name: keyof T, ...args: any[]) {
      const arr = this.evts[name];
      if (!Array.isArray(arr)) return this;
      for (let i = 0; i < arr.length; i++) {
        arr[i](...args);
        if ((arr[i] as Obj)._once) {
          arr.splice(i, 1);
          i--;
        }
      }
      return this;
    }
  };
}
