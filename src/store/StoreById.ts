import type { Obj, TimeoutId } from '../types';
import { getPathValue, makeObjectByPath } from '../usual';
import { isObject, deepMerge } from '../unusual';

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
 * new StoreById<Config, SelfKeyPath<Config>>()
 */
export class StoreById<T extends Obj = Obj, K extends string = string> {
  id: string;
  data: T;
  private _tid!: TimeoutId | null;
  constructor(id?: string | null, data?: T) {
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
  getVal<V = any>(keyPath: K, target?: Obj) {
    return getPathValue<V>(target || this.data, keyPath);
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
    keyPath: K,
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
      this.data = value as T;
    }
    if (!targetOrReplace || targetOrReplace === true || targetOrReplace === this.data) {
      clearTimeout(this._tid!);
      this._tid = setTimeout(() => {
        this._tid = null;
        localStorage.setItem(this.id, JSON.stringify(this.data));
        // console.log(`修改了本地 ${this.id} 的配置`)
      });
    }
    return this;
  }
}
