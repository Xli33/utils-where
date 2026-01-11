import type { TimeoutId } from '../types';

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
  private _tid?: TimeoutId | null;
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
   *
   * 从2000-01-01 00:00:00起，每5秒更新时间，但暂停以待手动启用
   * const clock = new Clock(new Date(2000, 0,1,0,0,0), 5)
   * clock.stop()
   *
   * 3秒后开始，若调用的是clock.start(true)，则会变成从当前时刻开始
   * setTimeout(() => clock.start(), 3000)
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
      this._tid = setInterval(() => this.process(), this.step * 1000);
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
