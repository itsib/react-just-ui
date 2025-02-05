import { AllHTMLAttributes, CSSProperties, FC, ReactNode, useMemo } from 'react';
import { useEffect, useReducer, useState } from 'react';
import { cn } from './cn';
import './avatar.scss';

const BAD_URLS = new Set<string>();

export interface AvatarProps extends Omit<AllHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError' | 'loading' | 'id' | 'size' | 'width' | 'height' | 'alt'> {
  /**
   * The URL of the displayed image
   */
  src?: string;
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
   * If there is no picture, the first letters of the user's name will be displayed.
   */
  username?: string;
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
  const { className, src, size = 32, fallback, loading = false, active = false, disabled = false, border = 0, username, ...rest } = props;
  const [ready, setReady] = useState(false);
  const [, update] = useReducer(x => x + 1, 0);

  const noSrc = !src || (!!src && BAD_URLS.has(src));
  const noFallback = !fallback || (typeof fallback === 'string' && BAD_URLS.has(fallback));

  const state = {
    ready: ready || (noFallback && noSrc),
    loading: !disabled && loading,
    active: !disabled && !loading && active,
    disabled,
  }

  useEffect(() => setReady(false), [src]);

  return (
    <div
      className={cn('__prefix__', '__prefix__-avatar', className, state) }
      style={{
        '--__prefix__-avatar-size': typeof size === 'number' ? `${size}px` : size,
        '--__prefix__-avatar-border': `${border}px`,
      } as CSSProperties}
    >
      <div className="avatar">
        {src && !BAD_URLS.has(src) ? (
          <img
            src={src}
            alt="A"
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
            alt="FA"
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
          <Placeholder username={username} />
        )}
      </div>

      <div className="ripple"/>
    </div>
  );
};

const Placeholder: FC<{ username?: string }> = ({ username }) => {
  const initials = useMemo(() => {
    if (!username) return null;

    const names = username.trim().split(' ');
    const firstName = names[0] != null ? names[0] : '';
    const lastName = names.length > 1 ? names[names.length - 1] : '';
    const initials = firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}` : firstName.charAt(0);

    if (initials) {
      return initials;
    } else {
      return null;
    }
  }, [username]);

  return (
    <svg className="avatar-placeholder" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      {initials ? (
        <text x="256" y="256" dy="20" fontSize="240" textAnchor="middle" alignmentBaseline="middle" fontFamily="monospace">{initials}</text>
      ) : (
        <path
          d="m256 126c-37 0-68 30-68 68 0 37 30 68 68 68 37 0 68-30 68-68 0-37-30-68-68-68zm0 27c23 0 41 18 41 41 0 23-18 41-41 41s-41-18-41-41c0-23 18-41 41-41zm123 233v-14a96 96 0 0 0-96-96h-55a96 96 0 0 0-96 96v14h27v-14a68 68 0 0 1 68-68h55a68 68 0 0 1 68 68v14z"
        />
      )}
    </svg>
  )
};
