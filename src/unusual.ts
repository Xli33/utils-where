/* eslint-disable @typescript-eslint/no-this-alias */
import type { List, Obj, CustomBar, Scroller, Thumb } from './types';
import { getPathValue } from './usual';

/**
 * 替换字符串中的 "%s"
 *
 * 当第二个参数是对象时，以相应的属性值替换字符串中的“{}”插值部分
 *
 * @returns string
 * @example sprintf('hel %s %s', 'l', 'o');
 * sprintf('he{a} {b.c}', {a: 'l', b: {c: 'lo'}})
 */
// export function sprintf(...[str, ...args]: [string, ...((string | number)[] | [object])]): string {
export function sprintf(str: string, ...args: (string | number)[] | [object]) {
  if (typeof str !== 'string') {
    console.warn('the 1st argument must be a string!');
    return '';
  }

  // if(rep == undefined) return str
  const rep = args[0];
  if (typeof rep === 'string' || typeof rep === 'number') {
    /*var i
        for (i = 1; i < argLen; i++) {
            str = str.replace('%s', arguments[i])
        }
        return str*/

    let i = 0;
    return str.replace(/%s/g, () => <string>args[i++] ?? '%s');
  }

  // e.g. the return value of sprintf('{a.b}', {a: {b: 33}}) should be string 33
  if (rep != null && typeof rep === 'object') {
    // const chars = str.match(/{[^{}]+}/g);
    // if (chars) {
    //   for (const v of chars) {
    //     str = str.replace(v, getPath(rep, v.replace(/[{}]/g, '')) ?? '');
    //   }
    // }
    // return str;
    return str.replace(/{[^{}]+}/g, (v) => getPathValue(rep, v.replace(/[{}]/g, '')) ?? '');
  }

  return str;
}

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

/**
 * 获取滚动条尺寸
 * @param force 是否重新计算一次
 * @returns 滚动条尺寸
 */
export function getScrollBarSize(force?: boolean): number {
  if (force || (<Obj>getScrollBarSize).barSize === undefined) {
    const outer = document.createElement('div'),
      style = outer.style;
    style.position = 'absolute';
    style.top = '0';
    style.left = '0';
    style.zIndex = '-1';
    style.visibility = 'hidden';
    style.width = '50px';
    style.height = '50px';
    style.overflow = 'scroll';
    style.pointerEvents = 'none';
    document.body.appendChild(outer);
    (<Obj>getScrollBarSize).barSize = outer.offsetWidth - outer.clientWidth;
    document.body.removeChild(outer);
  }
  return (<Obj>getScrollBarSize).barSize;
}

export function isObject(obj: any) {
  return obj != null && typeof obj === 'object';
  // return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * 深度合并对象与数组。仅检测对象自身的属性，忽略继承而来的
 * @param target 待合并的目标对象或数组
 * @param source 深度合并至target的对象或数组
 * @param skipHandle 单独处理合并过程中的每一项，返回Truthy则不进行深度合并
 * @returns target
 */
export function deepMerge(
  target: Obj,
  source: Obj,
  skipHandle?: (key: string, target: Obj, from: any) => boolean | void
) {
  if (!target || !source) return target;
  // 只合并 source 自身可枚举属性，不处理不可枚举及原型上的属性
  for (const [k, v] of Object.entries(source)) {
    // 检测 target 上是否存在键 k，避免当 v 是 undefined 且 target 也木有键 k 时直接continue了，从而导致target上没有加上新的 k 键
    if (Object.hasOwn(target, k) && v === target[k]) continue;
    if (typeof skipHandle === 'function' && skipHandle(k, target, v)) continue;
    if (isObject(v) && isObject(target[k])) {
      deepMerge(target[k], v, skipHandle);
    } else {
      target[k] = v;
    }
  }
  return target;
}

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
 * 异步复制到剪贴板
 * @param val
 * @returns Promise<void> | Promise<boolean | undefined>
 *
 * @example
 * const res = await asyncCopy('1')
 */
export function asyncCopy(val: string) {
  /*
   * 由于浏览器对clipboard的支持比 ?. 早的多，按理来说支持 ?. 的一定支持clipboard，此处的 clipboard?.writeText 应当是无意义的，可以改成 clipboard ? clipboard.writeText : Promise.resolve
   * 但考虑到clipboard仅在安全域下可用，在非localhost域的http站点上是无法访问clipboard的，即使客户端支持 ?. 写法，所以此处可以考虑依旧用clipboard?.writeText
   * 并且最终打包时是否要兼容不支持 ?. 的老平台也是由开发者决定的，综上此处还是使用 ?.writeText
   */
  return val
    ? navigator.clipboard
        ?.writeText(val)
        .then(() => true)
        .catch(() => setClipboard(val)) || Promise.resolve(setClipboard(val))
    : Promise.resolve();
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

/**
 * 自定义滚动条对象
 *
 * @example
 * // 只给窗口本身使用时仅需为html添加scroller类并调用attach，无需传参
 * <html class="scroller"> & Scrollbar.attach()
 * @example
 * // 给局部元素使用，为便于监测滚动容器&内容区域的尺寸变化，应符合类似下列结构
 * <!-- 用于包裹滚动容器&滚动条的非静态定位元素，添加定位属性如style="position:relative"以适配不支持原生:has()的环境 -->
 * <div style="width:200px;height:200px">
 *  <!-- 滚动容器。必须添加scroller类，添加fill类以继承父元素高度（便于调整样式） -->
 *  <div class="scroller fill">
 *   <!-- 内容区域，如列表 -->
 *   <div id="list"></div>
 *  </div>
 * </div>
 *
 * Scrollbar.attach(document.getElementById('list'))
 *
 * // attach支持链式调用
 * Scrollbar.attach().attach(document.querySelector('.list'))
 */
export const Scrollbar: CustomBar = {
  // 移动端上应该不需要用到吧~ ~
  // 具体到特定环境 Scrollbar.disabled = Scrollbar.disabled && /Firefox|Linux|Macintosh/.test(navigator.userAgent)
  disabled: /*@__PURE__*/ (() =>
    typeof ResizeObserver !== 'function' ||
    (navigator as Navigator & { userAgentData: { mobile?: boolean } }).userAgentData?.mobile ||
    navigator.userAgent.includes('Mobile'))(),
  // 是否在使用滚动条时清除已选项
  clearSelection: null,
  // 是否在使用滚动条时阻止默认的selectstart事件
  stopSelect: null,
  // 是否监听body&html的样式
  watchPageStyle: null,
  // 更新滚动条尺寸后是否同步位置
  syncPos: null,
  _stylingPage: null,
  get stylingPage() {
    return this._stylingPage;
  },
  set stylingPage(v) {
    this._stylingPage = v;
    setTimeout(() => {
      // console.log('stylingPage')
      this._stylingPage = null;
    });
  },
  getBar(el) {
    const isPage = el === document.documentElement,
      scrollTarget = (isPage ? document.documentElement : el.parentElement!) as Scroller,
      { barX, barY /*thumbX, thumbY*/ } = scrollTarget._scrollbars || {};

    return {
      isPage,
      barX,
      barY,
      thumbX: barX?.firstChild as Thumb,
      thumbY: barY?.firstChild as Thumb,
      scrollTarget
    };
    /*let scope, isPage
          if (!el || el === document.documentElement) {
            scope = 'body'
            isPage = true
          } else {
            scope = ':scope'
          }
          const parent = el.parentNode
          return {
            isPage,
            barX: parent.querySelector(scope + '>.scrollbar-x'),
            barY: parent.querySelector(scope + '>.scrollbar-y'),
            thumbX: parent.querySelector(scope + '>.scrollbar-thumb-x'),
            thumbY: parent.querySelector(scope + '>.scrollbar-thumb-y')
          }*/
  },
  remove(el) {
    // for(const k in el._scrollbars){
    //   el._scrollbars[k].remove()
    // }
    el._scrollbars!.barX.remove();
    el._scrollbars!.barY.remove();
    el._scrollbars = null;
    if (el === document.documentElement) {
      this.pageWatcher!.disconnect();
      this.pageWatcher = null;
    }
  },
  attach(el = document.scrollingElement as HTMLElement) {
    if (this.disabled || !(el instanceof HTMLElement)) return this;
    if (el === document.body) el = document.documentElement;
    const isPage = el === document.documentElement;
    !this.sizeWatcher && this.init!();
    this.sizeWatcher!.unobserve(el); // maybe unnecessary
    this.sizeWatcher!.observe(el);
    if (!isPage) {
      this.scrollerWatcher!.unobserve(el.parentElement!);
      this.scrollerWatcher!.observe(el.parentElement!);
    } else if (this.watchPageStyle && !this.pageWatcher) {
      // 监听body或者html的css变化，常见库会通过给body设置overflow:hidden来隐藏页面滚动条。可按需启用
      this.pageWatcher = new MutationObserver((mutations) => {
        if (
          !this.stylingPage &&
          mutations.some((e) => e.type === 'attributes' && (e.attributeName === 'style' || e.attributeName === 'class'))
        ) {
          //console.log('mutations updatebar')
          // this.updateBar(document.body);
          const html = document.documentElement as Scroller,
            { overflowX, overflowY } = getComputedStyle(document.body),
            { overflowX: pageOX, overflowY: pageOY } = getComputedStyle(html),
            regx = /hidden|clip/;
          html._scrollbars!.barX.hidden = regx.test(overflowX) || regx.test(pageOX);
          html._scrollbars!.barY.hidden = regx.test(overflowY) || regx.test(pageOY);
        }
      });
      this.pageWatcher.observe(document.body, {
        attributes: true
      });
      this.pageWatcher.observe(document.documentElement, {
        attributes: true
      });
    }
    return this;
  },
  updatePos(thumbX, thumbY, scrollTarget) {
    if (!thumbY.parentElement!.hidden) {
      thumbY.style.top = +(thumbY._ratio * scrollTarget.scrollTop).toFixed(0) + 'px'; //(100 * scrollTarget.scrollTop) / scrollTarget.scrollHeight + '%'
    }
    if (!thumbX.parentElement!.hidden) {
      thumbX.style.left = +(thumbX._ratio * scrollTarget.scrollLeft).toFixed(0) + 'px'; //(100 * scrollTarget.scrollLeft) / scrollTarget.scrollWidth + '%'
    }
  },
  getDownData(dir, bar, thumb, scrollTarget) {
    const arr = (
        {
          X: ['offsetWidth', 'scrollWidth', 'clientWidth', 'scrollLeft'],
          Y: ['offsetHeight', 'scrollHeight', 'clientHeight', 'scrollTop']
        } as const
      )[dir],
      distance = bar[arr[0]] - thumb[arr[0]];
    // ratio = distance / (scrollTarget[arr[1]] - scrollTarget[arr[2]])
    // console.log(thumb.getBoundingClientRect().top - bar.getBoundingClientRect().top, scrollTarget[arr[3]] * ratio)
    return {
      distance,
      // ratio,
      lastScroll: +(scrollTarget[arr[3]] * thumb._ratio).toFixed(0) //thumb.getBoundingClientRect().top - bar.getBoundingClientRect().top
      // fromX: e.clientX,
    };
  },
  mouseMove(dir, type, pos, distance, /*ratio,*/ thumb, scrollTarget) {
    pos = pos <= 0 ? 0 : pos >= distance ? distance : pos;
    thumb.style[dir] = pos + 'px';
    // setTimeout(() => {
    scrollTarget[type] = +(pos / thumb._ratio).toFixed(0);
    // })
    // scrollTarget.scroll({
    // 	[dir]: pos / ratio,
    // 	// behavior: Math.abs((pos - (this.prev || 0))) / distance >= .1 ?  'smooth' : 'auto'
    // })
    // console.log(distance, Math.abs((pos - (this.prev || 0))) / distance >= .1)
    // if(this.prev !== pos) this.prev = pos
  },
  // document上触发mouseup时解绑相关事件，并设置在捕获阶段以保证触发，因为滚动条祖先元素可以阻止事件冒泡
  addMouseUp(onmousemove, listenOn, scrollTarget, onScroll) {
    const that = this;
    document.addEventListener(
      'mouseup',
      function onmouseup() {
        this.removeEventListener('mousemove', onmousemove, true);
        this.removeEventListener('mouseup', onmouseup, true);
        listenOn.addEventListener('scroll', onScroll);
        scrollTarget.addEventListener('mousemove', that.showBar, true);
        that.stylingPage = true;
        that.hideBar(scrollTarget);
        this.body.classList.remove('init-cursor');
      },
      true
    );
  },
  // 调整滚动条
  updateBar(container) {
    const { isPage, barX, barY, thumbX, thumbY, scrollTarget } = this.getBar(container);
    const regx = new RegExp((isPage ? 'visible|' : '') + 'auto|scroll|overlay'),
      computedCss = getComputedStyle(scrollTarget),
      bodyCss = isPage ? getComputedStyle(document.body) : null;
    // 存在垂直滚动条
    if (
      scrollTarget.scrollHeight > scrollTarget.clientHeight &&
      computedCss.overflowY.match(regx) &&
      (!isPage || bodyCss!.overflowY.match(regx))
    ) {
      barY!.hidden = false;
      thumbY!.style.height = (100 * scrollTarget.clientHeight) / scrollTarget.scrollHeight + '%'; //(barY.offsetHeight * scrollTarget.clientHeight) / scrollTarget.scrollHeight + 'px'
      thumbY!._ratio =
        (barY!.offsetHeight - thumbY!.offsetHeight) / (scrollTarget.scrollHeight - scrollTarget.clientHeight);
    } else {
      barY!.hidden = true;
    }
    // 存在水平滚动条
    if (
      scrollTarget.scrollWidth > scrollTarget.clientWidth &&
      computedCss.overflowX.match(regx) &&
      (!isPage || bodyCss!.overflowX.match(regx))
    ) {
      barX!.hidden = false;
      thumbX!.style.width = (100 * scrollTarget.clientWidth) / scrollTarget.scrollWidth + '%';
      thumbX!._ratio =
        (barX!.offsetWidth - thumbX!.offsetWidth) / (scrollTarget.scrollWidth - scrollTarget.clientWidth);
    } else {
      barX!.hidden = true;
    }
    this.syncPos && this.updatePos(thumbX!, thumbY!, scrollTarget);
  },
  // 按需显示滚动条
  showBar() {
    // const obj = this === window ? document.documentElement : this
    if (this.classList.contains('baring') || Date.now() - this._scrollAt! < 3000) return;
    // console.log(1)
    this._scrollAt = Date.now();
    clearTimeout(this._scrollTid!);
    !this.classList.contains('show-bar') && this.classList.add('show-bar');
    if (this === document.documentElement) {
      Scrollbar.stylingPage = true;
    }
    Scrollbar.hideBar(this);
  },
  hideBar(obj) {
    obj._scrollTid = setTimeout(() => {
      // console.log('!!')
      if (obj === document.documentElement) {
        this.stylingPage = true;
      }
      obj._scrollTid = obj._scrollAt = null;
      obj.classList.contains('show-bar') && obj.classList.remove('show-bar');
    }, 3500) as any;
  },
  init() {
    // 观测滚动元素内容区域
    this.sizeWatcher = new ResizeObserver((entries, ob) => {
      // console.log(entries)
      entries.forEach((e) => {
        const list = e.target as List;
        // unobserve if node is removed
        if (!list.isConnected) {
          ob.unobserve(list);
          if (!list.parentElement) {
            list._scrollbars!.forEach((e) => (e.hidden = true));
            list._scrollbars = null;
            return;
          }
          if (!list.parentElement.isConnected) {
            // this.remove(list.parentElement as Scroller);
            return;
          }
        }
        const { isPage, scrollTarget } = this.getBar(list);
        if (!scrollTarget._scrollbars) {
          let insider, listenOn;
          if (isPage) {
            insider = document.body;
            listenOn = window;
          } else {
            insider = scrollTarget.parentNode;
            listenOn = scrollTarget;
          }
          const barX = document.createElement('div'),
            barY = barX.cloneNode() as HTMLDivElement,
            thumbX = barX.cloneNode() as Thumb,
            thumbY = barX.cloneNode() as Thumb;
          barX.append(thumbX);
          barY.append(thumbY);
          barX.className = 'scrollbar scrollbar-x non-select';
          barY.className = 'scrollbar scrollbar-y non-select';
          thumbX.className = 'scrollbar-thumb scrollbar-thumb-x';
          thumbY.className = 'scrollbar-thumb scrollbar-thumb-y';

          let onmousemove: (e: MouseEvent) => void;
          const onScroll = () => {
              // console.log('scrolling')
              this.showBar.call(scrollTarget /*e.currentTarget*/);
              this.updatePos(thumbX, thumbY, scrollTarget);
            },
            handleDown = (e: MouseEvent) => {
              clearTimeout(scrollTarget._scrollTid!);
              listenOn.removeEventListener('scroll', onScroll);
              scrollTarget.removeEventListener('mousemove', this.showBar, true);
              document.addEventListener('mousemove', onmousemove, true);
              this.addMouseUp(onmousemove, listenOn, scrollTarget, onScroll);
              this.clearSelection && window.getSelection()!.empty();
              this.stylingPage = true;
              document.body.classList.add('init-cursor');
              // 阻止mousedown的默认行为，如在chrome上按下鼠标时也会触发selectstart事件，在此preventDefault()则不会触发selectstart
              // firefox上选取了内容时才会触发selectstart，除非元素的user-select值为all（此时单击会直接选择全部）
              this.stopSelect && e.preventDefault();
            };
          listenOn.addEventListener('scroll', onScroll);
          scrollTarget.addEventListener('mousemove', this.showBar, true);

          barX.onmousedown = (e) => {
            if (e.target !== thumbX) return;
            const fromX = e.clientX,
              { distance, /*ratio,*/ lastScroll } = this.getDownData('X', barX, thumbX, scrollTarget);
            onmousemove = (te) => {
              this.mouseMove(
                'left',
                'scrollLeft',
                lastScroll + te.clientX - fromX,
                distance,
                // ratio,
                thumbX,
                scrollTarget
              );
              // console.log(ratio, pos, scrollTarget.scrollLeft);
            };
            handleDown(e);
          };
          barY.onmousedown = (e) => {
            if (e.target !== thumbY) return;
            const fromY = e.clientY,
              { distance, /*ratio,*/ lastScroll } = this.getDownData('Y', barY, thumbY, scrollTarget);
            onmousemove = (te) => {
              this.mouseMove(
                'top',
                'scrollTop',
                lastScroll + te.clientY - fromY,
                distance,
                // ratio,
                thumbY,
                scrollTarget
              );
            };
            handleDown(e);
          };
          barX.onclick = (e) =>
            e.target === e.currentTarget &&
            scrollTarget.scroll({
              behavior: 'smooth',
              left: (scrollTarget.scrollWidth * e.offsetX) / (e.target as HTMLElement).offsetWidth
            });
          barY.onclick = (e) =>
            e.target === e.currentTarget &&
            scrollTarget.scroll({
              behavior: 'smooth',
              top: (scrollTarget.scrollHeight * e.offsetY) / (e.target as HTMLElement).offsetHeight
            });
          scrollTarget._scrollbars = {
            barX,
            barY
            // thumbX,
            // thumbY
          };
          insider!.append(barX, barY);
        }
        if (!list._scrollbars) {
          // console.log('1st time list bars');
          list._scrollbars = [scrollTarget._scrollbars.barX, scrollTarget._scrollbars.barY];
        }
        // console.log('updated ', list)
        this.updateBar(list);
        list._barUpdated = true;
        setTimeout(() => {
          list._barUpdated = null;
        });
      });
    });

    // 观测滚动元素自身
    // 非针对window时，除了监听list容器的尺寸变化，还需监听list父元素（设置了overflow且class包含scroller的可滚动容器）的尺寸变化，因为滚动条的大小由可滚动元素的内容&尺寸共同决定
    this.scrollerWatcher = new ResizeObserver((parentEntries, parentOb) => {
      // console.log(parentEntries)
      parentEntries.forEach((e) => {
        const { target } = e;
        if (!target.isConnected) {
          parentOb.unobserve(target);
          // remove custom scrollbar if parentNode is removed
          this.remove(target as Scroller);
          return;
        }
        const childs = Array.from(target.children) as List[],
          el =
            childs.length === 1
              ? childs[0]
              : childs.find((e) => e.hasOwnProperty('_barUpdated')); /*target.querySelector(':scope>[]')*/
        if (el && !el._barUpdated) {
          // console.log('updated parent', el)
          this.updateBar(el!);
        }
      });
    });

    const css = document.createElement('style'),
      targetClass = '.scroller',
      barClass = '.scrollbar',
      notRule = ':not(.baring):not(.show-bar)';

    css.textContent =
      `body :has(>${targetClass}){position:relative}${targetClass}{scrollbar-width:none}${targetClass}::-webkit-scrollbar{display:none;width:0;height:0}` +
      `${targetClass}:not(html){overflow:auto}${targetClass}${notRule}>body>${barClass},${targetClass}${notRule}~${barClass}{visibility:hidden;opacity:0}` +
      `${targetClass}.fill{height:inherit;min-height:inherit;max-height:inherit}${barClass}{position:absolute;z-index:10;transition:visibility .1s,opacity .1s}` +
      `body>${barClass}{position:fixed}${barClass}-x{right:0;bottom:0;left:0;height:12px}${barClass}-y{top:0;right:0;bottom:0;width:12px}` +
      `${barClass}-thumb{box-sizing:border-box;position:absolute;opacity:.3;transition:padding .1s}${barClass}-thumb:hover{opacity:.5}` +
      `${barClass}-thumb:active{opacity:.7}${barClass}-thumb::before{content:"";display:block;width:100%;height:100%;background:currentColor;border-radius:5px}` +
      `${barClass}-thumb-x{left:0;min-width:40px;height:100%;padding:5px 10px}${barClass}-thumb-y{top:0;width:100%;min-height:40px;padding:10px 5px}` +
      `${barClass}-x:hover>${barClass}-thumb-x{padding:3px 10px}${barClass}-y:hover>${barClass}-thumb-y{padding:10px 3px}` +
      '.non-select{-webkit-user-select:none;user-select:none}.init-cursor{cursor:default}';

    document.head.prepend(css);

    // 这段应该不需要了，直接在mousedown中可以提前取消selectstart
    // if (this.stopSelect) {
    // 	document.addEventListener(
    // 		'selectstart',
    // 		(e) => {
    // 			// console.log('select start')
    // 			this.stopSelect && e.preventDefault()
    // 		},
    // 		true
    // 	)
    // 	this.stopSelect = null
    // }

    delete this.init;
  }
};
