import { useEffect, useRef, useState } from 'react';

/**
 * Open/close plumbing for the mobile navigation overlay: Escape closes, focus moves into the
 * panel on open and returns to the trigger on close, Tab is kept inside
 * while it is open, and the page behind it is locked from scrolling.
 *
 * `desktopQuery` must match the breakpoint at which the caller's CSS hides the overlay.
 */
export function useNavPanel(scopeRef: React.RefObject<HTMLElement>, desktopQuery: string) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>('a, button')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;
      const focusable = [...panel.querySelectorAll<HTMLElement>('a[href], button')];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const scope = scopeRef.current ?? document;
    scope.addEventListener('keydown', onKeyDown as EventListener);

    // The overlay covers the page, so the page behind it must not scroll.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Past the breakpoint CSS hides the overlay, but `open` would stay true and keep
    // the page scroll-locked behind nothing. Rotating a phone to landscape crosses it.
    const desktop = window.matchMedia(desktopQuery);
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener('change', onDesktop);

    return () => {
      scope.removeEventListener('keydown', onKeyDown as EventListener);
      desktop.removeEventListener('change', onDesktop);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, scopeRef, desktopQuery]);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return { open, setOpen, close, triggerRef, panelRef };
}
