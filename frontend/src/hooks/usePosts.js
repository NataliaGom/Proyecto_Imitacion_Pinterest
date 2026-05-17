import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '../api/client';

const CACHE_KEY_PREFIX = 'pin_minimal_posts_cache';
const CACHE_TIMESTAMP_PREFIX = 'pin_minimal_posts_cache_timestamp';

function cacheKeyForUser(currentUser) {
  return `${CACHE_KEY_PREFIX}_${currentUser}`;
}

function cacheTimestampKeyForUser(currentUser) {
  return `${CACHE_TIMESTAMP_PREFIX}_${currentUser}`;
}

function mergePosts(cachedPosts, freshPosts) {
  const byId = new Map();
  [...freshPosts, ...cachedPosts].forEach((post) => byId.set(post.id, post));
  return [...byId.values()].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
}

export function usePosts(currentUser) {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, page_size: 12, total: 0, total_pages: 1 });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshPosts = useCallback(() => setRefreshKey((value) => value + 1), []);

  const loadPosts = useCallback(async () => {
    if (!currentUser) {
      setPosts([]);
      return;
    }

    setLoading(true);
    setError('');

    const cacheKey = cacheKeyForUser(currentUser);
    const cacheTimestampKey = cacheTimestampKeyForUser(currentUser);
    const cachedRaw = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(cacheTimestampKey);
    const cachedPosts = cachedRaw ? JSON.parse(cachedRaw) : [];

    if (cachedPosts.length > 0 && page === 1) {
      setPosts(cachedPosts);
    }

    const minDateParam = cachedTimestamp && page === 1 ? `&min_date=${encodeURIComponent(cachedTimestamp)}` : '';

    try {
      const data = await apiFetch(`/api/posts?page=${page}&page_size=${pageSize}${minDateParam}`);
      const nextPosts = cachedPosts.length > 0 && page === 1 ? mergePosts(cachedPosts, data.items) : data.items;
      setPosts(nextPosts);
      setPagination(data.pagination);
      localStorage.setItem(cacheKey, JSON.stringify(nextPosts));
      localStorage.setItem(cacheTimestampKey, new Date().toISOString());
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser, page, pageSize]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts, refreshKey]);

  const actions = useMemo(() => {
    function invalidateCache() {
      if (currentUser) {
        localStorage.removeItem(cacheKeyForUser(currentUser));
        localStorage.removeItem(cacheTimestampKeyForUser(currentUser));
      }
    }

    return {
      async createPost(payload) {
        const created = await apiFetch('/api/posts', { method: 'POST', body: JSON.stringify(payload) });
        invalidateCache();
        refreshPosts();
        return created;
      },
      async getPost(postId) {
        return apiFetch(`/api/posts/${postId}`);
      },
      async patchPost(postId, payload) {
        const updated = await apiFetch(`/api/posts/${postId}`, { method: 'PATCH', body: JSON.stringify(payload) });
        invalidateCache();
        refreshPosts();
        return updated;
      },
      async replacePost(postId, payload) {
        const updated = await apiFetch(`/api/posts/${postId}`, { method: 'PUT', body: JSON.stringify(payload) });
        invalidateCache();
        refreshPosts();
        return updated;
      },
      async deletePost(postId) {
        const deleted = await apiFetch(`/api/posts/${postId}`, { method: 'DELETE' });
        invalidateCache();
        refreshPosts();
        return deleted;
      },
    };
  }, [currentUser, refreshPosts]);

  return {
    posts,
    pagination,
    page,
    pageSize,
    loading,
    error,
    setPage,
    setPageSize,
    refreshPosts,
    ...actions,
  };
}
