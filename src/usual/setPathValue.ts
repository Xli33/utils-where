import type { Obj } from '../types';

/**
 * 通过给定键路径为传入对象设置值
 * @param obj 需要通过keyPath设置value的对象
 * @param keyPath 以.分隔的键路径，如 a.b.c
 * @param value 设置的值
 * @returns 赋值成功则返回 true
 * @example const a = { one: { two: [ 3, {} ] } }
 * setPathValue(a, 'one.two.1.four', 1) === true
 * a.one.two[1].four === 1
 *
 * 特殊情况：某层key本身是点连接的字符串，如 { a: { 'b.c': { d: 1 } } }
 * const p = { a: { 'b.c': { d: 1 } } }
 * setPathValue(p, 'a.[b.c].d', 2)
 * p.a['b.c'].d === 2
 */
export function setPathValue(obj: Obj, keyPath: string, value?: any) {
  if (!obj || typeof obj !== 'object' || !keyPath) {
    console.warn('wrong obj or keyPath');
    return;
  }
  let curr = obj;
  const arr = Array.from(keyPath.matchAll(/([^.[\]]+)|\[(.*?)\]/g), (m) => m[1] || m[2]); //keyPath.split('.'); //.map((e) => e.trim()).filter((e) => !!e);
  for (let i = 0, len = arr.length; i < len; i++) {
    // 若curr不是对象，则不能赋值，应直接return
    // 如 setPathValue({a: { b: 0 } }, 'a.b.c', 1)，传入对象的 a.b 是 0，不存在属性 c，故无法对其设置值（在严格模式下对原始值设置属性会报错）
    if (curr == null || (typeof curr !== 'object' && typeof curr !== 'function')) return;
    // 若循环至最后一个key，则进行赋值，否则继续循环
    i < len - 1 ? (curr = (<Obj>curr)[arr[i]]) : ((<Obj>curr)[arr[i]] = value);
    // if (i < len - 1) {
    //   curr = (<Obj>curr)[arr[i]];
    // } else {
    //   (<Obj>curr)[arr[i]] = value;
    // }
  }
  return true;
}
