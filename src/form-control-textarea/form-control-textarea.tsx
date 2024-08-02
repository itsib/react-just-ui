import { ForwardedRef, forwardRef, useEffect } from 'react';
import { BaseProps } from '../types';
import { ControlError } from '../common/control-error.tsx';
import { ControlLabel } from '../common/control-label.tsx';

export interface IFormControlTextarea extends BaseProps<HTMLTextAreaElement> {
  elastic?: boolean;
  placeholder?: string;
  limit?: number;
  minHeight?: number;
  minWidth?: number;
}

export const FormControlTextarea = forwardRef(function FormControlTextarea(
  props: IFormControlTextarea,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  const { id, className, placeholder, elastic = true, label, hint, minHeight, minWidth, limit = 5000, error, ..._props } = props;

  useEffect(() => {
    if (!elastic) {
      return;
    }
    const textarea = document.getElementById(id) as HTMLTextAreaElement;
    const element = document.createElement('div');
    document.body.appendChild(element);

    const styleMap = textarea.computedStyleMap();

    element.style.left = `-99999999px`;
    element.style.position = `absolute`;
    element.style.width = `${textarea.offsetWidth}px`;
    element.style.minWidth = `${textarea.offsetWidth}px`;
    element.style.height = 'auto';
    element.style.paddingTop = `${styleMap.get('padding-top')}`;
    element.style.paddingBottom = `${styleMap.get('padding-bottom')}`;
    element.style.paddingLeft = `${styleMap.get('padding-left')}`;
    element.style.paddingRight = `${styleMap.get('padding-right')}`;
    element.style.fontSize = `${styleMap.get('font-size')}`;
    element.style.fontFamily = `${styleMap.get('font-family')}`;
    element.style.lineHeight = `${styleMap.get('line-height')}`;
    element.style.overflowWrap = 'break-word';
    element.style.whiteSpace = 'pre-wrap';

    const onChange = () => {

      element.innerHTML = textarea.value.replace(/\n/g, '\n¦') || '¦';
      setTimeout(() => {
        textarea.style.height = `${element.offsetHeight}px`;
      });
    }

    const onBeforeinput = (event: InputEvent) => {
      if (event.inputType === 'insertText' && textarea.value.length >= limit) {
        return event.preventDefault();
      } else if (event.inputType === 'insertFromPaste' && ((event.data ?? '').length + (textarea.value.length - Math.abs(textarea.selectionStart - textarea.selectionEnd))) >= limit) {
        const [start, end] = textarea.selectionStart < textarea.selectionEnd ? [textarea.selectionStart, textarea.selectionEnd] : [textarea.selectionEnd, textarea.selectionStart];
        const full = textarea.value.slice(0, start) + (event.data ?? '') + textarea.value.slice(end);
        textarea.value = full.slice(0, limit);
        return event.preventDefault();
      }
    }

    textarea.addEventListener('input', onChange);
    textarea.addEventListener('beforeinput', onBeforeinput);

    return () => {
      textarea.removeEventListener('input', onChange);
      textarea.removeEventListener('beforeinput', onBeforeinput);
      document.body.removeChild(element);
    }

  }, [id, elastic, limit]);

  return (
    <div className={`rfc rfc-textarea ${_props.disabled ? 'disabled' : ''} ${error ? 'error' : ''} ${className ?? ''}`}>
      <ControlLabel id={id} label={label} hint={hint} />

      <textarea placeholder={placeholder} className="control" id={id} ref={ref} style={{ minHeight, minWidth }} {..._props} />

      <ControlError error={!_props.disabled ? error : undefined} />
    </div>
  );
});