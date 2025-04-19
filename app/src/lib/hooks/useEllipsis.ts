import { useEffect, useRef } from 'react';

export const useEllipsis = () => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const checkEllipsis = () => {
      if (element.offsetWidth < element.scrollWidth) {
        element.setAttribute('data-title', element.textContent || '');
      } else {
        element.removeAttribute('data-title');
      }
    };

    checkEllipsis();
    window.addEventListener('resize', checkEllipsis);

    return () => {
      window.removeEventListener('resize', checkEllipsis);
    };
  }, []);

  return elementRef;
};