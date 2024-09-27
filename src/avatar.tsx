import type { AllHTMLAttributes, FC, ReactNode } from 'react';
import { useState, useReducer, useEffect } from 'react';
import { cn } from './utils';
import './avatar.css';

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
      className={cn('jj jj-avatar', className, state)}
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
          <div className="jj-image-placeholder"/>
        )}
      </div>

      <div className="ripple"/>
    </div>
  );
};