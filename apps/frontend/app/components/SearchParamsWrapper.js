'use client';

import { Suspense } from 'react';

/**
 * Wrapper component untuk menangani useSearchParams() dengan Suspense boundary
 *
 * Penggunaan:
 * <SearchParamsWrapper fallback={<Loading />}>
 *   <YourComponent />
 * </SearchParamsWrapper>
 */
export function SearchParamsWrapper({ children, fallback }) {
  return (
    <Suspense fallback={fallback || <div className="flex items-center justify-center h-screen text-gray-500">Memuat...</div>}>
      {children}
    </Suspense>
  );
}
