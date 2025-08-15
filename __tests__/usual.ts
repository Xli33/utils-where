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
    expect(getPathValue({ a: 1, b: '66' }, 'a')).toBe(1);
    expect(getPathValue({ a: { b: [] } }, 'a.b')).toEqual([]);
    expect(getPathValue<66>([{ six: 66 }], '0.six')).toBe(66);
    expect(getPathValue([{ six: 66 }], '0.six', true).isValidKeys).toBe(true);
    expect(getPathValue<Console['log']>([console], '0.log')).toBe(console.log);
    expect(getPathValue({ 1: { 2: null } }, '1.2')).toBe(null);
    expect(getPathValue({ a: { p: '' } }, 'a.p.at', true)).toEqual({
      isValidKeys: true,
      validKeys: 'a.p.at',
      value: String.prototype.at
    });
    expect(getPathValue({ a: { p: { '': { ' ': {} } } } }, 'a.p.', true)).toEqual({
      isValidKeys: true,
      validKeys: 'a.p.',
      value: { ' ': {} }
    });
    expect(getPathValue({ a: { p: { '': { ' ': {} } } } }, 'a.p.. ', true)).toEqual({
      isValidKeys: true,
      validKeys: 'a.p.. ',
      value: {}
    });
  });
  test('makeObjectByPath', () => {
    expect(makeObjectByPath('one.two.three', null)).toEqual({
      one: { two: { three: null } }
    });
    expect(makeObjectByPath('')).toEqual({});
    expect(makeObjectByPath('k.a. .', 33)).toEqual({ k: { a: { ' ': { '': 33 } } } });
  });
  test('setPathValue', () => {
    const temp = { one: { two: [3, {} as any] } };
    expect(setPathValue(temp, 'one.two.1.six', [])).toBe(true);
    expect(setPathValue(temp, 'one.two.1.six.0', 0n)).toBe(true);
    expect(setPathValue(temp, 'one.two.1.four', '')).toBe(true);
    expect(setPathValue(temp, 'one.two.1.four.2', false)).toBe(undefined);
    expect(temp.one.two[1].four === '').toBe(true);
    expect(setPathValue(temp, 'one.', 0)).toBe(true);
    expect(setPathValue(temp, 'one..', 0)).toBe(undefined);
    expect(setPathValue(temp, 'one.. ', 0)).toBe(undefined);
    expect(temp).toEqual({ one: { '': 0, two: [3, { four: '', six: [0n] }] } });
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
