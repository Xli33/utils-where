import { getPathValue } from '../usual';

/**
 * 替换字符串中的 "%s"
 *
 * 当第二个参数是对象时，以相应的属性值替换字符串中的“{}”插值部分
 *
 * @returns string
 * @example sprintf('hel %s %s', 'l', 'o');
 * sprintf('he{a} {b.c}', {a: 'l', b: {c: 'lo'}})
 */
// export function sprintf(...[str, ...args]: [string, ...((string | number)[] | [object])]): string {
export function sprintf(str: string, ...args: (string | number)[] | [object]) {
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

  // e.g. the return value of sprintf('{a.b}', {a: {b: 33}}) should be string 33
  if (rep != null && typeof rep === 'object') {
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
