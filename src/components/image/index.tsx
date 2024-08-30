import type { AllHTMLAttributes, FC, ReactNode, CSSProperties } from 'react';
import { useState, useReducer, useEffect } from 'react';
import { cn } from '@utils/class-names.ts';
import './styles.css';

const BAD_URLS = new Set<string>();

/**
 * Circle image properties interface
 *
 * @public
 */
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
  /**
   * Active state flag
   *
   * @remarks
   * If true, it changes the border color to the accent color, and turns on the animation.
   *
   * @public
   */
  active?: boolean;
  /**
   * Disable image
   *
   * @remarks
   * Deactivate the image. Turns off all handlers, and makes the image black and white.
   *
   * @public
   */
  disabled?: boolean;
}

/**
 * Circle image
 *
 * @remarks
 * A component for displaying a circle image.
 * Features:
 *  - Support for the preloader, which turns on when the image file is loaded.
 *  - Fallback URL - link to the backup image if the main one failed to load.
 *  - Active state, suitable for lists where several items can be highlighted.
 *
 * @public
 */
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