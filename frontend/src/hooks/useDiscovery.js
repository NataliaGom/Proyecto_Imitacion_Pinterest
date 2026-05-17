import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from '../api/client';

export function useDiscovery(currentUser) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const loadDiscovery = useCallback(async () => {
    if (!currentUser) {
      setPhotos([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await apiFetch(`/api/discovery?page=${page}&per_page=8`);
      setPhotos(data.items);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser, page]);

  useEffect(() => {
    loadDiscovery();
  }, [loadDiscovery]);

  return { photos, loading, error, page, setPage, reload: loadDiscovery };
}
