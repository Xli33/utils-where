## Clock

纯 js 时钟

```ts
import { Clock } from 'utils-where';

// 从现在开始每秒更新一次的时钟
const padZero = num => (num + '').padStart(2, '0')
new Clock(null, null or 1, false, ({year, month, day, week, hour, minute, second}, date) => {
 console.log(`now: ${year}-${month}-${padZero(day)} ${padZero(hour)}:${padZero(minute)}:${padZero(second)}`)
})

// 从 2000-01-01 00:00:00 开始每 5 秒更新一次，但暂停，需要手动启动
const clock = new Clock(new Date(2000, 0,1,0,0,0), 5, false, ({year, month, day, week, hour, minute, second}, date) => {})
clock.stop()

// 3 秒后启动。如果调用 clock.start(true)，它将从现在开始!!
setTimeout(() => clock.start(), 3000)

// 从给定时间开始每 60 秒更新一次的时钟，第一个参数，且只在页面可见时运行
new Clock(new Date(2000, 0,1,0,0,0), 60, true, (parts, date) => {
    console.log(date.toLocaleString())
})
```

- 与 vue 集成

```tsx
import { ref, onBeforeUnmount, onDeactivated } from 'vue';
import { Clock } from 'utils-where';

export default {
  setup(props, ctx) {
    const y = ref(),
      m = ref(),
      d = ref(),
      h = ref(),
      w = ref(),
      mn = ref(),
      s = ref();
    const ck = new Clock(null, 1, false, ({ year, month, day, week, hour, minute, second }) => {
      y.value = year;
      m.value = month;
      d.value = day;
      w.value = week;
      h.value = hour;
      mn.value = minute;
      s.value = second;
    });
    const padZero = (num) => (num + '').padStart(2, '0');

    onBeforeUnmount(() => {
      ck.remove();
    });
    onDeactivated(() => {
      ck.stop();
    });

    return () => (
      <p>
        {y.value}-{m.value}-{d.value} day of week: {w.value} &nbsp;&nbsp; {padZero(h.value)}:{padZero(m.value)}:
        {padZero(s.value)}
      </p>
    );
  }
};
```

- 与 react 集成

```tsx
import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'utils-where';

export default function ({ end, run }) {
  const [y, setY] = useState(),
    [m, setM] = useState(),
    [d, setD] = useState(),
    [h, setH] = useState(),
    [w, setW] = useState(),
    [mn, setMn] = useState(),
    [s, setS] = useState();

  const ckRef = useRef(null);
  const padZero = (num) => (num + '').padStart(2, '0');

  useEffect(() => {
    if (!ckRef.current) {
      ckRef.current = new Clock(null, 1, false, ({ year, month, day, week, hour, minute, second }) => {
        setY(year);
        setM(month);
        setD(day);
        setW(week);
        setH(hour);
        setMn(minute);
        setS(second);
      });
    }

    return () => {
      ckRef.current.remove();
      ckRef.current = null;
    };
  }, []);

  return (
    <p>
      {y}-{m}-{d} day of week: {w} &nbsp;&nbsp; {padZero(h)}:{padZero(mn)}:{padZero(s)}
    </p>
  );
}
```

- type

```ts
Clock(begin?: Date | null, step?: number, runOnVisible?: boolean, onUpdate?: onUpdate): Clock
```
