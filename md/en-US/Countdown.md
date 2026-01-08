# Countdown

countdown in pure js

```js
import { Countdown } from 'utils-where';

// start a countdown in 1 min & 20 seconds
new Countdown({ minute: 1, second: 20 }, false, ({ minute, second }) => {
  console.log(minute, second);
});

// start a countdown in 1 hour but paused, then start it manually
const cd = new Countdown(new Date(Date.now() + 3600000), false, ({ day, hour, minute, second }) => {
  console.log(`days: ${day} hours: ${hour} minutes: ${minute} seconds: ${second}`);
});
cd.stop();
// start in 3s. if call cd.start(true), it ends at current time!!
setTimeout(() => cd.start(), 3000);

// start a countdown till the target time and only run when page visible
new Countdown(new Date(2030, 1, 1, 0, 0, 0), true, ({ day, hour, minute, second }) => {
  console.log(`left tims:${day} days ${hour} hours ${minute} minutes ${second} seconds`);
});
```

- integrated with vue

```jsx
import { ref, onBeforeUnmount, onDeactivated } from 'vue';
import { Countdown } from 'utils-where';

export default {
  props: {
    end: Number
  },
  setup(props, ctx) {
    const leftH = ref(),
      leftM = ref(),
      leftS = ref();
    const cd = new Countdown(new Date(Date.now() + props.end), false, ({ hour, minute, second }) => {
      leftH.value = hour;
      leftM.value = minute;
      leftS.value = second;
    });
    cd.stop();

    ctx.expose({ cd });

    onBeforeUnmount(() => {
      cd.remove();
    });
    onDeactivated(() => {
      cd.stop();
    });

    return () => (
      <p>
        {leftH.value}:{leftM.value}:{leftS.value}
      </p>
    );
  }
};
```

- integrated with react

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { Countdown } from 'utils-where';

export default function ({ end, run }) {
  const [leftH, setLeftH] = useState(0),
    [leftM, setLeftM] = useState(0),
    [leftS, setLeftS] = useState(0);

  const cdRef = useRef(null);

  useEffect(() => {
    if (!cdRef.current) {
      cdRef.current = new Countdown(new Date(Date.now() + end), false, ({ hour, minute, second }) => {
        setLeftH(hour);
        setLeftM(minute);
        setLeftS(second);
      });
      cdRef.current.stop();
    }

    return () => {
      cdRef.current.remove();
      cdRef.current = null;
    };
  }, []);

  useEffect(() => {
    cdRef.current[run ? 'start' : 'stop']();

    return () => {
      if (cdRef.current) {
        cdRef.current.remove();
        cdRef.current = null;
      }
    };
  }, [run]);

  return (
    <p>
      {leftH}:{leftM}:{leftS}
    </p>
  );
}
```

- type

```ts
Countdown(to: Date | Partial<dhms>, runOnVisible?: boolean, onCount?: onCount): Countdown
```
