import React from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Coins, ArrowUpRight, History } from 'lucide-react';

export default function DashboardWarga() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Halo, Ibu Siti Aminah</h1>
          <p className="text-xs text-slate-500">ID Rekening: BSCK-001 • Nasabah Aktif</p>
        </div>
        <Link to="/warga/tukar-saldo" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5">
          Tukar Saldo <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-emerald-600 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-bold"><Wallet className="w-4 h-4" /> Saldo Aktif Dapat Ditarik</div>
          <div className="text-3xl font-black mt-2">Rp 45.000</div>
          <p className="text-xs text-emerald-200 mt-2">Dapat ditukar sembako atau dialihkan ke tabungan emas jika mencapai Rp 50.000[cite: 1, 2].</p>
        </div>
        <div className="bg-amber-500 text-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-2 text-amber-100 text-xs font-bold"><Coins className="w-4 h-4" /> Portofolio Emas Pegadaian</div>
          <div className="text-3xl font-black mt-2">0.24 Gram</div>
          <p className="text-xs text-amber-100 mt-2">Terkonversi melalui mitra Pegadaian Situbondo[cite: 1, 2].</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4"><History className="w-4 h-4 text-emerald-600" /> Riwayat Setoran Terakhir</h3>
        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-3 flex justify-between"><div><p className="font-bold text-slate-800">Botol Plastik Bersih (4 Kg)[cite: 1, 2]</p><span className="text-slate-400">14 Oktober 2026</span></div><span className="font-bold text-emerald-600">+Rp 8.000</span></div>
          <div className="py-3 flex justify-between"><div><p className="font-bold text-slate-800">Minyak Jelantah (3 Kg)[cite: 1, 2]</p><span className="text-slate-400">02 Oktober 2026</span></div><span className="font-bold text-emerald-600">+Rp 9.000</span></div>
        </div>
      </div>
    </div>
  );
}