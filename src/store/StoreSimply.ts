import type { TimeoutId } from '../types';

/**
 * 简单持久化存储，以对象形式存储至 localStorage[id]，id 默认值为空字符 ''，适用于（全局）配置只需一层的场景 *
 * @example
 * const ini = new StoreSimply('app', {theme: 0})
 * ini.getVal('theme') === 0
 * ini.setVal('theme', 1).getVal('theme') === 1
 * ini.setVal('login.accnt', {id:3}).getVal('login.accnt').id === 3
 */
export class StoreSimply<T extends object> {
  id: string;
  data: T;
  private _tid!: TimeoutId | null;
  // private data: { [x in keyof T]?: any } = {}
  constructor(id?: string | null, data?: T) {
    this.id = id || '';
    const setting = localStorage.getItem(this.id);
    this.data = Object.assign({}, data, setting ? JSON.parse(setting) : null);
  }
  getVal(key: keyof T) {
    return this.data[key];
  }
  /**
   * 更改键值，支持链式调用
   * @param key 要求为实例化时所传data自身的key
   * @param value any
   * @returns this
   * @example
   * new StoreSimply('app', {num: 1, more: false})
   *  .setVal('num',null)
   *  .setVal('more')
   */
  setVal(key: keyof T, value?: any) {
    if (key == null) throw 'key is required';
    this.data[key] = value;
    clearTimeout(this._tid!);
    this._tid = setTimeout(() => {
      this._tid = null;
      localStorage.setItem(this.id, JSON.stringify(this.data));
    });
    return this;
  }
}
