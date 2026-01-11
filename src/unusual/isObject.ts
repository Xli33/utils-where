export function isObject(obj: any) {
  return obj != null && typeof obj === 'object';
  // return Object.prototype.toString.call(obj) === '[object Object]';
}
