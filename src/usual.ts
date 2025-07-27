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
  let curr: Obj | null = {};
  const pureObj: Obj = curr,
    arr = keyPath.split('.').map((e) => e.trim());
  // 根据 keyPath 构建配置对象
  for (let i = 0, len = arr.length; i < len; i++) {
    if (!arr[i]) continue;
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
    valids: string[] | void = check ? [] : undefined;
  let curr: any = obj;
  for (const v of arr) {
    // 进入循环，说明arr必然是包含非空key的数组，所以正常取到最终目标后，循环正好结束
    // 若curr是null或undefined，说明无法获取到最终目标值，应直接跳出循环，并手动设置curr为undefined以避免可能获取到null
    // eg. getPathValue({a: null}, 'a.p') 属性a已经是null，null不存在属性p，若不手动将curr改为undefined则返回值是null，但属性不存在时获取到的应该是undefined
    if (curr == null) {
      curr = undefined;
      break;
    }
    // in 必须用在对象类型上，否则会报错
    check && typeof curr === 'object' && v in curr && valids!.push(v);
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
  if (!obj || typeof obj !== 'object') {
    console.warn('obj is not an object');
    return;
  }
  let len,
    curr = obj;
  const arr = (keyPath || '')
    .split('.')
    .map((e) => e.trim())
    .filter((e) => !!e);
  if ((len = arr.length) < 0) return;
  for (let i = 0; i < len; i++) {
    // 进入循环，说明arr必然是包含非空key的数组，所以正常取到最终目标后，循环正好结束
    // 若curr不是对象，则不能赋值，应直接return
    // eg. 如 setPathValue({a: { b: 0 } }, 'a.b.c', 1)，传入对象的 a.b 是 0，不存在属性 c，故无法对其设置值（在严格模式下对原始值设置属性会报错）
    if (curr == null || typeof curr !== 'object') return;
    // 若循环至最后一个key，则进行赋值，否则继续循环
    if (i < len - 1) {
      curr = curr[arr[i]];
    } else {
      curr[arr[i]] = value;
    }
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
  let fromTop: number,
    fromLeft: number,
    disTop: number,
    disLeft: number,
    validTop: boolean,
    validLeft: boolean;
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
export function toTopOrBottom(
  el?: Element,
  dir: 'top' | 'bottom' = 'top',
  type?: timingTypes,
  duration: number = 500
) {
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
