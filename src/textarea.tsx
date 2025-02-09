import { ForwardedRef, forwardRef, useEffect } from 'react';
import type { BaseControlProps } from './types';
import { Subscript } from './subscript';
import { Label } from './label';
import './textarea.scss';
import { cn } from './cn';

export interface TextareaProps extends BaseControlProps<HTMLTextAreaElement> {
  /**
   * The text that will be displayed in
   * the input field while nothing has been
   * entered there yet.
   */
  placeholder?: string;
  /**
   * Show the loading indicator.
   * Blocks the input field.
   */
  loading?: boolean;
  /**
   * Automatically changes the height of the text field within
   * the limits set by the parameters
   * {@link TextareaProps.minHeight} and {@link TextareaProps.maxHeight}.
   *
   * @default true
   */
  elastic?: boolean;
  /**
   * Set the minimum height of the text field.
   * By default, the current line height is.
   */
  minHeight?: number;
  /**
   * Set the maximum height of the text
   * field. It is unlimited by default.
   */
  maxHeight?: number;
  /**
   * Text area fixed width
   * @default 100%
   */
  width?: number;
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
) {
  const { id, className, placeholder, elastic = true, label, hint, minHeight, width, maxHeight, loading, markRequired, disabled, error, ..._props } = props;

  // Elastic textarea
  useEffect(() => {
    if (!elastic) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext('2d')!;
    const textarea = document.getElementById(id) as HTMLTextAreaElement;

    const styleMap = textarea.computedStyleMap();
    const fontSize = (styleMap.get('font-size') as any).value || 14;
    const paddingLeft = (styleMap.get('padding-left') as any).value || 0;
    const paddingRight = (styleMap.get('padding-right') as any).value || 0;
    const fontWeight = (styleMap.get('font-weight') as any).value || 400;
    const lineHeight = (styleMap.get('line-height') as any).value || 1.3;
    const fontFamily = (styleMap.get('font-family') as any).toString();
    const stringHeight = fontSize * lineHeight;
    const paddingX = paddingRight + paddingLeft;

    context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

    const innerMinHeight = minHeight != null && minHeight > stringHeight ? minHeight : stringHeight;

    const insert = (base: string, replacer: string, start: number = base.length, end: number = start): string => {
      [start, end] = start <= end ? [start, end] : [end, start];

      if (base.length <= start) {
        const spaces = start - base.length;
        return base + ' '.repeat(spaces) + replacer;
      }

      let output = base.slice(0, start);
      output += replacer;
      output += base.slice(end);
      return output;
    };

    const predictHeight = (insertedText: string, posStart: number, postEnd: number): number => {
      const strings = insert(textarea.value, insertedText, posStart, postEnd).split('\n');
      let count = 0;

      for (let i = 0; i < strings.length; i++) {
        const string = strings[i];
        if (string.length <= 5) {
          count++;
          continue;
        }
        const width = textarea.clientWidth - paddingX;
        const metrics = context.measureText(string);

        count += Math.ceil(metrics.width / width);
      }

      const height = (count * stringHeight);
      if (maxHeight != null && maxHeight < height) {
        return maxHeight;
      }
      if (innerMinHeight > height) {
        return innerMinHeight;
      }
      return height;
    };

    const onBeforeinput = async (event: InputEvent) => {
      let selectionStart = textarea.selectionStart ?? 0;
      let selectionEnd = textarea.selectionEnd ?? 0;
      let data = event.data || '';

      switch (event.inputType) {
        case 'insertLineBreak':
          data += '\n';
          break;
        case 'deleteContentBackward':
          selectionStart = selectionStart > 0 ? selectionStart - 1 : selectionStart;
          break;
        case 'deleteContentForward':
          selectionEnd = selectionEnd + 1;
          break;
      }

      const height = predictHeight(data, selectionStart, selectionEnd);

      textarea.style.height = `${height}px`;
    }

    const height = predictHeight(' ', 0, 1);
    textarea.style.height = `${height}px`;

    textarea.addEventListener('beforeinput', onBeforeinput);
    return () => {
      textarea.removeEventListener('beforeinput', onBeforeinput);
    }
  }, [id, elastic, minHeight, maxHeight]);

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
    <div className={cn('__prefix__', '__prefix__-base-control', '__prefix__-textarea', '__prefix__-scroll', className, { disabled, loading, error: !!error })}>
      <Label id={id} label={label} required={markRequired} />

      <textarea
        id={id}
        className="__prefix__-scroll control"
        placeholder={placeholder}
        disabled={disabled}
        style={{ width, lineHeight: 1.3 }}
        ref={ref}
        {..._props}
      />

      <Subscript error={error} hint={hint} />
    </div>
  );
});