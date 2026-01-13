/**
 * 验证手机号
 * @param str
 * @returns boolean
 */
export function checkMobile(str: string) {
  if (typeof str !== 'string') str = str + '';
  return /^1[3-9]\d{9}$/.test(str);
  // return (
  //   !lazy ? /^((13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8})$/ : /^1\d{10}$/
  // ).test(str);
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
 * @param str
 * @returns boolean
 */
export function checkTel(str: string) {
  if (typeof str !== 'string') str = str + '';
  return /^(\d{3,4}-?)?\d{7,8}$/.test(str);
}

/**
 * 验证邮箱
 * @param str
 * @returns boolean
 */
export function checkMail(str: string) {
  if (typeof str !== 'string') str = str + '';
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
    str
  );
}

/**
 * 验证身份证
 * @param str
 * @returns boolean
 */
export function checkID(str: string) {
  if (typeof str !== 'string') str = str + '';
  if (!/^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9X]$/.test(str)) {
    return false;
  }
  // 校验码加权求和算法 (ISO 7064:1983.MOD 11-2)
  const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  const codes = '10X98765432';
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(str[i]) * weights[i];
  }
  return codes[sum % 11] === str[17];
}

/**
 * 验证港澳通行证
 * @param str
 * @returns boolean
 */
export function checkHKMP(str: string) {
  if (typeof str !== 'string') str = str + '';
  return /^[a-zA-Z0-9]{5,21}$/.test(str);
}

/**
 * 匹配所有统一表意文字
 * @param str
 * @returns boolean
 */
export function checkUnifiedIdeograph(str: string) {
  if (typeof str !== 'string') str = str + '';
  return /\p{Unified_Ideograph}/u.test(str);
}

/**
 * 验证经度
 * @param str
 * @returns boolean
 */
export function checkLongitude(str: string) {
  const num = Number(str);
  if (isNaN(num) || num < -180 || num > 180) return false;
  if (typeof str !== 'string') str = str + '';
  return /^-?\d+(\.\d{1,6})?$/.test(str);
}

//   const msg = '请输入正确的经度(整数部分为0-180, 小数部分为0到6位, 180时只能是0)';

/**
 * 验证纬度
 * @param str
 * @returns boolean
 */
export function checkLatitude(str: string) {
  const num = Number(str);
  if (isNaN(num) || num < -90 || num > 90) return false;
  if (typeof str !== 'string') str = str + '';
  return /^-?\d+(\.\d{1,6})?$/.test(str);
}

//   const msg = '请输入正确的纬度(整数部分为0-90, 小数部分为0到6位, 90时只能是0)';
