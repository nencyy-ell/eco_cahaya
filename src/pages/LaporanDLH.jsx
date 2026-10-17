import React from 'react';
import { Printer, Download, FileText } from 'lucide-react';

export default function LaporanDLH() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm print:shadow-none print:border-none">
        <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase">Rekapitulasi Laporan Bank Sampah Cahaya Kerja</h1>
            <p className="text-xs text-slate-500 mt-1">Format Penilaian Titik Pantau Adipura & Dinas Lingkungan Hidup (DLH)[cite: 1, 2]</p>
          </div>
          <button onClick={handlePrint} className="print:hidden bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5">
            <Printer className="w-4 h-4" /> Cetak Dokumen (PDF)
          </button>
        </div>

        <table className="w-full text-left text-xs mb-6">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 uppercase">
              <th className="py-2">No</th>
              <th className="py-2">Kategori Sampah</th>
              <th className="py-2">Total Berat</th>
              <th className="py-2">Sirkulasi Rupiah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr><td className="py-2">1</td><td>Botol Plastik Bersih</td><td>34 Kg</td><td>Rp 68.000</td></tr>
            <tr><td className="py-2">2</td><td>Kardus KW 1</td><td>28 Kg</td><td>Rp 42.000</td></tr>
            <tr><td className="py-2">3</td><td>Minyak Jelantah (Mijel)</td><td>16 Kg</td><td>Rp 48.000</td></tr>
            <tr><td className="py-2">4</td><td>Koran & Kertas Bersih</td><td>9.5 Kg</td><td>Rp 66.500</td></tr>
          </tbody>
          <tfoot>
            <tr className="font-black text-slate-900 border-t border-slate-200">
              <td colSpan="2" className="py-3">TOTAL KESELURUHAN</td>
              <td>87.5 Kg</td>
              <td>Rp 224.500</td>
            </tr>
          </tfoot>
        </table>
        <p className="text-xs text-slate-400 italic">Dicetak secara otomatis melalui Sistem Ekosistem ECO-CAHAYA.</p>
      </div>
    </div>
  );
}