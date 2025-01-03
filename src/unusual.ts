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
