/**
 * 保存文件到本地
 *
 * @param content 待保存内容，二进制或字符串
 * @param fileName 文件名
 * @param ext 文件后缀
 * @param isUrl `content`是否为url地址。若url跨域则`download`属性会失效，浏览器会尝试直接打开文件
 * @param type 下载的文件类型，默认 `application/octet-stream`
 */
export function saveFile(
  content: Blob | string,
  fileName: string,
  ext?: string,
  isUrl?: boolean,
  type = 'application/octet-stream'
) {
  const link = document.createElement('a');
  link.download = `${fileName}${ext ? '.' + ext : ''}`;
  link.style.display = 'none';
  if (!isUrl) {
    const blob = content instanceof Blob ? content : new Blob([content], { type }),
      blobUrl = URL.createObjectURL(blob);
    link.href = blobUrl;
    setTimeout(() => URL.revokeObjectURL(blobUrl));
  } else {
    link.href = content as string;
  }
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
