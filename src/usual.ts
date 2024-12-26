import type { Obj } from './types';

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

/**
 * 获取给定对象的某属性值，路径以 . 形式，如 a.b.c.d
 * @param obj
 * @param keyPath
 * @returns any
 * @example getPathValue({a: []}, 'a')
 * getPathValue({a: {b: 123} }, 'a.b')
 */
export const getPathValue = (obj: Obj, keyPath: string): any => {
  if (typeof obj !== 'object') {
    console.warn('typeof obj is not object');
    return obj;
  }
  if (!keyPath) return '';
  const arr = keyPath.split('.');
  let curr = obj;
  for (const v of arr) {
    if (!v) continue;
    curr = curr[v];
    if (typeof curr !== 'object') break;
  }
  return curr;
};

/**
 * 变速滚动元素内容至顶部
 * @param selector css selector
 * @param step the bigger, the faster
 * @param cb callback after scrolling done
 */
export const backToTop = (selector = 'html', step = 5, cb?: () => void) => {
  const dom = document.querySelector(selector);
  if (!dom) return;
  const scroll = () => {
    // console.log(dom.scrollTop);
    dom.scrollTop -= dom.scrollTop / 10 + step * (dom.scrollTop / 100);
    dom.scrollTop > 0 ? window.requestAnimationFrame(scroll) : cb && cb();
  };
  scroll();
};

// todo
// export const scrollTo = (
//   el = document.documentElement,
//   top: number,
//   left: number,
//   // speed = 5,
//   // cb?: () => void
// ) => {
//   if (el.scroll) {
//     el.scroll({
//       top,
//       left,
//       behavior: 'smooth'
//     });
//     return;
//   }
// };

/**
 * 复制到剪贴板
 * @param val
 * @returns boolean
 */
export function setClipboard(val: string) {
  if (!val) return;
  const el = document.createElement('textarea');
  el.value = val;
  el.readOnly = true;
  el.style.position = 'fixed';
  el.style.top = '0';
  el.style.left = '0';
  el.style.zIndex = '-1';
  el.style.opacity = '0';
  document.body.appendChild(el);
  el.select();
  el.setSelectionRange(0, val.length);
  const res = document.execCommand('copy');
  el.remove();
  return res;
}

/**
 * 通过id判断性别 1：男，2：女
 * @param id
 * @returns 1: male, 2: female
 */
export function getSexById(id: string) {
  return id ? (Number(id.slice(-2, -1)) % 2 !== 0 ? 1 : 2) : null;
}

/**
 * 通过id获取出生日期
 * @param id
 * @returns YYYY-MM-DD
 */
export function getBirthById(id: string) {
  return id ? id.slice(6, 14).replace(/(\d{4})(\d{2})/, '$1-$2-') : '';
}
