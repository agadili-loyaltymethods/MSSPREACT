import { useEffect, useRef } from 'react';

export const useTimeFormat = () => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !element.textContent) return;

    const text = element.textContent;
    element.innerHTML = `${text.substr(0, 5)}<small class="text-small">${text.substr(5, 2)}</small>`;
  }, []);

  return elementRef;
};