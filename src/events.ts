import type { Obj } from './types';

/**
 * add custom longpress event for Node instance, default timeout is 500ms, which could be set by element's _longPressDelay /
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
    (this as Obj)._longPressEvents = [];
  }
  let flag: true | null;
  const evt = {
    touchstart(e: Event) {
      flag = true;
      setTimeout(() => {
        flag &&
          listener.call(
            this,
            new CustomEvent('longpress', {
              bubbles: e.bubbles,
              cancelable: e.cancelable,
              composed: e.composed,
              ...(this as Obj)._longPressOption,
              detail: e
            })
          );
        flag = null;
      }, (this as Obj)._longPressDelay || 500);
    },
    touchend() {
      flag = null;
    },
    longpress: listener
  };
  (this as Obj)._longPressEvents.push(evt);
  addListener.call(this, 'touchstart', evt.touchstart, options);
  addListener.call(this, type, listener, options); // to be able to be called by dispatchEvent
  addListener.call(this, 'touchend', evt.touchend);
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
  const index: number = (this as Obj)._longPressEvents?.findIndex(
    (e: { longpress: EventListenerOrEventListenerObject }) => e.longpress === listener
  );
  if (index === undefined || index < 0) return;
  removeListener.call(
    this,
    'touchstart',
    (this as Obj)._longPressEvents[index].touchstart,
    options
  );
  removeListener.call(this, 'touchend', (this as Obj)._longPressEvents[index].touchend);
  removeListener.call(this, type, listener, options);
  (this as Obj)._longPressEvents.splice(index, 1);
};
