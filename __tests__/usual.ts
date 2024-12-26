import { serialize, getPathValue, makeObjectByPath, setPathValue } from '../src';

describe('usual modules', () => {
  test('serialize', () => {
    expect(
      serialize({
        a: 1,
        b: '66',
        c: null,
        d: void 0,
        e: false,
        f: NaN
      })
    ).toBe('a=1&b=66&c=&d=&e=false&f=NaN');
  });
  test('getPathValue', () => {
    expect(
      getPathValue(
        {
          a: 1,
          b: '66'
        },
        'a'
      )
    ).toBe(1);
    expect(
      getPathValue(
        {
          a: {
            b: []
          }
        },
        'a.b'
      )
    ).toEqual([]);
  });
  test('makeObjectByPath', () => {
    expect(makeObjectByPath('one.two.three', null)).toEqual({
      one: {
        two: {
          three: null
        }
      }
    });
  });
  test('setPathValue', () => {
    expect(
      setPathValue(
        {
          one: {
            two: [3, {}]
          }
        },
        'one.two.1.four',
        ''
      )
    ).toBe(true);
  });
});
