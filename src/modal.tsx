import { CSSProperties, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './modal.scss';

export interface ModalProps {
  /**
   * Open/Close dialog modal
   */
  isOpen: boolean;
  /**
   * Dismiss modal action
   * @param args
   */
  onDismiss: () => void;
  /**
   * Modal width in any css units
   * @default 'fit-content'
   */
  width?: number | string;
}

/**
 * Modal is used to show a dialog or a box when you click a button.
 *
 * @constructor
 */
export function Modal(props: PropsWithChildren<ModalProps>) {
  const { isOpen, onDismiss, width, children } = props;
  const modalWidth = typeof width === 'number' || (typeof width === 'string' && /^\d+$/.test(width)) ? `${width}px` : width ? width : 'fit-content';
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [isShow, setIsShow] = useState(false);

  // Open
  useEffect(() => {
    if (!isOpen) return;

    setIsShow(true);

    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      const overlay = overlayRef.current;
      if (!overlay) return;

      overlay.classList.add('show');
    }, 10)
  }, [isOpen]);

  // Close
  useEffect(() => {
    if (isOpen) return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const fakeOverlay = document.createElement('div');
    fakeOverlay.className = '__prefix__ __prefix__-modal-overlay show';
    fakeOverlay.innerHTML = overlay.innerHTML;
    fakeOverlay.style.display = 'flex';
    fakeOverlay.style.position = 'fixed';
    fakeOverlay.style.setProperty('--__prefix__v-modal-width', modalWidth)

    document.body.appendChild(fakeOverlay);

    setIsShow(false);

    setTimeout(() => {
      fakeOverlay.addEventListener('transitionend', () => {
        setTimeout(() => {
          fakeOverlay.remove();
          document.body.style.overflow = 'visible';
        }, 10);
      }, { once: true });

      fakeOverlay.classList.remove('show');
    }, 10);
  }, [isOpen, modalWidth]);

  // Dismiss
  useEffect(() => {
    if (!isShow) return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    let isPressed = false;

    function mousedown(event: Event) {
      if (event.target === overlay) {
        isPressed = true;
      }
    }

    function mouseup(event: Event) {
      if (!isPressed) return;
      isPressed = false;

      if (event.target === overlay) {
        onDismiss?.();
      }
    }

    overlay.addEventListener('mousedown', mousedown);
    window.addEventListener('mouseup', mouseup);

    return () => {
      overlay.removeEventListener('mousedown', mousedown);
      window.removeEventListener('mouseup', mouseup);
    }
  }, [isShow]);

  return isShow ? createPortal(
    <div
      aria-label="dialog overlay"
      className="__prefix__ __prefix__-modal-overlay"
      style={{
        '--__prefix__v-modal-width': modalWidth,
      } as CSSProperties}
      ref={overlayRef}
    >
      <div aria-label="dialog content" role="dialog" className="__prefix__-modal-content">
        {children}
      </div>
    </div>,
    document.body,
  ) : null;
}