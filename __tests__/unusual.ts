import {
  sprintf,
  getSexById,
  getBirthById,
  deepMerge,
  moveArrItem,
  delArrItem
} from '../src/unusual';

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
  test('deepMerge', () => {
    expect(
      deepMerge(
        {
          a: 1,
          b: [{ c: '' }],
          c: {
            d: [2, {}]
          }
        },
        {
          b: [{ cc: 33 }, true],
          c: {
            d: [22, { e: false }]
          },
          f: ''
        }
      )
    ).toEqual({
      a: 1,
      b: [{ c: '', cc: 33 }, true],
      c: {
        d: [22, { e: false }]
      },
      f: ''
    });
  });
  test('moveArrItem', () => {
    const arr = [true, 'abc', 7, null, undefined, { log: 123 }];
    expect(moveArrItem(arr.slice(), 2, 3)).toEqual([true, 'abc', null, 7, undefined, { log: 123 }]);
    expect(moveArrItem(arr.slice(), 4, 1)).toEqual([true, undefined, 'abc', 7, null, { log: 123 }]);
  });
  test('delArrItem', () => {
    expect(delArrItem([null, 5, 'as', {}, false], [3, 1, 7])).toEqual([5, {}]);
  });
});
