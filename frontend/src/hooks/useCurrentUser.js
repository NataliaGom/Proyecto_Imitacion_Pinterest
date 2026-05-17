import { useEffect, useState } from 'react';

const STORAGE_KEY = 'pin_minimal_user';

export function useCurrentUser() {
  const [currentUser, setCurrentUser] = useState(() => sessionStorage.getItem(STORAGE_KEY) || '');

  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem(STORAGE_KEY, currentUser);
    }
  }, [currentUser]);

  function saveUser(user) {
    const normalizedUser = user.trim();
    setCurrentUser(normalizedUser);
    sessionStorage.setItem(STORAGE_KEY, normalizedUser);
  }

  function clearUser() {
    setCurrentUser('');
    sessionStorage.removeItem(STORAGE_KEY);
  }

  return { currentUser, saveUser, clearUser };
}
