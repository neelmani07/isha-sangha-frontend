import { useCallback, useState } from 'react';

/** Tracks an element's rendered size. Returns a callback ref to attach and the latest size. */
export function useElementSize<T extends HTMLElement>() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [observer] = useState(
    () =>
      new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        setSize((current) =>
          current.width === Math.round(width) && current.height === Math.round(height)
            ? current
            : { width: Math.round(width), height: Math.round(height) },
        );
      }),
  );

  const ref = useCallback(
    (element: T | null) => {
      observer.disconnect();
      if (element) observer.observe(element);
    },
    [observer],
  );

  return [ref, size] as const;
}
