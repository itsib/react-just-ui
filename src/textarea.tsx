import { ForwardedRef, forwardRef, useEffect } from 'react';
import type { BaseControlProps } from './types';
import { Subscript } from './subscript';
import { Label } from './label';
import './textarea.scss';

export interface TextareaProps extends BaseControlProps<HTMLTextAreaElement> {
  elastic?: boolean;
  placeholder?: string;
  loading?: boolean;
  limit?: number;
  minHeight?: number;
  maxHeight?: number;
  minWidth?: number;
  maxWidth?: number;
}

/**
 * The \<textarea\> HTML element represents a multi-line plain-text editing control,
 * useful when you want to allow users to enter a sizeable amount of free-form text,
 * for example a comment on a review or feedback form. Textarea elements can
 * be made to automatically resize
 */
export const Textarea = forwardRef(function Textarea(
  props: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>,
)   {
  const { id, className, placeholder, elastic = true, label, hint, minHeight, minWidth, maxWidth, maxHeight, limit = 5000, loading, markRequired, disabled, error, ..._props } = props;

  // Elastic textarea
  useEffect(() => {
    if (!elastic) {
      return;
    }
    let skipOnChange = false;
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
      if (skipOnChange) {
        skipOnChange = false;
        return;
      }

      if (!textarea.value) return;

      element.innerHTML = textarea.value.replace(/\n/g, '\n¦') || '¦';
      setTimeout(() => {
        textarea.style.height = `${element.offsetHeight + 4}px`;
      });
    }

    const onBeforeinput = (event: InputEvent) => {
      const value = textarea.value;
      const selectionStart = textarea.selectionStart ?? 0;
      const selectionEnd = textarea.selectionEnd ?? 0;

      switch (event.inputType) {
        // Handle typed text
        case 'insertText':
          if (event.data && textarea.value.length >= limit) {
            return event.preventDefault();
          }
          break;
        // Handle paste
        case 'insertFromPaste':
          if (event.data && (event.data.length + (value.length - Math.abs(selectionStart - selectionEnd))) >= limit) {
            setTimeout(() => {
              textarea.value = textarea.value.slice(0, limit);
            }, 1);
          }
          break;
        case 'insertLineBreak': {
          const styleMap = textarea.computedStyleMap();
          const fontSize = (styleMap.get('font-size') as any)?.value || 0;
          const lineHeight = (styleMap.get('line-height') as any)?.value || 1.3;
          if (!fontSize || !lineHeight) break;
          textarea.style.height = `${textarea.offsetHeight + fontSize * lineHeight}px`;
          skipOnChange=true;
          break;
        }
        case 'deleteContentForward': {
          setTimeout(() => onChange(), 1);
        }
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
    if (!loading || disabled) {
      return;
    }
    const textarea = document.getElementById(id) as HTMLTextAreaElement;

    const overlay = document.createElement('div');
    overlay.style.width = `${textarea.offsetWidth}px`;
    overlay.style.height = `${textarea.offsetHeight}px`;
    overlay.classList.add('overlay');

    const spinner = document.createElement('div');
    spinner.classList.add('spinner')
    overlay.append(spinner)

    textarea.parentElement!.insertBefore(overlay, textarea);

    return () => {
      overlay.remove();
    };
  }, [loading, disabled, id]);

  return (
    <div className={`__prefix__ __prefix__-textarea ${className || ''}${disabled ? ' disabled' : ''}${loading ? ' loading' : ''}${error ? ' error' : ''}`}>
      <Label id={id} label={label} required={markRequired} />

      <textarea
        id={id}
        className="__prefix__-scroll control"
        placeholder={placeholder}
        disabled={disabled}
        style={{ minHeight, maxHeight, minWidth, maxWidth, lineHeight: 1.3 }}
        ref={ref}
        {..._props}
      />

      <Subscript error={error} hint={hint} />
    </div>
  );
});