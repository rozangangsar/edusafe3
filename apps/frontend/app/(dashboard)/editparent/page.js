'use client';

import { Suspense } from 'react';
import EditParentContent from './EditParentContent';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D58AB] mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat data orang tua...</p>
      </div>
    </div>
  );
}

export default function EditParentPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EditParentContent />
    </Suspense>
  );
}
