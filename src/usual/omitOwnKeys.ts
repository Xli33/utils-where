import type { Obj } from '../types';

/**
 * 返回不含指定自有属性及不可枚举属性的新对象，或剔除给定对象的指定自有属性并返回该对象
 *
 * @param obj 源对象
 * @param excludes 忽略的`key[]`
 * @param inSelf 是否直接更改源对象
 * @returns 默认返回新对象
 * @example
    const tmp1 = omitOwnKeys({ a: 1, b: 2 }, ['b']);
    const tmp2 = omitOwnKeys({ a: 1, b: 2 } as const, ['b'] as const);
    const tmp3 = omitOwnKeys<{ a: 1; b: 2 }, ['a']>({ a: 1, b: 2 }, ['a']);
  
    // in vue sfc
    <template>
     <some-com v-bind="attrs" />
    </template>
    <script setup>
     const attrs = omitKeys(useAttrs(), ['id', 'class', 'style'])
    </script>
 */
export function omitOwnKeys<T extends Obj, K extends ReadonlyArray<keyof T>>(
  obj: T,
  excludes: K,
  inSelf?: boolean
): Omit<T, K[number]> {
  if (!excludes) excludes = [] as unknown as K;
  if (!inSelf) {
    const omitted = {} as T;
    Object.keys(obj).forEach((e) => {
      if (!excludes.includes(e)) omitted[e as K[number]] = obj[e];
    });
    return omitted;
  }
  excludes.forEach((e) => {
    delete obj[e];
  });
  return obj;
}
