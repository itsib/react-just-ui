import { ForwardedRef, forwardRef, useEffect, useMemo, useRef } from 'react';
import type { BaseControlProps } from './types';
import { Label } from './label';
import { Subscript } from './subscript';
import './otp-input.scss';

export interface OtpInputProps extends BaseControlProps<HTMLInputElement> {
  /**
   * Code layout present. Example «ddd-ddd» six digit code. <br/>
   * «-» - divider dash <br/>
   * «.» - divider dot <br/>
   * «,» - divider rect <br/>
   * «d» - digit <br/>
   * «w» - letter [a-z] <br/>
   * «s» - digit or letter <br/>
   *
   * @defaultValue 'ddd-ddd'
   * @public
   */
  layout?: string;
}

/**
 * One-time password input. This is the most complete OTP input on the web.
 */
export const OtpInput = forwardRef(function FormControlVerifyCode(
  props: OtpInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, className, label, hint, error, layout = 'ddd-ddd', ..._props} = props;
  const callbacksRef = useRef(_props);
  callbacksRef.current = _props;

  const elements = useMemo(() => {
    let index = 0;
    return (layout || 'ddd-ddd').split('').filter(code => ['-', '.', ',', 'd', 'w', 's'].includes(code)).map((code, key) => {
      switch (code) {
        case '-':
          return <div key={`${id}-${key}`} className="divider d-dash"/>;
        case '.':
          return <div key={`${id}-${key}`} className="divider d-dot"/>;
        case ',':
          return <div key={`${id}-${key}`} className="divider d-dot"/>;
        default:
          return <input type="text" key={`${id}-${key}`} id={`${id}-${index}`} data-index={index++} className="symbol" />
      }
    });
  }, [layout, id]);

  // Handle user input and resolve 6-letters code
  useEffect(() => {
    if (!id) {
      throw new Error('ATTR_ID');
    }
    const mask: string[] = layout.split('').filter(el => ['d', 's', 'w'].includes(el as any));
    const maxLength = mask.length;
    const lastIndex = maxLength - 1;
    const off = new Array<() => void>(maxLength);   // Callbacks for remove event listeners for each input
    const input = document.getElementById(id) as HTMLInputElement;  // The main input field where the entire code is written
    const inputsGroup = new Array<HTMLInputElement>(maxLength); // Text fields for each character of the code
    if (!input) return;

    for (let i = 0; i < maxLength; i++) {
      inputsGroup[i] = document.getElementById(`${id}-${i}`) as HTMLInputElement;
    }

    let active: number | null = null;
    let skipBlurHandle = false;
    let skipFocusHandle = false;
    let skipChangeHandle = true;

    const testOtpCodeSymbol = (maskItem: string, symbol: string): boolean => {
      switch (maskItem) {
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

    const insertAll = (code: string) => {
      for (let i = 0; i < maxLength; i++) {
        const symbol = code.charAt(i);
        if (symbol && inputsGroup[i]) {
          inputsGroup[i].value = symbol;
          active = i;
        } else if (!symbol && inputsGroup[i]) {
          inputsGroup[i].value = '';
          active = i;
        }
      }
      active = active == null ? lastIndex : active;

      inputsGroup[active].focus();
      inputsGroup[active].setSelectionRange(1, 1);

      skipChangeHandle = false;
      emitOnChange();
    };

    const emitEnter = (event: KeyboardEvent) => {
      emitOnChange();
      callbacksRef.current.onKeyDown?.(event as any);
    };

    const getValue = () => {
      let output = '';
      for (let i = 0; i < maxLength; i++) {
        const inputCell = inputsGroup[i];
        const symbol = inputCell?.value;
        if (!symbol) {
          break;
        }
        output += symbol;
      }
      return output;
    };

    const emitOnChange = () => {
      const event = new Event('change');
      input.value = getValue();
      input.dispatchEvent(event);
      callbacksRef.current.onChange?.(event as any);
    };

    const emitOnBlur = () => {
      const event = new Event('blur');
      input.dispatchEvent(event);
      callbacksRef.current.onBlur?.(event as any);
    }

    const addSymbol = (symbol: string) => {
      if (active === null || !inputsGroup[active] || !symbol) {
        return;
      }

      const next = active + 1;
      const nextInput = inputsGroup[next]
      const currentInput = inputsGroup[active];

      if (currentInput.value && !nextInput) {
        return;
      }
      currentInput.value = symbol;
      if (!skipChangeHandle) {
        emitOnChange();
      }


      if (!nextInput) {
        skipChangeHandle = false;
        emitOnChange();
        return;
      }
      setTimeout(() => {
        active = next;
        skipBlurHandle = true;
        skipFocusHandle = true;
        nextInput.focus();
        nextInput.setSelectionRange(0, 1, 'forward');
      }, 1);
    };

    const backspaceRemove = () => {
      if (active === null) {
        return;
      }
      const currentInput = inputsGroup[active];
      if (!currentInput) {
        return;
      }
      currentInput.value = '';
      skipChangeHandle = false;
      emitOnChange();

      const prev = active - 1;
      const prevInput = inputsGroup[prev];
      if (!prevInput) {
        return;
      }

      setTimeout(() => {
        active = prev;
        skipBlurHandle = true;
        skipFocusHandle = true;
        prevInput.focus();
        prevInput.setSelectionRange(0, 1, 'forward');
      }, 1);
    };

    const resetHandler = () => {
      active = null;
      skipBlurHandle = false;
      skipFocusHandle = false;
      skipChangeHandle = true;
      for (let i = 0; i < events.length; i++) {
        inputsGroup[i].value = '';
      }
    };

    const handlers: Record<string, any> = {
      beforeinput: (event: InputEvent) => {
        const self = event.target as HTMLInputElement;
        const index = self.dataset.index ? parseInt(self.dataset.index, 10) : 0;
        const data = event.data?.trim();

        switch (event.inputType) {
          case 'insertText': {
            if (data && data.length === 1 && testOtpCodeSymbol(mask[index], data)) {
              addSymbol(data);
            }
            break;
          }
          case 'deleteContentBackward': {
            backspaceRemove();
            break;
          }
          case 'insertFromPaste': {
            if (data) {
              const code = data.trim().split('').filter((symbol, index) => testOtpCodeSymbol(mask[index], symbol)).join('');
              if (code) {
                insertAll(code);
              }
            }
            break;
          }
          case 'historyUndo':
          case 'historyRedo':
            break;
        }
        return event.preventDefault();
      },
      focusin: () => {
        if (skipFocusHandle) {
          skipFocusHandle = false;
          return;
        }

        for (let i = 0; i < maxLength; i++) {
          const inputCell = inputsGroup[i];
          const symbol = inputCell?.value;
          if (!symbol && inputCell) {
            active = i;
            break;
          }
        }
        active = active === null ? lastIndex : active;

        const target = inputsGroup[active] as HTMLInputElement;
        target.focus()
        target.setSelectionRange(0, 1, 'forward');
      },
      blur: () => {
        if (skipBlurHandle) {
          skipBlurHandle = false;
          return;
        }

        active = null;
        emitOnChange();
        emitOnBlur();
      },
      keydown(event: KeyboardEvent) {
        const newEvent = new KeyboardEvent('keydown', {
          code: event.code,
          isComposing: event.isComposing,
          key: event.key,
          location: event.location,
          repeat: event.repeat,
        });
        input.dispatchEvent(newEvent);
        if (event.key === 'Enter') {
          emitEnter(event);
        }
      },
      keyup(event: KeyboardEvent) {
        const newEvent = new KeyboardEvent('keydown', {
          code: event.code,
          isComposing: event.isComposing,
          key: event.key,
          location: event.location,
          repeat: event.repeat,
        });
        input.dispatchEvent(newEvent);
      }
    };

    const events = Object.keys(handlers);

    for (let i = 0; i < maxLength; i++) {
      for (let j = 0; j < events.length; j++) {
        inputsGroup[i].addEventListener(events[j], handlers[events[j]]);
      }

      off[i] = ((_input, _events) => () => {
        for (let j = 0; j < events.length; j++) {
          _input.removeEventListener(events[j], handlers[events[j]]);
        }
      })(inputsGroup[i], events);
    }

    Object.defineProperty(input, 'value', {
      get(): any {
        return this._value || '';
      },
      set(_value: string) {
        if (this._value === _value) return;

        this._value = _value;
        for (let i = 0; i < inputsGroup.length; i++) {
          inputsGroup[i].value = this._value.charAt(i);
        }
      }
    });

    input.addEventListener('reset', resetHandler);
    return () => {
      input.removeEventListener('reset', resetHandler);
      off.forEach(el => el());
    };
  }, [id, layout]);

  return (
    <div className={`__prefix__ __prefix__-otp-input ${className || ''} ${_props.disabled ? 'disabled' : ''} ${error ? 'error' : ''}`}>
      <Label id={id} label={label} />

      <div className="control-otp">
        <input id={id} type="hidden" aria-invalid={error ? 'true' : 'false'} ref={ref} {..._props} style={{ color: 'white', backgroundColor: 'transparent' }} />

        <div className="group">
          {elements}
        </div>
      </div>

      <Subscript error={error} hint={hint}/>
    </div>
  );
});

