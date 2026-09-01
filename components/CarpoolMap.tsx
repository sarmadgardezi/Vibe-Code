'use client';

import dynamic from 'next/dynamic';

export const CarpoolMap = dynamic(
  () => import('./CarpoolMapContent').then((mod) => mod.CarpoolMapContent),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[540px] bg-gray-100 rounded-3xl flex items-center justify-center border border-gray-200">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-[#4285F4] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-gray-500 font-medium">Loading Interactive Carpool Map...</p>
        </div>
      </div>
    )
  }
);
