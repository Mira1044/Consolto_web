import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

const overlayBase =
  'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm pb-[max(1rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]';

const backdropMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

const panelMotion = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.97 },
  transition: { duration: 0.2 },
};

/**
 * Accessible modal overlay (portal + backdrop + centered panel).
 * Use `ariaLabel` or `ariaLabelledBy` for the dialog name when `role` is set.
 */
export function Modal({
  open,
  onClose,
  children,
  className = '',
  overlayClassName = '',
  closeOnOverlay = true,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  role = 'dialog',
}) {
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleOverlayClick = (e) => {
    if (!closeOnOverlay || e.target !== e.currentTarget) {
      return;
    }
    onClose?.();
  };

  const panelA11y = role
    ? {
        role,
        'aria-modal': true,
        ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
        ...(ariaLabelledBy ? { 'aria-labelledby': ariaLabelledBy } : {}),
        ...(ariaDescribedBy ? { 'aria-describedby': ariaDescribedBy } : {}),
      }
    : {};

  const overlayClass = [overlayBase, overlayClassName].filter(Boolean).join(' ');
  const panelClass = ['min-w-0', className].filter(Boolean).join(' ');

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="modal-overlay"
          className={overlayClass}
          {...backdropMotion}
          onClick={handleOverlayClick}
        >
          <motion.div
            className={panelClass}
            {...panelMotion}
            {...panelA11y}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
