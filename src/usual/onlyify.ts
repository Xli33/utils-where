/**
 * deduplication for source array
 * @param source array to be deduplicated
 * @param compare compare function, return truthy for pushing the "only"
 * @returns deduplicated array
 * @example const arr = [{ id: 1 }, { id: 2 }, { id: 1, num: 3 }];
 * // get an array within only id: [{ id: 1 }, { id: 2 }]
 * onlyify(arr, (res, from) => res.every((e) => e.id !== from.id));
 *
 * // get an array within only id at last: [{ id: 2 }, { id: 1, num: 3 }]
 * onlyify(arr, (res, from) => arr.findLast((e) => e.id === from.id) === from && res.every((e) => e.id !== from.id));
 */
export function onlyify<T>(source: T[], compare: (result: T[], sourceItem: T) => boolean | void) {
  if (!Array.isArray(source)) return [];
  /* const map = {};
  for (const v of source) {
    if (!map.hasOwnProperty(v.id)) map[v.id] = v;
  }
  return Object.values(map); */
  const tmp: T[] = [];
  let item;
  for (let i = 0, len = source.length; i < len; i++) {
    item = source[i];
    // if (!tmp.some((e) => e.id == item.id)) tmp.push(item);
    // if (tmp.every((e, j) => compare(item, e, i, j))) tmp.push(item);
    if (compare(tmp, item)) tmp.push(item);
  }
  return tmp;
}
