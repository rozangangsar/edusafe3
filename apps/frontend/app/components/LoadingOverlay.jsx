"use client";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      
      {/* CSS Loader */}
      <div className="loader"></div>

      <p className="mt-4 text-[#0B3869] text-base font-medium tracking-wide">
        Loading...
      </p>

    </div>
  );
}
