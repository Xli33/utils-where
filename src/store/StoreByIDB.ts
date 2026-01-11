import type { Obj, TimeoutId } from '../types';
import { getPathValue, makeObjectByPath } from '../usual';
import { isObject, deepMerge } from '../unusual';

/**
 * 类似StoreById的api，但将数据存至indexedDB。由于indexedDB的操作属于异步，故需在实例的onsuccess事件中获取数据库的数据
 * @param id 数据库名称，不传使用 '-'
 * @param table 数据库中的仓库（表）名称，不传使用数据库名
 * @param data 初始化的数据
 * @example
 * const d = new StoreByIDB()
 * d.onsuccess = () => {
 *  console.log(d.data)
 *  d.setVal('APP.ui.theme', 'auto').setVal('login.agree.read', true).getVal('login.agree.read')
 * }
 *
 * 在读写时检测路径并获得路径提示
 * type Config = {
 *   user: {
 *     id: string;
 *     pwd: string;
 *   };
 *   app: {
 *     theme: string;
 *   };
 * };
 *  const d = new StoreByIDB<Config, SelfKeyPath<Config>>()
 */
export class StoreByIDB<T extends Obj = Obj, K extends string = string> {
  id: string;
  table: string;
  data!: T;
  onsuccess?: () => void;
  onerror!: (e: Event) => void;
  private _tid!: TimeoutId | null;
  private _idb!: IDBDatabase;
  constructor(id?: string, table?: string | null, data?: T) {
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
  getVal<V = any>(keyPath: K, target?: Obj) {
    return getPathValue<V>(target || this.data, keyPath);
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
   *
   * // 移除键
   * setVal('login.agree.read', undefined, {useJSON: true})
   * // 将值设为undefined但不移除该键
   * setVal('login.agree.read')
   */
  setVal(
    keyPath: K,
    value?: any,
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
      this.data = value as T;
    }
    if (!targetOrReplace || targetOrReplace === true || targetOrReplace === this.data) {
      clearTimeout(this._tid!);
      this._tid = setTimeout(() => {
        this._tid = null;
        let tmp = this._idb
          .transaction(this.table, 'readwrite')
          .objectStore(this.table)
          .put(useJSON ? JSON.parse(JSON.stringify(this.data)) : this.data, 0);
        tmp.onsuccess = () => {
          (<unknown>tmp) = tmp.onerror = null;
          // console.log(`修改了本地数据库 ${this.id} ~ ${this.table} 的配置`)
        };
        tmp.onerror = this.onerror;
      });
    }
    return this;
  }
}
