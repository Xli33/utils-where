import type { Obj } from '../types';

/**
 * 获取给定对象的某属性值，路径以 . 形式，如 a.b.c.d，也适用于数组
 * @param obj
 * @param keyPath 键路径，如 home.head.title
 * @param check 检验 keyPath 是否有效。如对象{one:1}，keyPath为one.two，由于one上找不到属性“two”，故返回值里的 isValidKeys 是false
 * @returns any | { isValidKeys: boolean; validKeys: string; value: any; }
 * @example getPathValue({a: [ 1, { b: {0: [ 3 ] } } ]}, 'a.1.b.0.0') === 3
 * getPathValue<123>({a: {b: 123} }, 'a.b') === 123
 * getPathValue({a: {b: null}}, 'a.b', true) => {isValidKeys: true, validKeys: 'a.b', value: null}
 * getPathValue<null>({a: {b: null}}, 'a.b', true) => {isValidKeys: true, validKeys: 'a.b', value: null}
 */
export function getPathValue<T = any>(obj: Obj, keyPath: string): T;
export function getPathValue<T = any>(obj: Obj, keyPath: string, check: false | undefined): T;
export function getPathValue<T = any>(
  obj: Obj,
  keyPath: string,
  check: true
): { isValidKeys: boolean; validKeys: string; value: T };
export function getPathValue(obj: Obj, keyPath: string, check?: boolean) {
  if (!obj || typeof obj !== 'object' || !keyPath) {
    console.warn('wrong obj or keyPath');
    return obj;
  }
  const arr = keyPath.split('.'), // .map((e) => e.trim()).filter((e) => !!e)
    valids: string[] | void = check ? [] : undefined;
  // curr初始值一定是非空的对象
  let curr: any = obj;
  for (const v of arr) {
    // 若中途curr是null或undefined，说明无法获取到最终目标值，应直接跳出循环，并手动设置curr为undefined以避免可能获取到null
    // e.g. getPathValue({a: null}, 'a.p') 属性a已经是null，null不存在属性p，若不手动将curr改为undefined则返回值是null，但属性不存在时获取到的应该是undefined
    if (curr == null) {
      curr = undefined;
      break;
    }
    check && v in (typeof curr === 'object' || typeof curr === 'function' ? curr : Object(curr)) && valids!.push(v);
    curr = curr[v];
  }
  return !check
    ? curr
    : {
        isValidKeys: valids!.length > 0 && arr.every((e, i) => e === valids![i]),
        validKeys: valids!.join('.'),
        value: curr
      };
}
