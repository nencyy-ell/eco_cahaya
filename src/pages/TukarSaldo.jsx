import React, { useState } from 'react';
import { Coins, ShoppingCart, Calendar, CheckCircle } from 'lucide-react';

export default function TukarSaldo() {
  const [tipe, setTipe] = useState('sembako');
  const [success, setSuccess] = useState(false);

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900">Penukaran Saldo Sampah</h1>
        <p className="text-xs text-slate-500 mt-1">Saldo aktif Anda saat ini: <span className="font-bold text-emerald-600">Rp 45.000</span></p>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800">Pengajuan Berhasil Dicatat!</h3>
            <p className="text-xs text-slate-500 mt-1">Pengurus akan segera memproses penukaran Anda di buku rekap[cite: 1, 2].</p>
            <button onClick={() => setSuccess(false)} className="mt-4 text-xs font-bold text-emerald-600">Ajukan Lainnya</button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSuccess(true); }} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-2">Pilih Metode Penukaran</label>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <button type="button" onClick={() => setTipe('sembako')} className={`p-3 rounded-xl border ${tipe === 'sembako' ? 'border-emerald-600 bg-emerald-50 font-bold text-emerald-700' : 'border-slate-200'}`}><ShoppingCart className="w-4 h-4 mx-auto mb-1" /> Sembako</button>
                <button type="button" onClick={() => setTipe('emas')} className={`p-3 rounded-xl border ${tipe === 'emas' ? 'border-amber-600 bg-amber-50 font-bold text-amber-700' : 'border-slate-200'}`}><Coins className="w-4 h-4 mx-auto mb-1" /> Tabung Emas</button>
                <button type="button" onClick={() => setTipe('simpan')} className={`p-3 rounded-xl border ${tipe === 'simpan' ? 'border-blue-600 bg-blue-50 font-bold text-blue-700' : 'border-slate-200'}`}><Calendar className="w-4 h-4 mx-auto mb-1" /> Hari Raya</button>
              </div>
            </div>
            {tipe === 'emas' && <p className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl">Khusus tabungan emas, batas minimal akumulasi adalah Rp 50.000 untuk disetorkan ke Pegadaian Situbondo[cite: 1, 2].</p>}
            <div>
              <label className="text-xs font-bold text-slate-600">Nominal yang Ingin Ditarik (Rp)</label>
              <input type="number" defaultValue="25000" className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold" required />
            </div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition text-sm">
              Konfirmasi Penukaran Saldo
            </button>
          </form>
        )}
      </div>
    </div>
  );
}