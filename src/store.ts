import type { Obj } from './types';
import { getPathValue, makeObjectByPath } from './usual';
import { isObject, deepMerge } from './unusual';

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
  private _tid!: number;
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
    clearTimeout(this._tid);
    this._tid = setTimeout(() => {
      localStorage.setItem(this.id, JSON.stringify(this.data));
    }) as any;
    return this;
  }
}

/**
 * 按唯一id进行本地设置，数据存至localStorage，不传 id 则使用默认的空字符 ''
 * @example
 * 保存在本地后的对象格式be like
 * {
 *  未提供id时则使用 '' 作为唯一标识
 *  '': {
 *    theme: 0,
 *    login: {
 *      remember: false,
 *      agree: {
 *        read: false,
 *        check: false,
 *      }
 *    }
 *  },
 *  给定的id，例如 Admin。如在同域下存在多个应用（项目），需要同时按账号及应用区分时，可将id设为应用+账号，避免过多嵌套
 *  Admin: {
 *    theme: 1，
 *    login: {
 *      remember: true,
 *      agree: {
 *        read: true,
 *        check: true,
 *      }
 *    }
 *  }
 * }
 *
 * 使用示例，设置一次
 * setVal('login.agree.read', true)
 * or
 * save({
 *  login: {
 *    // _flush: true, // 任意属性赋予这个值则表示直接替换，而不是尝试针对对象的深度合并
 *    agree: {
 *      read: true
 *    }
 *  }
 * }) 或者链式调用，一次设置多个值
 * new StoreById('app', {
 *  theme: 0,
 *  head: {
 *   show: false
 *  }
 * }).setVal('head.show', true).save({theme: 1})
 *   .setVal('foot.show', false).save({head: {title: 0}})
 *   .save({
 *      foot: {
 *        tip: 'xxx'
 *      }
 *   }).setVal('one.two.three.four', null)
 */
export class StoreById {
  id: string;
  data: Obj;
  private _tid!: number;
  constructor(id?: string | null, data?: Obj) {
    this.id = id || '';
    const setting = localStorage.getItem(this.id);
    this.data = Object.assign({}, data, setting ? JSON.parse(setting) : null);
  }
  /**
   * 以点语法获取对应配置
   * @param keyPath e.g. login.agree
   * @param target 查询keyPath值的目标对象，不存在时从this.data上查询
   * @returns any
   * @example getVal('login.agree')
   * getVal<true>('login.remember')
   */
  getVal<T = any>(keyPath: string, target?: Obj) {
    return getPathValue<T>(target || this.data, keyPath);
  }
  /**
   * 以点语法修改配置，支持链式调用
   * @param keyPath 键路径，如 one.two.three
   * @param value 赋予的值
   * @param deep 当value是对象时是否深度合并，默认不进行深度合并
   * @param target 进行赋值的目标对象，存在target则赋值行为都是在target上进行，而不是this.data
   * @param skipHandle 用于处理合并过程中每一项的函数，返回Truthy则跳过该次的深度合并
   * @example
   * setVal('login.agree.read', true)
   * 若不存在 {login: {agree: {read: any}}}，也可保存成功，且保存后的对象为 {login: {agree: {read: true}}}
   */
  setVal(
    keyPath: string,
    value?: any,
    {
      deep,
      target,
      skipHandle
    }: {
      deep?: boolean;
      target?: Obj;
      skipHandle?: (key: string, target: Obj, fromValue: any) => boolean;
    } = {}
  ) {
    if (!keyPath) return this;
    // deep非truthy则不进行深度合并，而当value是object时，需要添加直接赋值的标记，默认是_flush:true
    if (!deep && isObject(value)) {
      Object.defineProperty(value, '_flush', {
        configurable: true,
        value: true
      });
    }
    const configObj = makeObjectByPath(keyPath, value);
    // console.log(configObj)
    // 当 configObj 不为空对象时才需调用 save
    return Object.keys(configObj).length > 0 ? this.save(configObj, target, skipHandle) : this;
  }
  /**
   * 以对象形式修改配置，支持链式调用，默认进行深度合并
   * @param value
   * @param targetOrReplace 若为true，则直接将this.data替换为value；若为对象，则合并行为都是在该对象上进行，而不是this.data
   * @param skipHandle 用于处理合并过程中每一项的函数，返回Truthy则跳过该次的深度合并
   * @example
   * // 只修改 login 中 agree 的 read
   * save({
   *  login: {
   *    // _flush: true, // 任意属性赋予这个值则表示直接替换，而不是尝试默认的深度合并
   *    agree: {
   *      read: true
   *    }
   *  }
   * })
   */
  save(
    value: Obj,
    targetOrReplace?: boolean | Obj | null,
    skipHandle?: (key: string, target: Obj, fromValue: any) => boolean | void
  ) {
    if (targetOrReplace !== true) {
      deepMerge(
        targetOrReplace || this.data,
        value,
        skipHandle ||
          ((k, target, fromValue) => {
            if (fromValue?._flush) {
              delete fromValue._flush;
              target[k] = fromValue;
              return true;
            }
          })
      );
    } else {
      this.data = value;
    }
    if (!targetOrReplace || targetOrReplace === true || targetOrReplace === this.data) {
      clearTimeout(this._tid);
      this._tid = setTimeout(() => {
        localStorage.setItem(this.id, JSON.stringify(this.data));
        // console.log(`修改了本地 ${this.id} 的配置`)
      }) as any;
    }
    return this;
  }
}

/**
 * 类似StoreById的api，但将数据存至indexedDB。由于indexedDB的操作属于异步，故需在实例的onsuccess事件中获取数据库的数据
 * @param id 数据库名称，不传使用 '-'
 * @param table 数据库中的仓库（表）名称，不传使用数据库名
 * @param data 初始化的数据
 * @example const d = new StoreByIDB()
 * d.onsuccess = () => {
 *  console.log(d.data)
 *  d.setVal('APP.ui.theme', 'auto').setVal('login.agree.read', true).getVal('login.agree.read')
 * }
 */
export class StoreByIDB {
  id: string;
  table: string;
  data!: Obj;
  onsuccess?: () => void;
  onerror!: (e: Event) => void;
  private _tid!: number;
  private _idb!: IDBDatabase;
  constructor(id?: string, table?: string | null, data?: Obj) {
    this.id = id || '-';
    this.table = table || this.id;
    const openRequest = indexedDB.open(this.id, 1);
    // 新建时 version 从无到有会触发版本变更事件，通过upgradeneeded接收
    openRequest.onupgradeneeded = () => {
      // 只建一个对象仓库，同时以当前table作为仓库名
      if (!openRequest.result.objectStoreNames.contains(this.table)) {
        openRequest.result.createObjectStore(this.table);
      }
    };
    openRequest.onsuccess = () => {
      // 进行事务操作
      this._idb = openRequest.result;
      this._idb.transaction(this.table, 'readonly').objectStore(this.table).get(0).onsuccess = (e) => {
        const setting = (e.target as EventTarget & { result: Obj[] }).result;
        // console.log(setting)
        this.data = Object.assign({}, data, setting);
        openRequest.onerror = null;
        this.onsuccess?.();
      };
    };
    openRequest.onerror = (e) => {
      this.onerror?.(e);
    };
  }
  /**
   * 以点语法获取对应配置
   * @param keyPath
   * @param target 查询keyPath值的目标对象，不存在时从this.data上查询
   * @returns any
   * @example getVal('login.agree')
   * getVal<false>('login.remember')
   */
  getVal<T = any>(keyPath: string, target?: Obj) {
    return getPathValue<T>(target || this.data, keyPath);
  }
  /**
   * 以点语法修改配置，支持链式调用
   * @param keyPath 键路径，如 one.two.three
   * @param value 赋予的值
   * @param deep 当value是对象时是否深度合并，默认不进行深度合并
   * @param useJSON 将数据修改至数据库时是否使用JSON.parse(JSON.stringify(this.data))，对于无法进行结构化克隆的数据（如Proxy）可以采用该方式
   * @param target 进行赋值的目标对象，存在target则赋值行为都是在target上进行，而不是this.data
   * @param skipHandle 用于处理合并过程中每一项的函数，返回Truthy则跳过该次的深度合并
   * @example
   * setVal('login.agree.read', true)
   * 若不存在 {login: {agree: {read: any}}}，也可保存成功，且保存后的对象为 {login: {agree: {read: true}}}
   */
  setVal(
    keyPath: string,
    value: any,
    {
      deep,
      useJSON,
      target,
      skipHandle
    }: {
      deep?: boolean;
      useJSON?: boolean;
      target?: Obj;
      skipHandle?: (key: string, target: Obj, fromValue: any) => boolean;
    } = {}
  ) {
    if (!keyPath) return this;
    // deep非truthy则不进行深度合并，而当value是object时，需要添加直接赋值的标记，默认是_flush:true
    if (!deep && isObject(value)) {
      Object.defineProperty(value, '_flush', {
        configurable: true,
        value: true
      });
    }
    const configObj = makeObjectByPath(keyPath, value);
    // console.log(configObj)
    // 当 configObj 不为空对象时才需调用 save
    return Object.keys(configObj).length > 0 ? this.save(configObj, target, useJSON, skipHandle) : this;
  }
  /**
   * 以对象形式修改配置，支持链式调用，默认进行深度合并
   * @param value
   * @param targetOrReplace 若为true，则直接将this.data替换为value；若为对象，则合并行为都是在该对象上进行，而不是this.data
   * @param useJSON 将数据修改至数据库时是否使用JSON.parse(JSON.stringify(this.data))，对于无法进行结构化克隆的数据（如Proxy）可以采用该方式
   * @param skipHandle 用于处理合并过程中每一项的函数，返回Truthy则跳过该次的深度合并
   * @example
   * // 只修改 login 中 agree 的 read
   * save({
   *  login: {
   *    // _flush: true, // 任意属性赋予这个值则表示直接替换，而不是尝试默认的深度合并
   *    agree: {
   *      read: true
   *    }
   *  }
   * })
   */
  save(
    value: Obj,
    targetOrReplace?: boolean | Obj | null,
    useJSON?: boolean | null,
    skipHandle?: (key: string, target: Obj, fromValue: any) => boolean | void
  ) {
    if (targetOrReplace !== true) {
      deepMerge(
        targetOrReplace || this.data,
        value,
        skipHandle ||
          ((k, target, fromValue) => {
            if (fromValue?._flush) {
              delete fromValue._flush;
              target[k] = fromValue;
              return true;
            }
          })
      );
    } else {
      this.data = value;
    }
    if (!targetOrReplace || targetOrReplace === true || targetOrReplace === this.data) {
      clearTimeout(this._tid);
      this._tid = setTimeout(() => {
        const tmp = this._idb
          .transaction(this.table, 'readwrite')
          .objectStore(this.table)
          .put(useJSON ? JSON.parse(JSON.stringify(this.data)) : this.data, 0);
        tmp.onsuccess = () => {
          tmp.onerror = null;
          // console.log(`修改了本地数据库 ${this.id} ~ ${this.table} 的配置`)
        };
        tmp.onerror = this.onerror;
      }) as any;
    }
    return this;
  }
}
