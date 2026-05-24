import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Safely extract parameters with fallbacks
  const searchParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const sortByParam = searchParams.get('sortBy') || '';
  const orderParam = searchParams.get('order') || '';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // Centralized function to update the URL
  const updateParam = useCallback((key, value) => {
    setSearchParams((prev) => {
      if (!value || value === 'all') {
        prev.delete(key);
      } else {
        prev.set(key, String(value));
      }
      
      // If we change filters/sorting, always reset to page 1
      if (key !== 'page') {
        prev.set('page', '1');
      }
      return prev;
    }, { replace: true });
  }, [setSearchParams]);

  // Centralized function to update multiple params at once
  const updateParams = useCallback((updates) => {
    setSearchParams((prev) => {
      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === 'all') {
          prev.delete(key);
        } else {
          prev.set(key, String(value));
        }
        if (key !== 'page') {
          prev.set('page', '1');
        }
      });
      return prev;
    }, { replace: true });
  }, [setSearchParams]);

  return {
    searchParam,
    categoryParam,
    sortByParam,
    orderParam,
    pageParam,
    updateParam,
    updateParams
  };
}