import type { Obj } from '../types';

/**
 * 按给定key路径及末端值生成对应格式对象
 * @param keyPath e.g.: a.b.c.d
 * @param value
 * @returns object
 * @example makeObjectByPath('one.two.three', 0)
 * 返回结果 { one: { two: { three: 0 } } }
 */
export function makeObjectByPath(keyPath: string, value?: any) {
  let curr: Obj | null = {};
  if (!keyPath) return curr;
  const pureObj: Obj = curr,
    arr = keyPath.split('.'); //.map((e) => e.trim());
  // 根据 keyPath 构建配置对象
  for (let i = 0, len = arr.length; i < len; i++) {
    // if (!arr[i]) continue;
    curr = curr![arr[i]] = i < len - 1 ? {} : value;
  }
  curr = null;
  return pureObj;
}
