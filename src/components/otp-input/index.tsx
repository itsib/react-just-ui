import { ForwardedRef, forwardRef, useEffect, useMemo, useRef } from 'react';
import type { BaseControlProps } from '@types';
import { Label } from '@components/label';
import { ErrorMessage } from '@components/error-message';
import './styles.css';

/**
 * One-time password input properties
 *
 * @public
 */
export interface OtpInputProps extends BaseControlProps<HTMLInputElement> {
  /**
   * Code layout present. Example «ddd-ddd» six digit code.
   *    «-» - divider dash
   *    «.» - divider dot
   *    «,» - divider rect
   *    «d» - digit
   *    «w» - letter [a-z]
   *    «s» - digit or letter
   *
   * @defaultValue 'ddd-ddd'
   * @public
   */
  layout?: string;
  /**
   * Rewrite code to upper case
   * @public
   */
  upper?: boolean;
}

/**
 * One-time password input
 *
 * @remarks
 * This is the most complete OTP input on the web.
 *
 * @public
 */
export const OtpInput = forwardRef(function FormControlVerifyCode(
  props: OtpInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, className, label, hint, error, layout = 'ddd-ddd', upper = false, ..._props} = props;
  const indexRef = useRef(0);
  const callbacksRef = useRef({ onChange: _props.onChange, onBlur: _props.onBlur });
  callbacksRef.current = { onChange: _props.onChange, onBlur: _props.onBlur };

  const elements = useMemo(() => {
    return (layout || 'ddd-ddd').split('').filter(code => ['-', '.', ',', 'd', 'w', 's'].includes(code));
  }, [layout]);

  // Handle user input and resolve 6-letters code
  useEffect(() => {
    const count = elements.filter(el => ['d', 's', 'w'].includes(el)).length; // The number of characters in the code
    const off = new Array<() => void>(count);   // Callbacks for remove event listeners for each input
    const main = document.getElementById(id) as HTMLInputElement;  // The main input field where the entire code is written
    const slave = new Array<HTMLInputElement>(count); // Text fields for each character of the code
    for (let i = 0; i < count; i++) {
      slave[i] = document.getElementById(`${id}-${i}`) as HTMLInputElement;
    }

    let value = main.value;
    let blurFireTimer: any;

    const testSymbol = (filter: string, symbol: string): boolean => {
      switch (filter) {
        case 'd':
          return /^[0-9]$/.test(symbol);
        case 'w':
          return /^[a-zA-Z]$/.test(symbol);
        case 's':
          return /^[a-zA-Z0-9]$/.test(symbol);
        default:
          return false;
      }
    };

    const emitCodeToMain = (code: string) => {
      main.value = code;
      const event = new Event('change');
      main.dispatchEvent(event);

      callbacksRef.current.onChange?.(event as any);
    };

    const focusNext = (index: number) => {
      if (index < 0 || index >= 6) {
        return;
      }
      slave[index].focus();
      slave[index].setSelectionRange(0, 1, 'forward');
    };

    const insertAll = (code: string) => {
      let output = '';
      for (let i = 0; i < count; i++) {
        let symbol = code.charAt(i);
        if (!symbol) {
          return;
        }
        if (upper) {
          symbol = symbol.toUpperCase();
        }
        slave[i].focus();
        slave[i].setSelectionRange(1, 1);
        slave[i].value = symbol;
        output += symbol;
      }
      emitCodeToMain(output);
    };

    const onInput = () => {
      let output = '';

      for (let i = 0; i < count; i++) {
        if (upper) {
          slave[i].value = slave[i].value?.toUpperCase();
        }
        output += slave[i].value;
      }

      emitCodeToMain(output);
    };

    const onBlur = () => {
      const event = new Event('blur');
      main.dispatchEvent(event);
      blurFireTimer = setTimeout(() => callbacksRef.current.onBlur?.(event as any), 100);
    };

    const onBefore = (event: InputEvent) => {
      const self = event.target as HTMLInputElement;
      const index = self.dataset.index ? parseInt(self.dataset.index, 10) : 0;
      const filter = self.dataset.filter!;
      const data = event.data?.trim();

      switch (event.inputType) {
        case 'insertText': {
          if (!data || data.length !== 1 || !testSymbol(filter, data)) {
            return event.preventDefault();
          } else {
            setTimeout(() => focusNext(index + 1), 1);
            return;
          }
        }
        case 'deleteContentBackward': {
          setTimeout(() => focusNext(index - 1), 1);
          return;
        }
        case 'insertFromPaste': {
          if (data && data.length === count || index === 0) {
            const isValid = data!.split('').every((symbol, index) => testSymbol(slave[index].dataset.filter!, symbol));
            if (isValid) {
              setTimeout(() => insertAll(data!), 1);
            }
          }
          event.preventDefault();
          return;
        }
        case 'historyUndo':
        case 'historyRedo':
          event.preventDefault();
          break;
      }
    };

    const onFocus = (event: FocusEvent) => {
      if (event.relatedTarget) {
        return;
      }
      clearTimeout(blurFireTimer);
      const currentIndex = +(event.target as any).dataset.index;
      const shouldIndex = value.length;
      if (shouldIndex < currentIndex) {
        focusNext(shouldIndex);
        return;
      }

      const self = event.target as HTMLInputElement;
      self.setSelectionRange(0, 1, 'forward');
    };

    const onKeydown = (event: KeyboardEvent) => {
      const self = event.target as HTMLInputElement;
      const index = self.dataset.index ? parseInt(self.dataset.index, 10) : 0;

      if (event.key === 'ArrowLeft') {
        setTimeout(() => focusNext(index - 1), 1);
      }

      else if (event.key === 'ArrowRight') {
        setTimeout(() => focusNext(index + 1), 1);
      }
    };

    for (let i = 0; i < count; i++) {
      slave[i].addEventListener('beforeinput', onBefore);
      slave[i].addEventListener('input', onInput);
      slave[i].addEventListener('focusin', onFocus);
      slave[i].addEventListener('blur', onBlur);
      slave[i].addEventListener('keydown', onKeydown);
      off[i] = ((_input) => () => {
        _input.removeEventListener('beforeinput', onBefore);
        _input.removeEventListener('input', onInput);
        _input.removeEventListener('focusin', onFocus);
        _input.removeEventListener('blur', onBlur);
        _input.removeEventListener('keydown', onKeydown);
      })(slave[i]);
    }

    Object.defineProperty(main, 'value', {
      get(): any {
        return value;
      },
      set(_value: string) {
        for (let i = 0; i < slave.length; i++) {
          slave[i].value = _value.charAt(i);
        }
        value = _value;
      }
    });

    return () => {
      off.forEach(el => el());
    };
  }, [id, upper, elements]);

  return (
    <div className={`jui jui-otp-input ${_props.disabled ? 'disabled' : ''} ${error ? 'error' : ''} ${className ?? ''}`}>
      <Label id={id} label={label} hint={hint} />

      <div className="control-group">
        <input id={id} type="hidden" aria-invalid={error ? 'true' : 'false'} ref={ref} {..._props} />

        <div className="group">
          {elements.map((filter, i) => {
            if (i === 0) {
              indexRef.current = 0;
            }
            if (filter === '-') {
              return <span key={i} className="divider d-dash"/>;
            } else if (filter === '.') {
              return <span key={i} className="divider d-dot"/>;
            }  else if (filter === ',') {
              return <span key={i} className="divider d-rect"/>;
            }
            const index =  indexRef.current;
            indexRef.current += 1;

            return (
              <input
                id={`${id}-${index}`}
                key={`${id}-${index}`}
                type="text"
                autoComplete="off"
                maxLength={1}
                minLength={1}
                data-index={index}
                data-filter={filter}
                disabled={_props.disabled}
              />
            );
          })}
        </div>
      </div>

      <ErrorMessage error={error} />
    </div>
  );
});
