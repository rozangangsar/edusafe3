'use client';

import { Suspense } from 'react';
import InformasiKelasContent from './InformasiKelasContent';

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8 px-6 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D58AB] mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat informasi kelas...</p>
      </div>
    </div>
  );
}

export default function InformasiKelas() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <InformasiKelasContent />
    </Suspense>
  );
}