import { Obj } from '../types';

/**
 * 使用给定string结合随机数生成唯一id
 * @param prefix id前缀，默认无前缀
 * @param level 调用Math.random时的取值范围，默认 100
 * @param step 取到重复值时会将 step 加到 level 上重新计算随机值，默认 50
 * @returns prefix + random uid
 */
export function genUID(prefix: string = '', level = 100, step = 50): string {
  if (!(<Obj>genUID).uids) (<Obj>genUID).uids = new Set();
  const uids: Set<string> = (<Obj>genUID).uids;
  let uid;
  while (true) {
    uid = prefix + ~~(Math.random() * level);
    if (!uids.has(uid)) break;
    level += step;
  }
  uids.add(uid);
  return uid;
}
