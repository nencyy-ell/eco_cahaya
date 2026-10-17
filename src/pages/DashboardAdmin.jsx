import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Users, FileText, ArrowRight } from 'lucide-react';

export default function DashboardAdmin() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Panel Pengurus Bank Sampah</h1>
          <p className="text-xs text-slate-500">Bank Sampah Cahaya Kerja • Periode Oktober 2026</p>
        </div>
        <Link to="/admin/setor" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5">
          <Scale className="w-4 h-4" /> Input Setoran Baru
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Total Sampah Terkumpul</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">87.5 Kg</div>
          <p className="text-xs text-slate-500 mt-1">Target bulanan: 50 - 100 Kg[cite: 1, 2]</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Total Nasabah Aktif</span>
          <div className="text-2xl font-black text-blue-600 mt-1">42 Warga</div>
          <p className="text-xs text-slate-500 mt-1">Kawasan RW setempat[cite: 1, 2]</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Batch Antrean Emas</span>
          <div className="text-2xl font-black text-amber-600 mt-1">6 Warga</div>
          <p className="text-xs text-slate-500 mt-1">Siap disetor ke Pegadaian[cite: 1, 2]</p>
        </div>
      </div>
    </div>
  );
}