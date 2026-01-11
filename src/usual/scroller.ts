/**
 * @example 
            animate(
                500,
                (progress) => {
                    box.style.transform =
                        "translateX(" + progress * 300 + "px)";
                },
                easeOut,
            );
 */
// function animate(duration: number, draw: (num: number) => void, timing: (num: number) => number) {
//   const start = performance.now();
//   requestAnimationFrame(function loop(time) {
//     let timeFraction = (time - start) / duration;
//     if (timeFraction > 1) timeFraction = 1;
//     const progress = timing(timeFraction); // 使用缓动函数
//     draw(progress);
//     timeFraction < 1 && requestAnimationFrame(loop);
//   });
// }

const transit = {
  linear: (timeFraction: number) => timeFraction,
  easeOut: (timeFraction: number) => 1 - Math.pow(1 - timeFraction, 3),
  easeIn: (timeFraction: number) => Math.pow(timeFraction, 3),
  easeInOut: (timeFraction: number) =>
    timeFraction < 0.5 ? 4 * Math.pow(timeFraction, 3) : 1 - Math.pow(-2 * timeFraction + 2, 3) / 2
};

// function transit(type: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' = 'linear', timeFraction: number) {
//   if(type === 'easeIn') {
//     return 1 - Math.pow(1 - timeFraction, 3)
//   }
//   if(type === 'easeOut') {
//     return Math.pow(timeFraction, 3)
//   }
//   if(type === 'easeInOut') {
//     // 	timeFraction < 0.5
//     // 		? 2 * timeFraction * timeFraction
//     // 		: -1 + (4 - 2 * timeFraction) * timeFraction;
//     return timeFraction < 0.5 ? 4 * Math.pow(timeFraction, 3) : 1 - Math.pow(-2 * timeFraction + 2, 3) / 2
//   }
//   return 1 - Math.pow(1 - timeFraction, 3)
// }

export type timingTypes = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';

/**
 * 滚动元素内容至指定位置。未指定有效duration与type时尝试调用原生scroll({behavior:'smooth'})
 * @param el html element，未指定则使用根元素：html
 * @param duration 过渡持续时间，单位ms
 * @param top 滚动到指定的scrollTop
 * @param left 滚动到指定的scrollLeft
 * @param type 过渡曲线
 * @example
 * scroller({
 *  top: 0,
 *  // duration: 500,
 *  // type: 'easeOut'
 * })
 */
export function scroller({
  el,
  duration,
  top,
  left,
  type
}: {
  el?: Element;
  duration?: number;
  top?: number;
  left?: number;
  type?: timingTypes;
}) {
  if (!el) el = document.documentElement;
  if (el.scroll && !type && !duration) {
    el.scroll({
      top,
      left,
      behavior: 'smooth'
    });
    return;
  }
  if (!duration) duration = 500;
  const begin = performance.now(),
    curve = transit[type!] || transit.easeOut;
  let fromTop: number, fromLeft: number, disTop: number, disLeft: number, validTop: boolean, validLeft: boolean;
  if (typeof top === 'number') {
    fromTop = el.scrollTop;
    disTop = top - fromTop;
    validTop = disTop !== 0;
  }
  if (typeof left === 'number') {
    fromLeft = el.scrollLeft;
    disLeft = left - fromLeft;
    validLeft = disLeft !== 0;
  }
  requestAnimationFrame(function loop(now: number) {
    const timeElapsed = now - begin,
      progress = curve(Math.min(timeElapsed / duration, 1));
    if (validTop) {
      el.scrollTop = fromTop + disTop * progress;
    }
    if (validLeft) {
      el.scrollLeft = fromLeft + disLeft * progress;
    }
    timeElapsed < duration && requestAnimationFrame(loop);
  });
  // requestAnimationFrame(animateScroll);
}
