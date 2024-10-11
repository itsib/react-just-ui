import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './modal.scss';

export interface ModalProps {
  /**
   * Open/Close dialog modal
   */
  isOpen: boolean;
  /**
   * Prevent close dialog modal on backdrop
   */
  isLocked?: boolean;
  /**
   * Dismiss modal action
   * @param args
   */
  onDismiss: () => void;
}

/**
 * Modal is used to show a dialog or a box when you click a button.
 * @param isOpen
 * @param isLocked
 * @param onDismiss
 * @param children
 * @constructor
 */
export function Modal({ isOpen, onDismiss, isLocked, children }: PropsWithChildren<ModalProps>) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsShow(true);
      setTimeout(() => {
        overlayRef.current?.classList.add('show');
      }, 10);
    } else {
      document.body.style.overflow = 'visible';
      overlayRef.current?.classList.remove('show');
      overlayRef.current?.addEventListener('transitionend', () => setIsShow(false), { once: true });
    }
  }, [isOpen]);

  return isShow ? (
    <>
      {createPortal(
        <div
          aria-label="dialog overlay"
          className="__prefix__ __prefix__-modal-overlay"
          onClick={e => {
            if (isLocked) {
              return e.stopPropagation();
            } else {
              onDismiss?.()
            }
          }}
          ref={overlayRef}
        >
          <div aria-label="dialog content" className="__prefix__-modal-content" onClick={e => e.stopPropagation()}>
            {children}
          </div>
        </div>,
        document.body,
      )}
    </>
  ) : null;
}