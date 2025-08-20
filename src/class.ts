type dhms = {
  day: number;
  hour: number;
  minute: number;
  second: number;
};

/**
 * @param rest 包含day、hour、minute、second的对象
 * @param leftTime 剩余计时的秒数
 */
type onCount = (rest: dhms, leftTime: number) => void;

/**
 * 用于生成倒计时
 */
export class Countdown {
  /**
   * 用于配合visibilitychange事件批量处理计时的开始&暂停
   */
  private static task: Countdown[];
  /**
   * 相当于 new Countdown(to, runOnVisible, onCount)
   * @param to 计时终止时间，可以是一个Date，也可以是包含day、hour、minute、second属性的对象
   * @param runOnVisible 是否仅在页面可见时进行计时。建议仅在以当前时间为基准时选择启用。一般情况下浏览器会对定时器进行节流，故可能需要通过visibilitychange刷新当前剩余计时
   * @param onCount 处于倒计时中的回调，可在此方法中获取剩余的day、hour、minute、second
   * @returns
   */
  static genInstance(to: Date | Partial<dhms>, runOnVisible?: boolean, onCount?: onCount) {
    return new Countdown(to, runOnVisible, onCount);
  }
  /**
   * 清理task中已停止计时的实例
   */
  static clean() {
    for (let i = 0; i < this.task?.length; i++) {
      if (this.task[i]._last < 0) {
        this.task.splice(i, 1);
        i--;
      }
    }
  }
  static onPageToggle() {
    Countdown.toggleTask(document.visibilityState === 'hidden');
  }
  /**
   * 批量开始或暂停task中的计时
   */
  static toggleTask(pause?: boolean) {
    const arr = Countdown.task.filter((e) => e._last > 0);
    pause ? arr.forEach((e) => e.stop()) : arr.forEach((e) => e.start(true));
  }
  from;
  to: Date;
  runOnVisible?: boolean;
  onCount?: onCount | null;
  /**
   * 在计时终止并移除后触发，返回Truthy可阻止置空onCount
   */
  onEnd?: (leftTime: number) => boolean | void;
  private _tid?: number | null;
  private _last!: number;
  /**
   * 生成倒计时，实例化即自动开始计时，实例化后立即调用stop可暂停计时
   *
   * @param to 计时终止时间，可以是一个Date，也可以是包含day、hour、minute、second属性的对象
   * @param runOnVisible 是否仅在页面可见时进行计时。建议仅在以当前时间为基准时选择启用。一般情况下浏览器会对定时器进行节流，故可能需要通过visibilitychange刷新当前剩余计时
   * @param onCount 处于倒计时中的回调，可在此方法中获取剩余的day、hour、minute、second
   * @example
   * 开始一个1分20秒的倒计时
   * new Countdown({minute: 1, second: 20}, false, ({minute, second}) => {})
   */
  constructor(to: Date | Partial<dhms>, runOnVisible?: boolean, onCount?: onCount) {
    const now = new Date();
    this.from = now.valueOf();
    this.to =
      to instanceof Date
        ? to
        : new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + (to.day || 0),
            now.getHours() + (to.hour || 0),
            now.getMinutes() + (to.minute || 0),
            now.getSeconds() + (to.second || 0)
          );
    this.onCount = onCount;
    this.runOnVisible = runOnVisible;
    this.start();
  }
  getRest() {
    const day = Math.floor(this._last / 86400), // 86400 === 60 * 60 * 24
      // 3600 === 60 * 60
      hour = Math.floor(this._last / 3600) - day * 24,
      // 1440 === 24 * 60
      minute = Math.floor(this._last / 60) - day * 1440 - hour * 60,
      // 86400 === 24 * 60 * 60, 3600 === 60 * 60
      second = Math.floor(this._last) - day * 86400 - hour * 3600 - minute * 60;
    return {
      day,
      hour,
      minute,
      second
    };
  }
  /**
   * 保持计时直到结束
   */
  process() {
    if (this._last >= 0) {
      if (!this._tid) {
        this._tid = setInterval(() => this.process(), 1000) as any;
      }
      this.onCount?.(this.getRest(), this._last);
      this._last--;
      return;
    }
    // 计时结束，则将CountDown.tasks中的this剔除
    this.remove();
  }
  /**
   * （重新）开始计时，实例化后自动调用
   * @param fromNow 若为Truthy则始终以当前时间为计时终止时刻
   */
  start(fromNow?: boolean) {
    this.stop(true);
    if (!this.to) return;
    this._last = Math.ceil((+this.to - (fromNow ? Date.now() : this.from)) / 1000);
    // 若始终从Date.now()开始计时，当_last变成负数后应手动置为0，以免计时可能停在某一刻
    if (fromNow && this._last < 0) {
      this._last = 0;
    }

    // 若当前实例仅在页面可见时进行计时，计时时间也必须要>0，否则无需计时
    if (!Countdown.task?.includes(this) && this.runOnVisible && this._last > 0) {
      if (Countdown.task?.length) {
        Countdown.task.push(this);
      } else {
        Countdown.task = [this];
        document.removeEventListener('visibilitychange', Countdown.onPageToggle);
        document.addEventListener('visibilitychange', Countdown.onPageToggle);
      }
    }
    this.process();
  }
  /**
   * 暂停或终止计时
   * @param end 是否终止计时
   */
  stop(end?: boolean) {
    clearInterval(this._tid!);
    this._tid = null;
    // 暂停计时后手动让_last自增，避免调用process恢复计时后会立刻减少了1秒
    // 若是停止计时，且不再会继续，应将_last改为负数避免仍可调用process
    end ? (this._last = -1) : this._last++;
  }
  /**
   * 终止计时，并将实例从CountDown.tasks中移除，当倒计时结束后会自动调用
   */
  remove() {
    this.stop(true);
    const index = Countdown.task?.indexOf(this);
    if (index > -1) {
      Countdown.task.splice(index, 1);
    }
    // 若onEnd返回值是Truthy，则不清除onCount
    if (!this.onEnd?.(this._last)) {
      this.onCount = null;
    }
  }
}

type ymdhms = {
  year: number;
  month: number;
  day: number;
  week: number;
  hour: number;
  minute: number;
  second: number;
};

type onUpdate = (rest: ymdhms, date: Date) => void;

/**
 * 用于生成时钟
 */
export class Clock {
  /**
   * 用于配合visibilitychange事件批量处理计时的开始&暂停
   */
  private static task: Clock[];
  private static pauseAt: number | null;
  /**
   * 相当于 new Clock(begin, step, runOnVisible, onUpdate)
   * @param begin 开始时间，若是一个Date则从此时开始计时，若是falsy则始终以当前时间为准
   * @param step 计时的间隔，单位：秒，默认为 1
   * @param runOnVisible 是否仅在页面可见时运行。以当前时间为基准时才可启用！
   * @param onUpdate 更新回调，可在此处获取当前的具体时间，包含年月日周时分秒
   * @returns
   */
  static genInstance(begin?: Date | null, step?: number, runOnVisible?: boolean, onUpdate?: onUpdate) {
    return new Clock(begin, step, runOnVisible, onUpdate);
  }
  /**
   * 清理task中已停止的实例
   */
  static clean() {
    for (let i = 0; i < this.task?.length; i++) {
      if (!this.task[i]._tid) {
        this.task.splice(i, 1);
        i--;
      }
    }
  }
  static onPageToggle() {
    Clock.toggleTask(document.visibilityState === 'hidden');
  }
  /**
   * 批量开始或暂停task中的时钟
   */
  static toggleTask(pause?: boolean) {
    if (pause) {
      Clock.pauseAt = Date.now();
      Clock.task.forEach((e) => {
        e.stop();
        // 需要先补充date相对visibility hidden触发后落后的毫秒数，否则visible后按照Clock.pauseAt校准的时间不对
        e.begin && e.date.setMilliseconds(e.date.getMilliseconds() + (Clock.pauseAt! - e._prev));
      });
    } else {
      // 通过记录暂停与恢复之间相差的现实时间毫秒数，来相应的修正实例date应当变化多少毫秒
      const passedTime = Date.now() - Clock.pauseAt!;
      Clock.task.forEach((e) => {
        e.start(passedTime);
      });
      Clock.pauseAt = null;
    }
  }
  begin?: Date | null;
  date: Date;
  step: number;
  runOnVisible?: boolean;
  onUpdate?: onUpdate;
  private _tid?: number | null;
  private _prev!: number;
  /**
   * 生成时钟，实例化即自动开始运行，实例化后立即调用stop可暂停
   *
   * @param begin 开始时间，若是一个Date则从此时开始计时，若是falsy则始终以当前时间为准
   * @param step 计时的间隔，单位：秒，默认为 1
   * @param runOnVisible 是否仅在页面可见时运行。以当前时间为基准时才可启用！
   * @param onUpdate 更新回调，可在此处获取当前的具体时间，包含年月日周时分秒
   * @example
   * 生成一个每1秒更新当前时间的实例
   * const padZero = num => (num + '').padStart(2, '0')
   * new Clock(null, null or 1, false, ({year, month, day, week, hour, minute, second}, date) => {
   *  console.log(`now: ${year}-${month}-${padZero(day)} ${padZero(hour)}:${padZero(minute)}:${padZero(second)}`)
   * })
   */
  constructor(begin?: Date | null, step?: number, runOnVisible?: boolean, onUpdate?: onUpdate) {
    // 若begin是new Date，则直接使用实时模式
    this.begin = begin && (+begin === Date.now() ? null : begin);
    this.date = !this.begin ? new Date() : new Date(this.begin);
    this.step = +step! || 1;
    this.runOnVisible = runOnVisible;
    this.onUpdate = onUpdate;
    this.start();
  }
  getNow() {
    const time = this.date;
    return {
      year: time.getFullYear(),
      monthIndex: time.getMonth(),
      month: time.getMonth() + 1,
      day: time.getDate(),
      week: time.getDay(),
      hour: time.getHours(),
      minute: time.getMinutes(),
      second: time.getSeconds()
    };
  }
  process(skip?: boolean) {
    if (!this._tid) {
      this._tid = setInterval(() => this.process(), this.step * 1000) as any;
    }
    if (this.begin) {
      // 此处若直接用Date.now()可能导致后续根据Clock.pauseAt校准经过的毫秒数时有些许毫秒的误差
      // 因为此时Date.now()的毫秒数不一定与this.date的相同，故将_prev设置成this.date的毫秒数
      this._prev = new Date().setMilliseconds(this.date.getMilliseconds());
      !skip && this.date.setSeconds(this.date.getSeconds() + this.step);
    } else {
      this.date = new Date();
    }
    this.onUpdate?.(this.getNow(), this.date);
  }
  /**
   * （重新）开始，实例化后自动调用
   * @param when 若为true则从当前时间开始
   */
  start(when?: boolean | number) {
    this.stop();
    if (this.begin && when) {
      // 在触发后按when修正date，一般配合visibilitychange事件，通过记录的暂停与恢复间隔毫秒数来修正date的毫秒数
      typeof when === 'number'
        ? this.date.setMilliseconds(this.date.getMilliseconds() + when)
        : (this.date = new Date());
      // console.log('%c this.date ms:' + this.date.getMilliseconds(), 'lightcoral')
      // console.log('%c when:' + when, 'coral')
      // console.log('%c now ms:' + new Date().getMilliseconds(), 'darkcoral')
    }

    // 若当前实例仅在页面可见时运行
    if (!Clock.task?.includes(this) && this.runOnVisible) {
      if (Clock.task?.length) {
        Clock.task.push(this);
      } else {
        Clock.task = [this];
        document.removeEventListener('visibilitychange', Clock.onPageToggle);
        document.addEventListener('visibilitychange', Clock.onPageToggle);
      }
    }
    this.process(true);
  }
  /**
   * 停止运行
   */
  stop() {
    clearInterval(this._tid!);
    this._tid = null;
  }
  /**
   * 终止并将实例从Clock.tasks中移除
   */
  remove() {
    this.stop();
    const index = Clock.task?.indexOf(this);
    if (index > -1) {
      Clock.task.splice(index, 1);
    }
  }
}
