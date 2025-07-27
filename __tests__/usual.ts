import { serialize, getPathValue, makeObjectByPath, setPathValue, Emitter } from '../src/usual';

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
  test('Emitter', () => {
    const emitter = Emitter<{
      add: [(n: number) => void];
      minus: ((n: number) => void)[];
      log: (() => void)[];
      clear: (() => void)[];
    }>();
    let num = 1;

    emitter
      .once('add', (n) => {
        num += n;
      })
      .on('minus', (n) => {
        num -= n;
      })
      .on('log', console.log)
      .on('log', console.clear)
      .on('clear', console.log)
      .on('clear', console.debug)
      .emit('add', 10)
      .emit('minus', 2)
      .emit('minus', 3)
      .off('minus')
      .off('log', console.clear)
      .off('log', console.log)
      .off('clear', console.log);

    expect(num).toBe(1 + 10 - 2 - 3); // 6
    expect(emitter.evts.add).toBe(undefined);
    expect(emitter.evts.minus).toBe(undefined);
    expect(emitter.evts.log).toBe(undefined);
    expect(emitter.evts.clear).toEqual([console.debug]);
  });
});
