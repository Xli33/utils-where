/**
 * 复制到剪贴板
 * @param val
 * @returns boolean
 */
export function setClipboard(val: string) {
  if (!val) return;
  const el = document.createElement('textarea');
  el.value = val;
  el.readOnly = true;
  el.style.position = 'fixed';
  el.style.top = '0';
  el.style.left = '0';
  el.style.zIndex = '-1';
  el.style.opacity = '0';
  document.body.appendChild(el);
  el.select();
  el.setSelectionRange(0, val.length);
  const res = document.execCommand('copy');
  el.remove();
  return res;
}
