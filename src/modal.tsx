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
  const [isForceOpen, setIsForceOpen] = useState(false);
  const _isOpen = isForceOpen || isOpen;

  // Open
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || !_isOpen) return;

    setIsForceOpen(true);
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      overlay.classList.add('show');
    }, 50)
  }, [_isOpen]);

  // Close
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || isOpen || !(!isOpen && isForceOpen)) return;

    console.log('close')

    overlay.addEventListener('transitionend', () => {
      setTimeout(() => {
        setIsForceOpen(false);
        document.body.style.overflow = 'visible';
      }, 50);
    }, { once: true });

    overlay.classList.remove('show');
  }, [isOpen, isForceOpen]);

  return isForceOpen || isOpen ? (
    <>
      {createPortal(
        <div
          aria-label="dialog overlay"
          className="__prefix__ __prefix__-modal-overlay"
          onClick={onDismiss}
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