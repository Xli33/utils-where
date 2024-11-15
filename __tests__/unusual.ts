import { sprintf, getSexById, getBirthById } from '../src';

describe('unusual modules', () => {
  test('sprintf', () => {
    expect(sprintf('hel %s %s', 'l', 'o')).toBe('hel l o');
    expect(sprintf('he{a} {b.c}', { a: 'l', b: { c: 'lo' } })).toBe('hel lo');
  });
  test('getSexById', () => {
    expect(getSexById('123456190001010000')).toBe(2);
    expect(getSexById('123456190001010010')).toBe(1);
  });
  test('getBirthById', () => {
    expect(getBirthById('123456190001010000')).toBe('1900-01-01');
  });
});
