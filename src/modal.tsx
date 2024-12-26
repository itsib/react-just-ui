import { PropsWithChildren, useEffect, useRef, useState } from 'react';
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
}

/**
 * Modal is used to show a dialog or a box when you click a button.
 * @param isOpen
 * @param onDismiss
 * @param children
 * @constructor
 */
export function Modal({ isOpen, onDismiss, children }: PropsWithChildren<ModalProps>) {
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
    }, 50)
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

    document.body.appendChild(fakeOverlay);

    setIsShow(false);

    setTimeout(() => {
      fakeOverlay.addEventListener('transitionend', () => {
        setTimeout(() => {
          fakeOverlay.remove();
          document.body.style.overflow = 'visible';
        }, 50);
      }, { once: true });

      fakeOverlay.classList.remove('show');
    }, 50);
  }, [isOpen]);

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
      ref={overlayRef}
    >
      <div aria-label="dialog content" className="__prefix__-modal-content">
        {children}
      </div>
    </div>,
    document.body,
  ) : null;
}