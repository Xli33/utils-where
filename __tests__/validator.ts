import {
  checkMobile,
  checkTel,
  checkMail,
  checkID,
  checkHKMP,
  checkUnifiedIdeograph,
  checkLongitude,
  checkLatitude
} from '../src/validator';

describe('validator modules', () => {
  test('checkMobile', () => {
    expect(checkMobile('13333333333')).toBe(true);
    expect(checkMobile('1333333333 ')).toBe(false);
    expect(checkMobile('11111111111')).toBe(false);
    expect(checkMobile('1111111112')).toBe(false);
    expect(checkMobile('11111111111', true)).toBe(true);
    expect(checkMobile('1111111113', true)).toBe(false);
  });
  test('checkTel', () => {
    expect(checkTel('0000-12345678')).toBe(true);
    expect(checkTel('000-1234567')).toBe(true);
    expect(checkTel('000-12345678')).toBe(true);
  });
  test('checkMail', () => {
    expect(checkMail('a@ab.com')).toBe(true);
    expect(checkMail('ab@abc.co')).toBe(true);
    expect(checkMail('a@ab.c')).toBe(false);
  });
  test('checkID', () => {
    expect(checkID('123456190001011234')).toBe(true);
  });
  test('checkHKMP', () => {
    expect(checkHKMP('12345')).toBe(true);
  });
  test('checkUnifiedIdeograph', () => {
    expect(checkUnifiedIdeograph('䀀')).toBe(true);
    expect(checkUnifiedIdeograph('\u4000')).toBe(true);
  });
  test('checkLongitude', () => {
    expect(checkLongitude('0.123456')).toBe(true);
    expect(checkLongitude('100.123456')).toBe(true);
  });
  test('checkLatitude', () => {
    expect(checkLatitude('0')).toBe(true);
    expect(checkLatitude('100')).toBe(false);
  });
});
