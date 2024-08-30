import { AllHTMLAttributes, FC, ReactNode, CSSProperties, useReducer, useEffect } from 'react';
import { useState } from 'react';
import { cn } from '@utils/class-names.ts';
import './styles.css';

const BAD_URLS = new Set<string>();

export interface ImageProps extends Omit<AllHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError' | 'loading'> {
  /**
   * Image size
   *
   * @remarks
   * The size of the image in pixels.
   *
   * @defaultValue 32
   * @public
   */
  size?: number;
  /**
   * Fallback image.
   *
   * @remarks
   * The URL of the image or the Reaction component that will be
   * displayed in case of an error loading the image.
   *
   * @public
   */
  fallback?: string | ReactNode;
  /**
   * Display loading
   *
   * @remarks
   * Force to display the download status instead of the image.
   *
   * @public
   */
  loading?: boolean;

  active?: boolean;

  disabled?: boolean;
}

export const Image: FC<ImageProps> = ({ className, src, alt, size = 32, fallback, loading = false, active = false, disabled = false, ...props }) => {
  const [ready, setReady] = useState(false);
  const [, update] = useReducer(x => x + 1, 0);

  const noSrc = !src || (!!src && BAD_URLS.has(src));
  const noFallback = !fallback || (typeof fallback === 'string' && BAD_URLS.has(fallback));

  const state = {
    ready: ready || (noFallback && noSrc),
    loading: loading && !disabled,
    active: active && !disabled && !loading,
    disabled
  }

  useEffect(() => setReady(false), [src]);

  return (
    <div className={cn('jui jui-image', className, state)} style={{'--jui-image-size': `${size}px`} as CSSProperties}>
      <div className="image">
        {src && !BAD_URLS.has(src) ? (
          <img
            src={src}
            alt={alt}
            onLoad={() => setReady(true)}
            onError={() => {
              BAD_URLS.add(src!);
              if (!fallback) {
                setReady(true);
              }
              update();
            }}
            loading="lazy"
            {...props}
          />
        ) : fallback && typeof fallback === 'string' && !BAD_URLS.has(fallback) ? (
          <img
            src={fallback}
            alt={alt}
            onLoad={() => setReady(true)}
            onError={() => {
              BAD_URLS.add(fallback!);
              update();
            }}
            loading="lazy"
            {...props}
          />
        ) : fallback && typeof fallback === 'object' ? (
          <>{fallback}</>
        ) : (
          <div className="jui-image-placeholder"/>
        )}
      </div>

      <div className="ripple"/>
    </div>
  );
};