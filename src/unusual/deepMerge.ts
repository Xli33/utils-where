import { Obj } from '../types';
import { isObject } from './isObject';

/**
 * 深度合并对象与数组。仅检测对象自身的可枚举属性，忽略继承而来的
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
  if (!target || !source) return target;
  // 只合并 source 自身可枚举属性，不处理不可枚举及原型上的属性
  for (const [k, v] of Object.entries(source)) {
    // 优先尝试执行skipHandle，避免当 v === target[k] 时直接continue而漏执行skipHandle
    if (typeof skipHandle === 'function' && skipHandle(k, target, v)) continue;
    // 检测 target 上是否存在键 k，避免当 v 是 undefined 且 target 也木有键 k 时直接continue了，从而导致target上没有加上新的 k 键
    if (Object.hasOwn(target, k) && v === target[k]) continue;
    if (isObject(v) && isObject(target[k])) {
      deepMerge(target[k], v, skipHandle);
    } else {
      target[k] = v;
    }
  }
  return target;
}
