import { type ForwardedRef, forwardRef, useEffect, useState } from 'react';
import type { BaseControlProps } from './types';
import { Subscript } from './subscript';
import { Label } from './label';
import './image-input.scss';
import { cn } from './cn';

export interface FileInputProps extends BaseControlProps<HTMLInputElement> {
  /**
   * Show the loading indicator.
   * Blocks the input field.
   */
  loading?: boolean;
  /**
   * The text that will be displayed in
   * the input field while nothing has been
   * entered there yet.
   */
  placeholder?: string;
  /**
   * Do not show the thumbnail of the uploaded file
   * to the right of the field.
   */
  noPreview?: boolean;
}

/**
 * The form element is for single-line text input.
 * It has exactly the same interface as the standard
 * HTMLInputElement, with additional display functions,
 * see bellow.
 */
export const ImageInput = forwardRef(function FileInput(
  props: FileInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const { id, markRequired, className, label, hint, noPreview, loading, disabled, error, placeholder, ..._props } = props;
  const [image, setImage] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);

  useEffect(() => {
    if (noPreview) return;
    const input = document.getElementById(id) as HTMLInputElement;
    if (!input) return;

    function change(event: Event) {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file || !file.type.includes('image')) {
        setFilename(null);
        setImage(null);
        return;
      }

      setFilename(file.name);

      const reader = new FileReader();

      reader.onload = () => setImage(reader.result as string);

      reader.readAsDataURL(file);
    }

    input.addEventListener('change', change);

    return () => {
      input.removeEventListener('change', change);
    };
  }, [id, noPreview]);

  return (
    <div className={cn('__prefix__', '__prefix__-base-control', '__prefix__-image-input', className, { disabled, loading, error: !!error, 'no-preview': noPreview })}>
      {!noPreview ? (
        <div className="preview">
          {image && (disabled || !loading) ? (
            <img src={image} alt="preview" />
          ) : (
            <svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="m22.9 13.1v-6.89c0-2.25-1.83-4.08-4.08-4.08h-13.7c-2.25 0-4.08 1.83-4.08 4.08v11.7c0 2.25 1.83 4.08 4.08 4.08h7.48m-11.3-3.41 3.23-3.77c0.875-0.869 2.24-1 3.27-0.318 1.03 0.684 2.39 0.551 3.27-0.318l2.75-2.75c1.63-1.64 4.21-1.85 6.09-0.507l2.91 2.25m-15.6-3.36c2.61-0.0153 2.59-3.93-0.0236-3.92-2.61 0.0161-2.59 3.93 0.0236 3.92"/>
              <path className="arrow"  d="m21.8 18.7-2.32-2.32c-0.212-0.213-0.557-0.213-0.769 0l-2.32 2.32m2.7-2.48v5.9"/>
              <path className="circle" d="m22 19.5a2.86 2.82 0 0 1-2.86 2.82 2.86 2.82 0 0 1-2.86-2.82 2.86 2.82 0 0 1 2.86-2.82 2.86 2.82 0 0 1 2.86 2.82z" />

            </svg>
          )}
        </div>
      ) : null}

      <Label id={id} label={label} required={markRequired}/>

      <div className="control">
        {!disabled && loading && noPreview ? <div className="overlay"></div> : null}
        <input
          id={id}
          type="file"
          disabled={disabled}
          aria-label={typeof label === 'string' ? label : undefined}
          accept="image/*"
          ref={ref}
          {..._props}
        />

        <div className="fake-input">
          {filename ? (
            <span>{filename}</span>
          ) : (
            <span className="ps">{placeholder || 'Choose File'}</span>
          )}
        </div>
      </div>

      {!noPreview ? <div/> : null}

      <Subscript error={error} hint={hint} />
    </div>
  );
});