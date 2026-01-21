/* eslint-disable @typescript-eslint/no-this-alias */

/**
 * 滚动容器，即可滚动的元素自身，其overflow应为auto/scroll
 */
type Scroller = HTMLElement & {
  _scrollAt: number | null;
  _scrollTid: number | null;
  _scrollbars?: {
    barX: HTMLElement;
    barY: HTMLElement;
    // [x:string]: Element
  } | null;
};
/**
 * 滚动条滑块
 */
type Thumb = HTMLElement & {
  _ratio: number;
};
/**
 * 内容区域，为了便于监测到内容改动导致的尺寸变化
 */
type List = HTMLElement & {
  _barUpdated: boolean | null;
  _scrollbars: [barX: HTMLElement, barY: HTMLElement] | null;
};
/**
 * 自定义滚动条对象
 */
type CustomBar = {
  /**
   * 是否禁用自定义滚动条。默认在移动端上停用
   *
   * 可按需修改生效条件如 Scrollbar.disabled = Scrollbar.disabled && /Firefox|Linux|Macintosh/.test(navigator.userAgent)
   */
  disabled: boolean;
  /**
   * 是否在使用滚动条时清除页面已选项，默认禁用
   */
  clearSelection: boolean | null;
  /**
   * 是否在使用滚动条时阻止（chromium）默认的selectstart事件，默认禁用
   */
  stopSelect: boolean | null;
  /**
   * 是否监听body&html的样式变化从而切换window的滚动条，默认禁用
   *
   * 如需要展示modal时，通常组件会将body的overflow改为hidden从而隐藏滚动条以及避免scroll chaining
   */
  watchPageStyle: boolean | null;
  /**
   * @description
   * 更新滚动条尺寸后是否同步位置
   */
  syncPos: boolean | null;
  _stylingPage: boolean | null;
  stylingPage: boolean | null;
  pageWatcher?: MutationObserver | null;
  sizeWatcher?: ResizeObserver | null;
  scrollerWatcher?: ResizeObserver;
  getBar: (el: HTMLElement) => {
    isPage: boolean;
    barX?: HTMLElement;
    barY?: HTMLElement;
    thumbX?: Thumb;
    thumbY?: Thumb;
    scrollTarget: Scroller;
  };
  /**
   * 移除滚动条，无需手动调用
   *
   * @param el 使用Scrollbar.attach附加过滚动条的元素
   */
  remove: (el: Scroller) => void;
  /**
   * 对指定元素附加自定义滚动条
   *
   * @param el html元素
   * @returns this
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
  attach: (el?: HTMLElement | null) => CustomBar;
  init?: () => void;
  updateBar: (container: HTMLElement) => void;
  updatePos: (thumbX: Thumb, thumbY: Thumb, scrollTarget: HTMLElement) => void;
  getDownData: (
    dir: 'X' | 'Y',
    bar: HTMLElement,
    thumb: Thumb,
    scrollTarget: HTMLElement
  ) => {
    distance: number;
    lastScroll: number;
  };
  mouseMove: (
    dir: 'X' | 'Y',
    type: 'scrollTop' | 'scrollLeft',
    pos: number,
    distance: number,
    thumb: Thumb,
    scrollTarget: HTMLElement
  ) => void;
  addMouseUp: (
    onmousemove: (e: MouseEvent) => void,
    listenOn: Scroller | Window,
    scrollTarget: Scroller,
    onScroll: () => void
  ) => void;
  showBar: (this: Scroller) => void;
  hideBar: (obj: Scroller) => void;
};

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
    navigator.userAgent.includes('Mobile') ||
    window.matchMedia('(pointer: coarse)').matches)(),
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
      thumbY.style.transform = `translateY(${~~(thumbY._ratio * scrollTarget.scrollTop)}px)`; //(100 * scrollTarget.scrollTop) / scrollTarget.scrollHeight + '%'
    }
    if (!thumbX.parentElement!.hidden) {
      thumbX.style.transform = `translateX(${~~(thumbX._ratio * scrollTarget.scrollLeft)}px)`; //(100 * scrollTarget.scrollLeft) / scrollTarget.scrollWidth + '%'
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
      lastScroll: ~~(scrollTarget[arr[3]] * thumb._ratio) //thumb.getBoundingClientRect().top - bar.getBoundingClientRect().top
      // fromX: e.clientX,
    };
  },
  mouseMove(dir, type, pos, distance, /*ratio,*/ thumb, scrollTarget) {
    pos = pos <= 0 ? 0 : pos >= distance ? distance : pos;
    thumb.style.transform = `translate${dir}(${pos}px)`;
    // setTimeout(() => {
    scrollTarget[type] = ~~(pos / thumb._ratio); // (pos / ratio) + .5 | 0 接近 ~~ 的效率同时四舍五入
    // })
    // scrollTarget.scroll({
    // 	[dir]: pos / ratio,
    // 	// behavior: Math.abs((pos - (this.prev || 0))) / distance >= .1 ?  'smooth' : 'auto'
    // })
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
                'X',
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
                'Y',
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
      notRule = ':not(.baring):not(.show-bar)',
      inherit = 'inherit',
      hideInitialBar = Scrollbar.disabled
        ? ''
        : `${targetClass}{scrollbar-width:none}${targetClass}::-webkit-scrollbar{display:none;width:0;height:0}`;

    css.textContent =
      `body :has(>${targetClass}){position:relative}${hideInitialBar}` +
      `${targetClass}:not(html){overflow:auto}${targetClass}${notRule}>body>${barClass},${targetClass}${notRule}~${barClass}{visibility:hidden;opacity:0}` +
      `${targetClass}.fill{height:${inherit};min-height:${inherit};max-height:${inherit}}${barClass}{position:absolute;z-index:10;transition:visibility .1s,opacity .1s}` +
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
