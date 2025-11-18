// Contoh penggunaan assets di Next.js

// 1. Pakai Next.js Image component (untuk gambar)
import Image from 'next/image';

export function ExampleImage() {
  return (
    <Image 
      src="/assets/images/logo.png" 
      alt="Logo EduSafe" 
      width={200} 
      height={200}
      priority
    />
  );
}

// 2. Pakai img tag biasa (untuk gambar atau SVG)
export function ExampleImg() {
  return (
    <img 
      src="/assets/images/hero.jpg" 
      alt="Hero Image"
      className="w-full h-auto"
    />
  );
}

// 3. Pakai SVG langsung
export function ExampleSVG() {
  return (
    <img 
      src="/assets/svg/icon.svg" 
      alt="Icon"
      className="w-6 h-6"
    />
  );
}

// 4. Inline SVG (kalau mau styling dengan CSS)
export function ExampleInlineSVG() {
  return (
    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

