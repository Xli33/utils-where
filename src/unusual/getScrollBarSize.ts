import { Obj } from '../types';

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
