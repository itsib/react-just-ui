import { ForwardedRef, forwardRef, useEffect } from 'react';
import { BaseProps } from '../types';
import { JuiError } from '../jui-error/jui-error.tsx';
import { JuiLabel } from '../jui-label/jui-label.tsx';
import './jui-textarea.css';
import { cn } from '../utils';

export interface IJuiTextarea extends BaseProps<HTMLTextAreaElement> {
  elastic?: boolean;
  placeholder?: string;
  loading?: boolean;
  limit?: number;
  minHeight?: number;
  maxHeight?: number;
  minWidth?: number;
  maxWidth?: number;
}

export const JuiTextarea = forwardRef(function JuiTextarea(
  props: IJuiTextarea,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  const { id, className, placeholder, elastic = true, label, hint, minHeight, minWidth, maxWidth, maxHeight, limit = 5000, loading, error, ..._props } = props;

  // Elastic textarea
  useEffect(() => {
    if (!elastic) {
      return;
    }
    const textarea = document.getElementById(id) as HTMLTextAreaElement;
    const element = document.createElement('div');
    document.body.appendChild(element);

    const styleMap = textarea.computedStyleMap();

    element.style.left = `-999999px`;
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

  // Loading indicator
  useEffect(() => {
    if (!loading) {
      return;
    }
    const textarea = document.getElementById(id) as HTMLTextAreaElement;

    const loader = document.createElement('div');
    loader.classList.add('loader-backdrop');
    loader.innerHTML = '<span class="jui-loading"/>';
    loader.style.width = `${textarea.offsetWidth}px`;
    loader.style.height = `${textarea.offsetHeight}px`;
    textarea.parentElement!.insertBefore(loader, textarea);


    return () => {
      loader.remove();
    }
  }, [loading, id]);

  return (
    <div className={cn(['jui', 'jui-textarea'], {
      disabled: !!_props.disabled,
      error: !!error,
      loading: !!loading
    }, className)}>
      <JuiLabel id={id} label={label} hint={hint}/>

      <textarea className="control jui-scroll" placeholder={placeholder} id={id} ref={ref}
                style={{ minHeight, maxHeight, minWidth, maxWidth }} {..._props} />

      <JuiError error={error}/>
    </div>
  );
});