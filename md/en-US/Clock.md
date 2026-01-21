## Clock

clock in pure js

```ts
import { Clock } from 'utils-where';

// start a clock updating every second from now
const padZero = num => (num + '').padStart(2, '0')
new Clock(null, null or 1, false, ({year, month, day, week, hour, minute, second}, date) => {
 console.log(`now: ${year}-${month}-${padZero(day)} ${padZero(hour)}:${padZero(minute)}:${padZero(second)}`)
})

// start from 2000-01-01 00:00:00 and updates every 5s, but paused to manually start
const clock = new Clock(new Date(2000, 0,1,0,0,0), 5, false, ({year, month, day, week, hour, minute, second}, date) => {})
clock.stop()

// start in 3s. if call clock.start(true), it will start from now!!
setTimeout(() => clock.start(), 3000)

// start a clock updating every 60 seconds from given time, the first param and only run when page visible
new Clock(new Date(2000, 0,1,0,0,0), 60, true, (parts, date) => {
    console.log(date.toLocaleString())
})
```

- integrated with vue

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

- integrated with react

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
