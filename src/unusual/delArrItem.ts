/**
 * 根据给定索引删除源数组对应项
 * @param arr any[]
 * @param indexes 包含待删除索引的数组
 * @returns 包含被删除项的数组
 * @example delArrItem([null, 5, 'as', {}, false], [3,1,7]) => [5, {}]
 */
export function delArrItem(arr: any[], indexes: number[]) {
  if (!Array.isArray(arr) || !Array.isArray(indexes)) return [];
  const len = arr.length,
    res: any[] = [];
  new Set(indexes.filter((e) => e >= 0 && e < len).sort((a, b) => b - a)).forEach((e) => {
    res.unshift(arr.splice(e, 1)[0]);
  });
  return res;
}
