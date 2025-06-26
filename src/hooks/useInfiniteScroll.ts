import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useInfiniteScroll = (
  callback: () => void,
  options: UseInfiniteScrollOptions = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [element, setElement] = useState<HTMLElement | null>(null);

  const { threshold = 1.0, rootMargin = '0px' } = options;

  const observer = useCallback(
    (node: HTMLElement | null) => {
      if (isFetching) return;
      if (element) return; // Already observing
      if (!node) return;

      setElement(node);
    },
    [isFetching, element]
  );

  useEffect(() => {
    if (!element) return;

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          setIsFetching(true);
          callback();
        }
      },
      { threshold, rootMargin }
    );

    intersectionObserver.observe(element);

    return () => {
      intersectionObserver.disconnect();
    };
  }, [element, callback, isFetching, threshold, rootMargin]);

  const setIsFetchingComplete = useCallback(() => {
    setIsFetching(false);
  }, []);

  return { observer, isFetching, setIsFetchingComplete };
};