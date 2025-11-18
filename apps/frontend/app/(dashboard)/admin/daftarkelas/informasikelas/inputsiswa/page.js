'use client';

import { Suspense } from 'react';
import InputSiswaContent from './InputSiswaContent';

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center mt-[10vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D58AB] mx-auto mb-4"></div>
        <p className="text-gray-600">Memuat daftar siswa...</p>
      </div>
    </div>
  );
}

export default function InputSiswaBaru() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <InputSiswaContent />
    </Suspense>
  );
}
