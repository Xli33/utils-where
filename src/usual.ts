import type { Func, Obj, TimeoutId } from './types';

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
 * @param keyPath e.g.: a.b.c.d
 * @param value
 * @returns object
 * @example makeObjectByPath('one.two.three', 0)
 * 返回结果 { one: { two: { three: 0 } } }
 */
export function makeObjectByPath(keyPath: string, value?: any) {
  let curr: Obj | null = {};
  if (!keyPath) return curr;
  const pureObj: Obj = curr,
    arr = keyPath.split('.'); //.map((e) => e.trim());
  // 根据 keyPath 构建配置对象
  for (let i = 0, len = arr.length; i < len; i++) {
    // if (!arr[i]) continue;
    curr = curr![arr[i]] = i < len - 1 ? {} : value;
  }
  curr = null;
  return pureObj;
}

/**
 * 获取给定对象的某属性值，路径以 . 形式，如 a.b.c.d，也适用于数组
 * @param obj
 * @param keyPath 键路径，如 home.head.title
 * @param check 检验 keyPath 是否有效。如对象{one:1}，keyPath为one.two，由于one上找不到属性“two”，故返回值里的 isValidKeys 是false
 * @returns any | { isValidKeys: boolean; validKeys: string; value: any; }
 * @example getPathValue({a: [ 1, { b: {0: [ 3 ] } } ]}, 'a.1.b.0.0') === 3
 * getPathValue<123>({a: {b: 123} }, 'a.b') === 123
 * getPathValue({a: {b: null}}, 'a.b', true) => {isValidKeys: true, validKeys: 'a.b', value: null}
 * getPathValue<null>({a: {b: null}}, 'a.b', true) => {isValidKeys: true, validKeys: 'a.b', value: null}
 */
export function getPathValue<T = any>(obj: Obj, keyPath: string): T;
export function getPathValue<T = any>(obj: Obj, keyPath: string, check: false | undefined): T;
export function getPathValue<T = any>(
  obj: Obj,
  keyPath: string,
  check: true
): { isValidKeys: boolean; validKeys: string; value: T };
export function getPathValue(obj: Obj, keyPath: string, check?: boolean) {
  if (!obj || typeof obj !== 'object' || !keyPath) {
    console.warn('wrong obj or keyPath');
    return obj;
  }
  const arr = keyPath.split('.'), // .map((e) => e.trim()).filter((e) => !!e)
    valids: string[] | void = check ? [] : undefined;
  // curr初始值一定是非空的对象
  let curr: any = obj;
  for (const v of arr) {
    // 若中途curr是null或undefined，说明无法获取到最终目标值，应直接跳出循环，并手动设置curr为undefined以避免可能获取到null
    // e.g. getPathValue({a: null}, 'a.p') 属性a已经是null，null不存在属性p，若不手动将curr改为undefined则返回值是null，但属性不存在时获取到的应该是undefined
    if (curr == null) {
      curr = undefined;
      break;
    }
    check && v in (typeof curr === 'object' || typeof curr === 'function' ? curr : Object(curr)) && valids!.push(v);
    curr = curr[v];
  }
  return !check
    ? curr
    : {
        isValidKeys: valids!.length > 0 && arr.every((e, i) => e === valids![i]),
        validKeys: valids!.join('.'),
        value: curr
      };
}

/**
 * 通过给定键路径为传入对象设置值
 * @param obj 需要通过keyPath设置value的对象
 * @param keyPath 以.分隔的键路径，如 a.b.c
 * @param value 设置的值
 * @returns 赋值成功则返回 true
 * @example const a = { one: { two: [ 3, {} ] } }
 * setPathValue(a, 'one.two.1.four', 1) === true
 * a.one.two[1].four === 1
 */
export function setPathValue(obj: Obj, keyPath: string, value?: any) {
  if (!obj || typeof obj !== 'object' || !keyPath) {
    console.warn('wrong obj or keyPath');
    return;
  }
  let curr = obj;
  const arr = keyPath.split('.'); //.map((e) => e.trim()).filter((e) => !!e);
  for (let i = 0, len = arr.length; i < len; i++) {
    // 若curr不是对象，则不能赋值，应直接return
    // 如 setPathValue({a: { b: 0 } }, 'a.b.c', 1)，传入对象的 a.b 是 0，不存在属性 c，故无法对其设置值（在严格模式下对原始值设置属性会报错）
    if (curr == null || (typeof curr !== 'object' && typeof curr !== 'function')) return;
    // 若循环至最后一个key，则进行赋值，否则继续循环
    i < len - 1 ? (curr = (<Obj>curr)[arr[i]]) : ((<Obj>curr)[arr[i]] = value);
    // if (i < len - 1) {
    //   curr = (<Obj>curr)[arr[i]];
    // } else {
    //   (<Obj>curr)[arr[i]] = value;
    // }
  }
  return true;
}

/**
 * @example 
			animate(
				500,
				(progress) => {
					box.style.transform =
						"translateX(" + progress * 300 + "px)";
				},
				easeOut,
			);
 */
// function animate(duration: number, draw: (num: number) => void, timing: (num: number) => number) {
//   const start = performance.now();
//   requestAnimationFrame(function loop(time) {
//     let timeFraction = (time - start) / duration;
//     if (timeFraction > 1) timeFraction = 1;
//     const progress = timing(timeFraction); // 使用缓动函数
//     draw(progress);
//     timeFraction < 1 && requestAnimationFrame(loop);
//   });
// }

const transit = {
  linear: (timeFraction: number) => timeFraction,
  easeOut: (timeFraction: number) => 1 - Math.pow(1 - timeFraction, 3),
  easeIn: (timeFraction: number) => Math.pow(timeFraction, 3),
  easeInOut: (timeFraction: number) =>
    timeFraction < 0.5 ? 4 * Math.pow(timeFraction, 3) : 1 - Math.pow(-2 * timeFraction + 2, 3) / 2
};

// function transit(type: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' = 'linear', timeFraction: number) {
//   if(type === 'easeIn') {
//     return 1 - Math.pow(1 - timeFraction, 3)
//   }
//   if(type === 'easeOut') {
//     return Math.pow(timeFraction, 3)
//   }
//   if(type === 'easeInOut') {
//     // 	timeFraction < 0.5
//     // 		? 2 * timeFraction * timeFraction
//     // 		: -1 + (4 - 2 * timeFraction) * timeFraction;
//     return timeFraction < 0.5 ? 4 * Math.pow(timeFraction, 3) : 1 - Math.pow(-2 * timeFraction + 2, 3) / 2
//   }
//   return 1 - Math.pow(1 - timeFraction, 3)
// }

type timingTypes = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
/**
 * 滚动元素内容至指定位置。未指定有效duration与type时尝试调用原生scroll({behavior:'smooth'})
 * @param el html element，未指定则使用根元素：html
 * @param duration 过渡持续时间，单位ms
 * @param top 滚动到指定的scrollTop
 * @param left 滚动到指定的scrollLeft
 * @param type 过渡曲线
 * @example
 * scroller({
 *  top: 0,
 *  // duration: 500,
 *  // type: 'easeOut'
 * })
 */
export function scroller({
  el,
  duration,
  top,
  left,
  type
}: {
  el?: Element;
  duration?: number;
  top?: number;
  left?: number;
  type?: timingTypes;
}) {
  if (!el) el = document.documentElement;
  if (el.scroll && !type && !duration) {
    el.scroll({
      top,
      left,
      behavior: 'smooth'
    });
    return;
  }
  if (!duration) duration = 500;
  const begin = performance.now(),
    curve = transit[type!] || transit.easeOut;
  let fromTop: number, fromLeft: number, disTop: number, disLeft: number, validTop: boolean, validLeft: boolean;
  if (typeof top === 'number') {
    fromTop = el.scrollTop;
    disTop = top - fromTop;
    validTop = disTop !== 0;
  }
  if (typeof left === 'number') {
    fromLeft = el.scrollLeft;
    disLeft = left - fromLeft;
    validLeft = disLeft !== 0;
  }
  requestAnimationFrame(function loop(now: number) {
    const timeElapsed = now - begin,
      progress = curve(Math.min(timeElapsed / duration, 1));
    if (validTop) {
      el.scrollTop = fromTop + disTop * progress;
    }
    if (validLeft) {
      el.scrollLeft = fromLeft + disLeft * progress;
    }
    timeElapsed < duration && requestAnimationFrame(loop);
  });
  // requestAnimationFrame(animateScroll);
}

/**
 * 滚动元素内容至顶部或底部，未指定duration与type则尝试调用原生scroll({behavior:'smooth'})
 * @param el html element，未指定则使用根元素：html
 * @param dir 'top' | 'bottom'
 * @param duration 过渡时间，单位ms
 * @param type 过渡曲线
 * @example toTopOrBottom()
 * toTopOrBottom(null, 'bottom')
 */
export function toTopOrBottom(el?: Element, dir: 'top' | 'bottom' = 'top', type?: timingTypes, duration: number = 500) {
  if (!el) el = document.documentElement;
  scroller({
    el,
    duration,
    top: dir === 'top' ? 0 : el.scrollHeight - el.clientHeight,
    type
  });
  // const scroll = () => {
  //   // console.log(dom.scrollTop);
  //   dom.scrollTop -= dom.scrollTop / 10 + step * (dom.scrollTop / 100);
  //   dom.scrollTop > 0 ? window.requestAnimationFrame(scroll) : cb && cb();
  // };
  // scroll();
}

interface Evt {
  [x: string]: ((...args: any[]) => any)[];
}
interface Emitter<T extends Evt> {
  evts: T;
  on<K extends keyof T>(name: K, func: T[K][number]): this;
  once<K extends keyof T>(name: K, func: T[K][number]): this;
  off<K extends keyof T>(name: K, func?: T[K][number]): this;
  emit(name: keyof T, ...args: any[]): this;
}
/**
 * event emitter
 *
 * @example
 * const emitter = Emitter()
 * emitter.on('some', (arg) => {console.log(arg)})
 *  .emit('some', 123).off('some')
 *
 * const emitter = Emitter<{
 *  hi: [(m: string) => void]
 *  tell: ((t: boolean) => boolean)[]
 * }>()
 * emitter
 *  .once('hi', (s) => alert(s))
 *  .on('tell', (s) => !!s)
 *  .emit('hi')
 *  .emit('tell')
 *  .off('tell')
 */
export function Emitter<T extends Evt>() {
  return {
    evts: {} as T,
    /**
     * add listener for given name
     * @param name listener type
     * @param func listener
     * @returns this
     * @example
     * Emitter().on('hi', (s) => { alert(s) }).emit('hi')
     * // with type
     * Emitter<{
     *  hi: [(m:string) => void]
     * }>().on('hi', (s) => { alert(s) }).emit('hi', 'hiii')
     */
    on<K extends keyof T>(name: K, func: T[K][number]): Emitter<T> {
      if (typeof name !== 'string' || typeof func !== 'function')
        throw new Error('require name of string and function');
      const list = this.evts[name];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Array.isArray(list) ? !list.includes(func) && list.push(func) : (this.evts[name] = [func]);
      return this;
    },
    /**
     * add listener only running once for given name
     * @param name listener type
     * @param func listener
     * @returns this
     * @example
     * Emitter().once('hi', (s) => { alert(s) }).emit('hi')
     * // with type
     * Emitter<{
     *  hi: [(m:string) => void]
     * }>().once('hi', (s) => { alert(s) }).emit('hi', 'hiii')
     */
    once<K extends keyof T>(name: K, func: T[K][number]): Emitter<T> {
      if (typeof func === 'function') (func as Obj)._once = true;
      return this.on(name, func);
    },
    /**
     * remove listener for given name
     * @param name listener type
     * @param func listener
     * @returns this
     * @example
     * const emitter = Emitter(),
     *       tell = (s) => alert(s)
     * emitter.on('hi', tell)
     *        .on('hi', (s) => alert('1: ' + s))
     *        .on('hi', (s) => alert('2: ' + s))
     *        // remove the "tell"
     *        .off('hi', tell)
     *        // remove all of the type 'hi'
     *        .off('hi')
     */
    off<K extends keyof T>(name: K, func?: T[K][number]): Emitter<T> {
      const arr = this.evts[name];
      if (!Array.isArray(arr)) return this;
      if (func == null) {
        // arr.splice(0);
        delete this.evts[name];
      } else {
        const index = arr.indexOf(func);
        index > -1 && arr.splice(index, 1) && arr.length < 1 && delete this.evts[name];
      }
      return this;
    },
    /**
     * call the listener for given name
     * @param name listener type
     * @param args arguments passed to listener
     * @returns this
     * @example
     * const say = (m: string) => console.log(m)
     * Emitter().once('runOnce', say)
     *          .emit('runOnce', 'called once only')
     *          .on('run', say)
     *          .emit('run', '1st run')
     *          .emit('run', '2st run')
     */
    emit(name: keyof T, ...args: any[]): Emitter<T> {
      const arr = this.evts[name];
      if (!Array.isArray(arr)) return this;
      for (let i = 0; i < arr.length; i++) {
        arr[i](...args);
        if ((arr[i] as Obj)._once) {
          arr.splice(i, 1);
          i--;
        }
      }
      arr.length < 1 && delete this.evts[name];
      return this;
    }
  };
}

interface ThrottleWrap<T extends Func> {
  (...args: Parameters<T>): ReturnType<T> | void;
  _last?: number;
  onEnd?: Func<{ _tid?: TimeoutId | null }>;
}
/**
 * get a throttled function, only to be called after `interval`. an `onEnd` listener could be added to the returned function
 * @param callback function to invoke every `interval` ms
 * @param interval milliseconds between each call
 * @returns function
 * @example
 * const o = {
 *  click: throttle(() => {console.log(this); return 1}, 1000),
 *  move: throttle(function () {console.log(this); return ''}, 500)
 * }
 *
 * o.click() === 1 // the logged 'this' is not o
 * o.move() === '' // the logged 'this' is o itself
 *
 * // add an end listener if need, maybe unnecessary in some events like 'mousemove'. and `onEnd` is in task queue
 * click.onEnd = () => console.log('the end call maybe unnecessary')
 */
export function throttle<T extends Func>(
  callback: T,
  interval: number
): ThrottleWrap<T> /* (...args: Parameters<T>) => ReturnType<T> | void */ {
  return function wrap(this: any, ...args: Parameters<T>) {
    if (Date.now() - ((<Obj>wrap)._last || 0) >= interval) {
      (<Obj>wrap).onEnd && clearTimeout((<Obj>wrap).onEnd._tid!);
      (<Obj>wrap)._last = Date.now();
      return callback.apply(this, args);
    }
    // debounceLast((<Obj>wrap).onEnd, interval).apply(this, args);
    if ((<Obj>wrap).onEnd) {
      clearTimeout((<Obj>wrap).onEnd._tid!);
      (<Obj>wrap).onEnd._tid = setTimeout(() => {
        (<Obj>wrap).onEnd._tid = null;
        (<Obj>wrap).onEnd.apply(this, args);
      }, interval);
    }
  };
}

interface DebounceFirstWrap<T extends Func> {
  (...args: Parameters<T>): ReturnType<T> | void;
  _tid?: number;
  flag?: true | null;
}
/**
 * the next call will be triggerd after `timeout` the last call went by
 * @param callback function to invoke only once till `timeout`
 * @param timeout  milliseconds
 * @returns function
 * @example
 * // not click for at least 1s and to be triggered
 * onclick = debounceFirst(() => console.log('1'), 1000)
 */
export function debounceFirst<T extends Func>(callback: T, timeout: number): DebounceFirstWrap<T> {
  return function wrap(this: any, ...args: Parameters<T>) {
    clearTimeout((<Obj>wrap)._tid);
    (<Obj>wrap)._tid = setTimeout(() => {
      (<Obj>wrap)._tid = (<Obj>wrap).flag = null;
    }, timeout);
    if ((<Obj>wrap).flag == null) {
      (<Obj>wrap).flag = true;
      return callback.apply(this, args);
    }
  };
}

interface DebounceLastWrap<T extends Func> {
  (...args: Parameters<T>): void;
  _tid?: number;
}
/**
 * each call will be **async** triggerd always after `timeout`
 * @param callback function to invoke only once after `timeout`
 * @param timeout milliseconds
 * @returns function
 * @example
 * // resize window and callback triggered only after 1s when stop resizing
 * onresize = debounceLast(() => console.log('only happens after 1s when stop'), 1000)
 *
 * // use clearTimeout to stop the next trigger if necessary
 * addEventListener('resize', debounceLast(() => {
 *  clearTimeout(onresize._tid);
 *  console.log('cleared')
 * }, 999))
 */
export function debounceLast<T extends Func>(callback: T, timeout: number): DebounceLastWrap<T> {
  return function wrap(this: any, ...args: Parameters<T>) {
    clearTimeout((<Obj>wrap)._tid);
    (<Obj>wrap)._tid = setTimeout(() => {
      (<Obj>wrap)._tid = null;
      callback.apply(this, args);
    }, timeout);
  };
}

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
