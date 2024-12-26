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
 * 按给定key路径及末端值生成对应格式对象
 * @param keyPath eg: a.b.c.d
 * @param value
 * @returns object
 * @example makeObjectByPath('one.two.three', 0)
 * 返回结果 { one: { two: { three: 0 } } }
 */
export function makeObjectByPath(keyPath: string, value?: any): Obj {
  let curr: Obj = {};
  const pureObj: Obj = curr,
    arr = keyPath.split('.').map((e) => e.trim());
  // 根据 keyPath 构建配置对象
  for (let i = 0, len = arr.length; i < len; i++) {
    if (!arr[i]) continue;
    curr = curr[arr[i]] = i < len - 1 ? {} : value;
  }
  curr = null;
  return pureObj;
}

/**
 * 获取给定对象的某属性值，路径以 . 形式，如 a.b.c.d，也适用于数组
 * @param obj
 * @param keyPath 键路径，如 home.head.title
 * @param check 检验 keyPath 是否有效。如对象{one:1}，keyPath为one.two，由于one上找不到属性“two”，故返回值里的 isValidKeys 是false
 * @returns any
 * @example getPathValue({a: [ 1, { b: {0: [ 3 ] } } ]}, 'a.1.b.0.0') === 3
 * getPathValue({a: {b: 123} }, 'a.b')
 * getPathValue({a: {b: null}}, 'a.b', true) => {isValidKeys: true, validKeys: 'a.b', value: null}
 */
export function getPathValue(obj: Obj, keyPath: string, check?: boolean): any {
  if (!obj || typeof obj !== 'object') {
    console.warn('obj is not an object');
    return obj;
  }
  const arr = (keyPath || '')
      .split('.')
      .map((e) => e.trim())
      .filter((e) => !!e),
    valids: string[] = check ? [] : undefined;
  let curr = obj;
  for (const v of arr) {
    // 进入循环，说明arr必然是包含非空key的数组，所以正常取到最终目标后，循环正好结束
    // 若curr是null或undefined，说明无法获取到最终目标值，应直接跳出循环，并手动设置curr为undefined以避免可能获取到null
    // eg. getPathValue({a: null}, 'a.p') 属性a已经是null，null不存在属性p，若不手动将curr改为undefined则返回值是null，但属性不存在时获取到的应该是undefined
    if (curr == null) {
      curr = undefined;
      break;
    }
    // in 必须用在对象类型上，否则会报错
    check && typeof curr === 'object' && v in curr && valids.push(v);
    curr = curr[v];
  }
  return !check
    ? curr
    : {
        isValidKeys: valids.length > 0 && arr.every((e, i) => e === valids[i]),
        validKeys: valids.join('.'),
        value: curr
      };
}

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
