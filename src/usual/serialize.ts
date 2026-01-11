import type { Obj } from '../types';

/**
 * 将对象转为url param
 * @param obj
 * @returns string
 */
export function serialize(obj: Obj) {
  const arr: string[] = [];
  for (const i in obj) {
    arr.push(`${i}=${obj[i] ?? ''}`);
  }
  return arr.join('&');
}
