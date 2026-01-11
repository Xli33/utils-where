/**
 * 从arr中删除items里的元素
 * @param arr 需要删除指定项的数组
 * @param items 要从arr中移除掉的项
 * @returns 删除了给定项的源数组arr
 * @example delArrItemByVal([2, '', alert, console, false, NaN], ['', alert, console, NaN]) => [2, false]
 */
export function delArrItemByVal(arr: any[], items: any[]) {
  if (!Array.isArray(arr) || !Array.isArray(items)) return arr;
  let index;
  for (const v of items) {
    // 唯一与自身不等的只有NaN，indexOf使用严格相等（与 === 运算符使用的算法相同），故indexOf(NaN)结果是 -1。此处通过findIndex单独查找NaN的索引
    index = !Number.isNaN(v) ? arr.indexOf(v) : arr.findIndex((e) => Number.isNaN(e) /* e !== e */);
    index > -1 && arr.splice(index, 1);
  }
  return arr;
}
