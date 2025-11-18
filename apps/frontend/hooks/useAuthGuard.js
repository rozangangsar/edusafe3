'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

export function useAuthGuard(requiredRole) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      try {
        const data = await apiFetch('/api/auth/me');

        const u =
          data.user ||
          data.userFromToken ||
          data.currentUser ||
          data.data ||
          null;

        if (!u) throw new Error('no user data from /api/auth/me');

        if (requiredRole && u.role !== requiredRole) {
          router.replace('/ErrorPage');
          return;
        }

        if (!cancelled) {
          setUser(u);
          setLoading(false);
        }
      } catch (err) {
        console.error('[useAuthGuard] auth error:', err.message);
        router.replace('/login');
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [router, requiredRole]);

  return { user, loading };
}
