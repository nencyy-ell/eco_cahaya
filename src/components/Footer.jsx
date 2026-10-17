import React from 'react';
import { Leaf, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-8 px-6 mt-16 text-center text-sm text-slate-500">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-emerald-700">
          <Leaf className="w-5 h-5 text-emerald-600" />
          <span>Bank Sampah Cahaya Kerja • Situbondo</span>
        </div>
        <p className="flex items-center gap-1 text-xs text-slate-400">
          Dibuat dengan penuh dedikasi <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk Lingkungan & Komunitas
        </p>
      </div>
    </footer>
  );
}