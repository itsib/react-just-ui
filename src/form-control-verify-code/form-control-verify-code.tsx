import { ForwardedRef, forwardRef, useEffect, useMemo, useRef } from 'react';
import { BaseProps } from '../types';
import { ControlLabel } from '../common/control-label.tsx';
import { ControlError } from '../common/control-error.tsx';

export interface IFormControlVerifyCode extends BaseProps<HTMLInputElement> {
  /**
   * Code layout present. Example «ddd-ddd» six digit code.
   *    «-» - separator
   *    «d» - digit
   *    «w» - letter [a-z]
   *    «s» - digit or letter
   *
   * @default 'ddd-ddd'
   */
  layout?: string;
  /**
   * Rewrite code to upper case
   */
  upper?: boolean;
}

export const FormControlVerifyCode = forwardRef(function FormControlVerifyCode(
  props: IFormControlVerifyCode,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, className, label, hint, error, layout = 'ddd-ddd', upper = false, ..._props} = props;
  const indexRef = useRef(0);
  const callbacksRef = useRef({ onChange: _props.onChange, onBlur: _props.onBlur });
  callbacksRef.current = { onChange: _props.onChange, onBlur: _props.onBlur };

  const elements = useMemo(() => {
    return (layout || 'ddd-ddd').split('').filter(code => ['-', 'd', 'w', 's'].includes(code));
  }, [layout]);

  // Handle user input and resolve 6-letters code
  useEffect(() => {
    const count = elements.filter(el => ['d', 's', 'w'].includes(el)).length;
    const off = new Array<() => void>(count);
    const main = document.getElementById(id) as HTMLInputElement;
    const slave = new Array<HTMLInputElement>(count);
    for (let i = 0; i < count; i++) {
      slave[i] = document.getElementById(`${id}-${i}`) as HTMLInputElement;
    }

    let blurFireTimer: any;

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
      for (let i = 0; i < 6; i++) {
        const symbol = code.charAt(i);
        if (!symbol) {
          return;
        }
        slave[i].focus();
        slave[i].value = symbol;
        slave[i].setSelectionRange(1, 1);
        output += symbol;
      }
      emitCodeToMain(output);
    };

    const onInput = () => {
      let output = '';
      for (let i = 0; i < 6; i++) {
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
      const filter = self.dataset.filter;
      const data = event.data;

      // Handle one char code input
      if (event.inputType === 'insertText' && data) {
        if ((filter === 'd' && !/^[0-9]$/.test(data)) || (filter === 'w' && !/^[a-zA-Z]$/.test(data))) {
          event.preventDefault();
        } else {
          setTimeout(() => focusNext(index + 1), 1);
        }
      }
      // Handle backspace
      else if (event.inputType === 'deleteContentBackward') {
        setTimeout(() => focusNext(index - 1), 1);
      }
      // Handle paste code (validate and insert to fields)
      else if (event.inputType === 'insertFromPaste' && data) {
        setTimeout(() => insertAll(data), 1);
      }
      // Handle undo/redo
      else if (event.inputType === 'historyUndo' || event.inputType === 'historyRedo') {
        event.preventDefault();
      }

    };

    const onFocus = (event: FocusEvent) => {
      clearTimeout(blurFireTimer);
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

    return () => {
      off.forEach(el => el());
    };
  }, [id, upper, elements]);

  return (
    <div className={`jui jui-verify-code ${_props.disabled ? 'disabled' : ''} ${error ? 'error' : ''} ${className ?? ''}`}>
      <ControlLabel id={id} label={label} hint={hint} />

      <div className="control-group">
        <input id={id} type="hidden" aria-invalid={error ? 'true' : 'false'} ref={ref} {..._props} />

        <div className="group">
          {elements.map((filter, i) => {
            if (i === 0) {
              indexRef.current = 0;
            }
            if (filter === '-') {
              return <span key={i} className="divider"/>;
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

      <ControlError error={!_props.disabled ? error : undefined}/>
    </div>
  );
});
