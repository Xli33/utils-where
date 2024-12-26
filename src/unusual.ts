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
export function moveTo(arr: any[], from: number, to: number) {
  if (Array.isArray(arr) && arr.length > 0 && from != undefined && to != undefined) {
    arr.splice(to, 0, ...arr.splice(from, 1));
  }
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
