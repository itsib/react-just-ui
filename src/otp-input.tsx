import { ForwardedRef, forwardRef, useEffect, useMemo, useRef } from 'react';
import type { BaseControlProps } from './types';
import { Label } from './label';
import { Subscript } from './subscript';
import './otp-input.scss';
import { inputCN } from './intermal/css-class';

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
    const off = new Array<() => void>(maxLength);   // Callbacks for remove event listeners for each input
    const input = document.getElementById(id) as HTMLInputElement;  // The main input field where the entire code is written
    const inputsGroup = new Array<HTMLInputElement>(maxLength); // Text fields for each character of the code
    if (!input) return;

    for (let i = 0; i < maxLength; i++) {
      inputsGroup[i] = document.getElementById(`${id}-${i}`) as HTMLInputElement;
    }

    let value = input.value;
    let blurFireTimer: any;

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

    const emitEnter = (event: KeyboardEvent) => {
      callbacksRef.current.onKeyDown?.(event as any);
    };

    const emitCodeToMain = (code: string) => {
      input.value = code;
      const event = new Event('change');
      input.dispatchEvent(event);

      callbacksRef.current.onChange?.(event as any);
    };

    const focusNext = (index: number) => {
      if (index < 0 || index >= maxLength) {
        return;
      }
      inputsGroup[index].focus();
    };

    const insertAll = (code: string) => {
      let output = '';
      for (let i = 0; i < maxLength; i++) {
        const symbol = code.charAt(i);
        if (!symbol) return;
        inputsGroup[i].focus();
        inputsGroup[i].setSelectionRange(1, 1);
        inputsGroup[i].value = symbol;
        output += symbol;
      }
      emitCodeToMain(output);
    };

    const handlers: Record<string, any> = {
      beforeinput: (event: InputEvent) => {
        const self = event.target as HTMLInputElement;
        const index = self.dataset.index ? parseInt(self.dataset.index, 10) : 0;
        const data = event.data?.trim();

        switch (event.inputType) {
          case 'insertText': {
            if (!data || data.length !== 1 || !testOtpCodeSymbol(mask[index], data)) {
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
            if (data) {
              const substring = data!.split('').filter((symbol, index) => testOtpCodeSymbol(mask[index], symbol)).join('');
              if (substring) {
                setTimeout(() => insertAll(substring), 1);
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
      },
      input: () => {
        let output = '';

        for (let i = 0; i < maxLength; i++) {
          output += inputsGroup[i].value;
        }

        emitCodeToMain(output);
      },
      focusin: (event: FocusEvent) => {
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
      },
      blur: () => {
        const event = new Event('blur');
        input.dispatchEvent(event);
        blurFireTimer = setTimeout(() => callbacksRef.current.onBlur?.(event as any), 100);
      },
      keydown(event: KeyboardEvent) {
        const self = event.target as HTMLInputElement;
        const index = self.dataset.index ? parseInt(self.dataset.index, 10) : 0;

        if (event.key === 'ArrowLeft') {
          setTimeout(() => focusNext(index - 1), 1);
        }

        else if (event.key === 'ArrowRight') {
          setTimeout(() => focusNext(index + 1), 1);
        }

        else if (event.key === 'Enter') {
          emitEnter(event);
        }
      },
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
        return value;
      },
      set(_value: string) {
        for (let i = 0; i < inputsGroup.length; i++) {
          inputsGroup[i].value = _value.charAt(i);
        }
        value = _value;
      }
    });

    return () => {
      off.forEach(el => el());
    };
  }, [id, layout]);

  return (
    <div className={inputCN('otp-input', className, false, _props.disabled, error)}>
      <Label id={id} label={label} />

      <div className="control-otp">
        <input id={id} type="hidden" aria-invalid={error ? 'true' : 'false'} ref={ref} {..._props} />

        <div className="group">
          {elements}
        </div>
      </div>

      <Subscript error={error} hint={hint}/>
    </div>
  );
});

