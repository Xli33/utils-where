import { setClipboard } from './setClipboard';

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
