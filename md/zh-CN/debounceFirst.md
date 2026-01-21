## debounceFirst

下一次调用将在上一次调用经过 `timeout` 后被**同步**触发

```ts
import { debounceFirst } from 'utils-where';

// 至少 1 秒没有点击时触发
onclick = debounceFirst(() => console.log('1'), 1000);
```

结合使用 `debounceFirst` 和 `debounceLast` 可以实现视频播放器中常见的某些效果  
当光标移动时，它显示出来；如果停止移动约 2 秒，它就隐藏。

原始代码可能像这样

```ts
let tid;
onmousemove = () => {
  clearTimeout(tid);
  if (!tid) {
    document.body.style.cursor = '';
    console.log('%cshow', 'font-size:15px');
  }
  tid = setTimeout(() => {
    tid = null;
    document.body.style.cursor = 'none';
    console.log('%chidden', 'font-size:15px;color:coral');
  }, 2000);
};
```

使用 debounceFirst & debounceLast

```ts
import { debounceFirst, debounceLast } from 'utils-where';

const showCursor = debounceFirst(() => (document.body.style.cursor = ''), 2000),
  hideCursor = debounceLast(() => (document.body.style.cursor = 'none'), 2000);

// 或者使用 addEventListener
// addEventListener('mousemove', showCursor);
// addEventListener('mousemove', hideCursor);
onmousemove = () => {
  showCursor();
  hideCursor();
};
```

- type

```ts
interface DebounceFirstWrap<T extends Func> {
  (...args: Parameters<T>): ReturnType<T> | void;
  _tid?: number;
  flag?: true | null;
}

debounceFirst<T extends Func>(callback: T, timeout: number): DebounceFirstWrap<T>
```
