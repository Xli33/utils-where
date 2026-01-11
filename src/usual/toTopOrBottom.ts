import { scroller, type timingTypes } from './scroller';

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
