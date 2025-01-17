import type { AllHTMLAttributes, FC, ReactNode } from 'react';
import { useEffect, useReducer, useState } from 'react';
import { cn } from './cn';
import './avatar.scss';

const BAD_URLS = new Set<string>();

export interface AvatarProps extends Omit<AllHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError' | 'loading' | 'id' | 'size'> {
  /**
   * The URL of the displayed image
   */
  src: string;
  /**
   * The required alt attribute specifies an alternate text for an image, if the image cannot be displayed.
   */
  alt: string;
  /**
   * Image size. The size of the image in pixels.
   * @defaultValue 32
   */
  size?: number | string;
  /**
   * Fallback image. The URL of the image or the Reaction component that will be
   * displayed in case of an error loading the image.
   */
  fallback?: string | ReactNode;
  /**
   * Display loading. Force to display the download status instead of the image.
   */
  loading?: boolean;
  /**
   * Active state flag. If true, it changes the border color to the accent color, and turns on the animation.
   */
  active?: boolean;
  /**
   * Deactivate the image. Turns off all handlers, and makes the image black and white.
   */
  disabled?: boolean;
  /**
   * Width of the framing border in px.
   */
  border?: number;
}

/**
 * Avatar - circle image for displaying a user photo.
 *
 * Features:
 * - Support for the preloader, which turns on when the image file is loaded.
 * - Fallback URL - link to the backup image if the main one failed to load.
 * - Active state, suitable for lists where several items can be highlighted.
 */
export const Avatar: FC<AvatarProps> = props => {
  const { className, src, alt, size = 32, width, height, fallback, loading = false, active = false, disabled = false, border = 0, ...rest } = props;
  const [ready, setReady] = useState(false);
  const [, update] = useReducer(x => x + 1, 0);

  const noSrc = !src || (!!src && BAD_URLS.has(src));
  const noFallback = !fallback || (typeof fallback === 'string' && BAD_URLS.has(fallback));

  const state = {
    ready: ready || (noFallback && noSrc),
    loading: !disabled && loading,
    active: !disabled && !loading && active,
    disabled
  }

  useEffect(() => setReady(false), [src]);

  return (
    <div
      className={cn('__prefix__', '__prefix__-avatar', className, state) }
      style={{
        width: width ? (typeof width === 'number' ? `${width}px` : size) : (typeof size === 'number' ? `${size}px` : size),
        height: height ? (typeof height === 'number' ? `${height}px` : size) : (typeof size === 'number' ? `${size}px` : size),
      }}
    >
      <div
        className="avatar"
        style={{
          borderWidth: `${border}px`,
        }}
      >
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
            {...rest}
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
            {...rest}
          />
        ) : fallback && typeof fallback === 'object' ? (
          <>{fallback}</>
        ) : (
          <svg className="avatar-placeholder" version="1.1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <path
              strokeLinecap="round"
              d="m256 106c-31.9 0-56.1-0.092-76.2 2.61-20.1 2.7-37 8.82-49.7 21.5l-0.016 0.016c-7.35 7.37-12.7 16.3-16.2 26.3a14.8 14.8 0 0 0 9.07 18.8 14.8 14.8 0 0 0 18.8-9.07c2.29-6.53 5.1-11.1 9.21-15.2l6e-3 -6e-3c7.1-7.09 16-10.9 32.7-13.1 16.7-2.25 40.3-2.34 72.2-2.34a14.8 14.8 0 0 0 14.8-14.8 14.8 14.8 0 0 0-14.8-14.8zm50.3 0.504a14.8 14.8 0 0 0-6.63 3.83 14.8 14.8 0 0 0 0 20.9l30.1 30.1-30.1 30.1a14.8 14.8 0 0 0 0 20.9 14.8 14.8 0 0 0 20.9 0l30.1-30.1 30.1 30.1a14.8 14.8 0 0 0 20.9 0 14.8 14.8 0 0 0 0-20.9l-30.1-30.1 30.1-30.1a14.8 14.8 0 0 0 0-20.9 14.8 14.8 0 0 0-20.9 0l-30.1 30.1-30.1-30.1a14.8 14.8 0 0 0-14.3-3.83zm-185 94.2a14.8 14.8 0 0 0-15.1 14.4c-0.276 12.1-0.275 25.6-0.275 40.9 0 31.9-0.0921 56.1 2.61 76.2 2.7 20.1 8.81 37 21.5 49.7 12.7 12.7 29.6 18.8 49.7 21.5 20.1 2.7 44.3 2.61 76.2 2.61s56.1 0.0921 76.2-2.61c20.1-2.7 37-8.82 49.7-21.5l4e-3 -6e-3c12.7-12.7 18.8-29.6 21.5-49.7 2.7-20.1 2.61-44.3 2.61-76.2a14.8 14.8 0 0 0-14.8-14.8 14.8 14.8 0 0 0-14.8 14.8c0 27.9-0.162 49.2-1.69 65.3l-30.7-27.7v2e-3c-19.1-17.2-47.8-18.9-68.8-4.15l-4.04 2.84h-2e-3c-4.95 3.48-11.4 2.92-15.7-1.36h-2e-3l-58-58c-16.7-16.7-43.6-17.8-61.6-2.81 0.0394-4.62 8.8e-4 -10.3 0.0957-14.4a14.8 14.8 0 0 0-14.4-15.1zm44.1 48.4c3.98 0.133 7.9 1.75 11 4.84l58 58h2e-3c14.3 14.3 37.1 16.3 53.6 4.65l4e-3 -2e-3 4.04-2.84c9.9-6.95 23.1-6.16 32.1 1.93l42.3 38c-1.59 2.66-3.36 5.11-5.52 7.26l-4e-3 6e-3 -6e-3 4e-3c-7.08 7.09-16 10.9-32.7 13.1-16.7 2.25-40.3 2.35-72.2 2.35s-55.5-0.0949-72.2-2.35c-16.7-2.25-25.7-6.03-32.8-13.1v-2e-3l-2e-3 -2e-3c-7.09-7.08-10.9-16-13.1-32.7-1.89-14.1-2.17-34.3-2.24-58.8l18.5-16.2 4e-3 -4e-3c3.28-2.87 7.31-4.22 11.3-4.09z" />
          </svg>
        )}
      </div>

      <div className="ripple"/>
    </div>
  );
};