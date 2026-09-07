const MENU_ITEM_SELECTOR = 'a[href], button:not([disabled]), [role="menuitem"]';

export function getMenuItems(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR)).filter(
    (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
  );
}

export function handleMenuKeyDown(
  event: React.KeyboardEvent<HTMLElement>,
  onClose: () => void,
) {
  const items = getMenuItems(event.currentTarget);
  if (!items.length) return;

  const activeIndex = items.findIndex((item) => item === document.activeElement);

  switch (event.key) {
    case "ArrowDown": {
      event.preventDefault();
      const next = items[activeIndex >= 0 ? (activeIndex + 1) % items.length : 0];
      next.focus();
      return;
    }
    case "ArrowUp": {
      event.preventDefault();
      const previous = items[activeIndex >= 0 ? (activeIndex - 1 + items.length) % items.length : items.length - 1];
      previous.focus();
      return;
    }
    case "Home": {
      event.preventDefault();
      items[0]?.focus();
      return;
    }
    case "End": {
      event.preventDefault();
      items[items.length - 1]?.focus();
      return;
    }
    case "Escape": {
      event.preventDefault();
      onClose();
      return;
    }
    default:
      return;
  }
}
