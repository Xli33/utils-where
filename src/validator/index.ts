/**
 * 验证手机号
 * @param val
 * @param lazy 是否仅判断1开头的号码长度而不验证具体格式
 * @returns boolean
 */
export function checkMobile(val: string, lazy?: boolean) {
  if (typeof val !== 'string') val = val + '';
  return (
    !lazy ? /^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8})$/ : /^1\d{10}$/
  ).test(val);
}

// export const asyncCheckMobile = (
//   rule: Obj,
//   value: string,
//   callback: (args?: unknown) => void
// ): void => {
//   const msg = '请输入正确的手机号';
//   value
//     ? checkPhone(value)
//       ? callback()
//       : callback((rule.message = rule.errMsg || msg))
//     : callback(rule.required ? rule.message || msg : undefined);
// };

/**
 * 验证固话
 * @param val
 * @returns boolean
 */
export function checkTel(val: string) {
  if (typeof val !== 'string') val = val + '';
  return /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/.test(val);
}

/**
 * 验证邮箱
 * @param val
 * @returns boolean
 */
export function checkMail(val: string) {
  if (typeof val !== 'string') val = val + '';
  return /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/.test(val);
}

/**
 * 验证身份证
 * @param val
 * @returns boolean
 */
export function checkID(val: string) {
  if (typeof val !== 'string') val = val + '';
  return /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|30|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/.test(
    val
  );
}

/**
 * 验证港澳通行证
 * @param val
 * @returns boolean
 */
export function checkHKMP(val: string) {
  if (typeof val !== 'string') val = val + '';
  return /^[a-zA-Z0-9]{5,21}$/.test(val);
}

/**
 * 匹配所有统一表意文字
 * @param val
 * @returns boolean
 */
export function checkUnifiedIdeograph(val: string) {
  if (typeof val !== 'string') val = val + '';
  return /\p{Unified_Ideograph}/u.test(val);
}

/**
 * 验证经度
 * @param val
 * @returns boolean
 */
export function checkLongitude(val: string) {
  if (typeof val !== 'string') val = val + '';
  return /^(-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/.test(
    val
  );
}

//   const msg = '请输入正确的经度(整数部分为0-180, 小数部分为0到6位, 180时只能是0)';

/**
 * 验证纬度
 * @param val
 * @returns boolean
 */
export function checkLatitude(val: string) {
  if (typeof val !== 'string') val = val + '';
  return /^(-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/.test(val);
}

//   const msg = '请输入正确的纬度(整数部分为0-90, 小数部分为0到6位, 90时只能是0)';
