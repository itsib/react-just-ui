type ThrottleCallback<T> = (value: T) => void;

/**
 * Throttle execution of a function.
 * Especially useful for rate limiting execution
 * of handlers on events like resize and scroll.
 *
 * @example
 *
 * ```typescript
 * import { throttle } from 'react-just-ui';
 *
 * const update = throttle(100, (value: string) => {
 *    console.log(value);
 * });
 *
 * const input = document. getElementsByTagName('input')[0] as HTMLInputElement;
 *
 * input.addEventListener('input', event => {
 *   update(event.target.value);
 * });
 * ```
 *
 * @param delay - A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param callback - A function to be executed after delay milliseconds. A function to be executed after delay milliseconds. The last value will be passed to the callback function.
 */
export function throttle<T>(delay: number, callback: (value: T) => void): ThrottleCallback<T> {
  let _innerValue: T;
  let _skip = false;

  const _fn = () => {
    callback(_innerValue);
    _skip = false;
  };

  return (v: T) => {
    _innerValue = v;
    if (!_skip) {
      _skip = true;
      setTimeout(_fn, delay);
    }
  };
}