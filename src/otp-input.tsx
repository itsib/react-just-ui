import { ForwardedRef, forwardRef, useEffect, useMemo, useRef } from 'react';
import type { BaseControlProps } from './types';
import { Label } from './label';
import { Subscript } from './subscript';
import './otp-input.css';

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
  /**
   * Rewrite code to upper case
   * @public
   */
  upper?: boolean;
}

/**
 * One-time password input. This is the most complete OTP input on the web.
 */
export const OtpInput = forwardRef(function FormControlVerifyCode(
  props: OtpInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, className, label, hint, error, layout = 'ddd-ddd', upper = false, ..._props} = props;
  // const indexRef = useRef(0);
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
          return <div key={`${id}-${key}`} id={`${id}-${index++}`} className="symbol" />
      }
    });
  }, [layout, id]);

  // Handle user input and resolve 6-letters code
  useEffect(() => {
    // if (!id) {
    //   throw new Error('ATTR_ID');
    // }
    // const count = elements.filter(el => ['d', 's', 'w'].includes(el)).length; // The number of characters in the code
    // const off = new Array<() => void>(count);   // Callbacks for remove event listeners for each input
    // const main = document.getElementById(id) as HTMLInputElement;  // The main input field where the entire code is written
    // const slave = new Array<HTMLInputElement>(count); // Text fields for each character of the code
    // if (!main) return;
    //
    // for (let i = 0; i < count; i++) {
    //   slave[i] = document.getElementById(`${id}-${i}`) as HTMLInputElement;
    // }
    //
    // let value = main.value;
    // let blurFireTimer: any;
    //
   
    //
    // const emitCodeToMain = (code: string) => {
    //   main.value = code;
    //   const event = new Event('change');
    //   main.dispatchEvent(event);
    //
    //   callbacksRef.current.onChange?.(event as any);
    // };
    //
    // const focusNext = (index: number) => {
    //   if (index < 0 || index >= 6) {
    //     return;
    //   }
    //   slave[index].focus();
    //   slave[index].setSelectionRange(0, 1, 'forward');
    // };
    //
    // const insertAll = (code: string) => {
    //   let output = '';
    //   for (let i = 0; i < count; i++) {
    //     let symbol = code.charAt(i);
    //     if (!symbol) {
    //       return;
    //     }
    //     if (upper) {
    //       symbol = symbol.toUpperCase();
    //     }
    //     slave[i].focus();
    //     slave[i].setSelectionRange(1, 1);
    //     slave[i].value = symbol;
    //     output += symbol;
    //   }
    //   emitCodeToMain(output);
    // };
    //
    // const onInput = () => {
    //   let output = '';
    //
    //   for (let i = 0; i < count; i++) {
    //     if (upper) {
    //       slave[i].value = slave[i].value?.toUpperCase();
    //     }
    //     output += slave[i].value;
    //   }
    //
    //   emitCodeToMain(output);
    // };
    //
    // const onBlur = () => {
    //   const event = new Event('blur');
    //   main.dispatchEvent(event);
    //   blurFireTimer = setTimeout(() => callbacksRef.current.onBlur?.(event as any), 100);
    // };
    //
    // const onBefore = (event: InputEvent) => {
    //   const self = event.target as HTMLInputElement;
    //   const index = self.dataset.index ? parseInt(self.dataset.index, 10) : 0;
    //   const filter = self.dataset.filter!;
    //   const data = event.data?.trim();
    //
    //   switch (event.inputType) {
    //     case 'insertText': {
    //       if (!data || data.length !== 1 || !testSymbol(filter, data)) {
    //         return event.preventDefault();
    //       } else {
    //         setTimeout(() => focusNext(index + 1), 1);
    //         return;
    //       }
    //     }
    //     case 'deleteContentBackward': {
    //       setTimeout(() => focusNext(index - 1), 1);
    //       return;
    //     }
    //     case 'insertFromPaste': {
    //       if (data && data.length === count || index === 0) {
    //         const isValid = data!.split('').every((symbol, index) => testSymbol(slave[index].dataset.filter!, symbol));
    //         if (isValid) {
    //           setTimeout(() => insertAll(data!), 1);
    //         }
    //       }
    //       event.preventDefault();
    //       return;
    //     }
    //     case 'historyUndo':
    //     case 'historyRedo':
    //       event.preventDefault();
    //       break;
    //   }
    // };
    //
    // const onFocus = (event: FocusEvent) => {
    //   if (event.relatedTarget) {
    //     return;
    //   }
    //   clearTimeout(blurFireTimer);
    //   const currentIndex = +(event.target as any).dataset.index;
    //   const shouldIndex = value.length;
    //   if (shouldIndex < currentIndex) {
    //     focusNext(shouldIndex);
    //     return;
    //   }
    //
    //   const self = event.target as HTMLInputElement;
    //   self.setSelectionRange(0, 1, 'forward');
    // };
    //
    // const onKeydown = (event: KeyboardEvent) => {
    //   const self = event.target as HTMLInputElement;
    //   const index = self.dataset.index ? parseInt(self.dataset.index, 10) : 0;
    //
    //   if (event.key === 'ArrowLeft') {
    //     setTimeout(() => focusNext(index - 1), 1);
    //   }
    //
    //   else if (event.key === 'ArrowRight') {
    //     setTimeout(() => focusNext(index + 1), 1);
    //   }
    // };
    //
    // for (let i = 0; i < count; i++) {
    //   slave[i].addEventListener('beforeinput', onBefore);
    //   slave[i].addEventListener('input', onInput);
    //   slave[i].addEventListener('focusin', onFocus);
    //   slave[i].addEventListener('blur', onBlur);
    //   slave[i].addEventListener('keydown', onKeydown);
    //   off[i] = ((_input) => () => {
    //     _input.removeEventListener('beforeinput', onBefore);
    //     _input.removeEventListener('input', onInput);
    //     _input.removeEventListener('focusin', onFocus);
    //     _input.removeEventListener('blur', onBlur);
    //     _input.removeEventListener('keydown', onKeydown);
    //   })(slave[i]);
    // }
    //
    // Object.defineProperty(main, 'value', {
    //   get(): any {
    //     return value;
    //   },
    //   set(_value: string) {
    //     for (let i = 0; i < slave.length; i++) {
    //       slave[i].value = _value.charAt(i);
    //     }
    //     value = _value;
    //   }
    // });
    //
    // return () => {
    //   off.forEach(el => el());
    // };
  }, [id, upper, elements]);

  useEffect(() => {
    if (!id) throw new Error('ATTR_ID');

    const mask: string[] = layout.split('').filter(el => ['d', 's', 'w'].includes(el as any));
    const input = document.getElementById(id) as HTMLInputElement;
    const blocks = new Array<HTMLDivElement>(mask.length); // Text fields for each character of the code
    if (!input) return;

    for (let i = 0; i < mask.length; i++) {
      blocks[i] = document.getElementById(`${id}-${i}`) as HTMLDivElement;
    }

    let isFocused = false;
    let value = input.value || '';
    let active: number | null = null;
    const deactivate = () => {
      if (active !== null) {
        blocks[active].classList.remove('in');
      }
      active = null;
    };
    const activate = () => {
      deactivate();
      const focusIndex = value.length === mask.length ? value.length : value.length + 1;
      blocks[focusIndex].classList.add('in');
      active = focusIndex;
    };
    const update = (value: string) => {
      for (let i = 0; i < mask.length; i++) {
        blocks[i].innerText = value.charAt(i) || '';
      }
    };

    const remove = (selectStart?: number | null, selectEnd?: number | null) => {
      selectStart = selectStart == null ? value.length - 1 : selectStart;
      selectEnd = selectEnd == null ? selectStart : selectEnd;

    }

    const insert = (symbols: string, selectStart?: number | null, selectEnd?: number | null) => {
      selectStart = selectStart == null ? value.length - 1 : selectStart;
      selectEnd = selectEnd == null ? selectStart : selectEnd;

      const prefix = value.slice(0, selectStart);
      const suffix = value.slice(selectEnd);
      value = prefix + symbols + suffix;

      if (value.length > mask.length) {
        value = value.slice(0, mask.length);
      }
      if (isFocused) {
        activate();
      }
    }

    const onFocus = (event: FocusEvent) => {
      isFocused = true;
      value = input.value;
      activate();

      console.log('focus', event)
    };

    const onBlur = (event: FocusEvent) => {
      deactivate();
      console.log(event)
      isFocused = false;
    };

    const onInput = (event: Event) => {
      const data = (event as InputEvent)?.data ?? '';
      switch ((event as InputEvent).inputType) {
        case 'insertText':
          insert(data, input.selectionStart, input.selectionEnd);
          break;
        case 'deleteContentBackward':
          remove(input.selectionStart, input.selectionEnd);
          break;
      }
        console.log('input', event)
    };

    const onBeforeInput = (event: InputEvent) => {
      const inputType = event.inputType;
      const data = event.data?.trim();

      switch (inputType) {
        case 'insertText': {
          if (!data || data.length !== 1 || !testOtpCodeSymbol(mask[value.length], data) || value.length >= mask.length) {
            return event.preventDefault();
          }
          break;
        }
        case 'deleteContentBackward': {
          if (value.length === 0) {
            return event.preventDefault();
          }
          return;
        }
        case 'insertFromPaste': {
          if (!data || data.length > mask.length) {
            event.preventDefault();
          }
          return;
        }
        case 'historyUndo':
        case 'historyRedo':
          event.preventDefault();
          break;
      }

      // console.log('beforeinput', inputType)
    };

    const onChange = () => {
      update(input.value);
      testOtpCode(mask, '1');
    };

    input.addEventListener('blur', onBlur);
    input.addEventListener('focus', onFocus);
    input.addEventListener('input', onInput);
    input.addEventListener('beforeinput', onBeforeInput);
    input.addEventListener('change', onChange);

    return () => {
      input.removeEventListener('blur', onBlur);
      input.removeEventListener('focus', onFocus);
      input.removeEventListener('input', onInput);
      input.removeEventListener('beforeinput', onBeforeInput);
      input.removeEventListener('change', onChange);
    };
  }, [id, upper, layout]);

  return (
    <div className={`jj jj-otp-input ${_props.disabled ? 'disabled' : ''} ${error ? 'error' : ''} ${className ?? ''}`}>
      <Label id={id} label={label} />

      <div className="control-otp">
        <input id={id} type="text" aria-invalid={error ? 'true' : 'false'} ref={ref} {..._props} />

        <div className="group">
          {elements}
        </div>
      </div>

      <Subscript error={error} hint={hint}/>
    </div>
  );
});


function testOtpCode(mask: string[], value: string): boolean {
  if (mask.length !== value.length) {
    return false;
  }

  return mask.every((item, index) => testOtpCodeSymbol(item, value.charAt(index)));
}

function testOtpCodeSymbol(maskItem: string, symbol: string): boolean {
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
}