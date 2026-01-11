import type { TimeoutId } from '../types';

/**
 * add custom longpress event for Node instance, default timeout is 500ms, which could be set by Node's _longPressDelay /
 * 为Node实例添加 longpress（长按）事件，触发超时500ms，可通过元素的 _longPressDelay 进行设置
 *
 * @example document.addEventListener('longpress', e => console.log(e))
 */
const addListener = EventTarget.prototype.addEventListener;
Node.prototype.addEventListener = function (type, listener, options) {
  if (!type || typeof listener !== 'function') return;
  if (type !== 'longpress') {
    addListener.call(this, type, listener, options);
    return;
  }
  if (!this.hasOwnProperty('_longPressEvents')) {
    this._longPressEvents = [];
  }
  // 若绑定过同选项的longpress则直接跳过
  if (this._longPressEvents!.some((e) => e.longpress === listener && e.options === options)) return;
  let tid: TimeoutId | null;
  const evt = {
    touchstart(e: Event) {
      tid = setTimeout(() => {
        listener.call(
          this,
          new CustomEvent('longpress', {
            bubbles: e.bubbles,
            cancelable: e.cancelable,
            composed: e.composed,
            ...(<Node>(<unknown>this))._longPressOption,
            detail: e
          })
        );
      }, (<Node>(<unknown>this))._longPressDelay || 500);
    },
    touchend() {
      clearTimeout(tid!);
      tid = null;
    },
    longpress: listener,
    options
  };
  this._longPressEvents!.push(evt);
  addListener.call(this, 'touchstart', evt.touchstart, options);
  addListener.call(this, type, listener, options); // able to be called by dispatchEvent
  addListener.call(this, 'touchend', evt.touchend, options);
};

/**
 * remove the custom longpress event for Node instance /
 * 为Node实例移除 longpress（长按）事件
 *
 * @example document.removeEventListener('longpress', callback, useCapture)
 */
const removeListener = EventTarget.prototype.removeEventListener;
Node.prototype.removeEventListener = function (type, listener, options) {
  if (type !== 'longpress') {
    removeListener.call(this, type, listener, options);
    return;
  }
  const index = this._longPressEvents?.findIndex((e) => e.longpress === listener && e.options === options);
  if (index === undefined || index < 0) return;
  removeListener.call(this, 'touchstart', this._longPressEvents![index].touchstart, options);
  removeListener.call(this, 'touchend', this._longPressEvents![index].touchend, options);
  removeListener.call(this, type, listener, options);
  this._longPressEvents!.splice(index, 1);
  if (!this._longPressEvents!.length) delete this._longPressEvents;
};
