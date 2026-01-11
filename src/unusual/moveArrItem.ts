/**
 * 移动数组某项
 * @param arr 数组
 * @param from 移动前的index
 * @param to 移动后的index
 */
export function moveArrItem(arr: any[], from: number, to: number) {
  if (Array.isArray(arr) && arr.length > 0 && from != undefined && to != undefined) {
    arr.splice(to, 0, ...arr.splice(from, 1));
  }
  return arr;
}
