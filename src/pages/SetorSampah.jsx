import React, { useState } from 'react';
import { wasteTypes } from '../data/mockData';
import { Scale, Plus, Trash2, CheckCircle, ArrowRight, User } from 'lucide-react';

export default function SetorSampah() {
  // Simulasi daftar warga nasabah
  const wargaList = [
    { id: 1, name: "Ibu Siti Aminah", noRek: "BSCK-001", saldo: 45000 },
    { id: 2, name: "Ibu Fatimah", noRek: "BSCK-002", saldo: 120000 },
    { id: 3, name: "Pak Bambang", noRek: "BSCK-003", saldo: 25000 },
  ];

  const [selectedWargaId, setSelectedWargaId] = useState(wargaList[0].id);
  const [items, setItems] = useState([
    { wasteId: wasteTypes[0].id, quantity: 1 }
  ]);
  const [isSuccess, setIsSuccess] = useState(false);

  // Tambah baris sampah baru jika warga bawa banyak jenis
  const handleAddItem = () => {
    setItems([...items, { wasteId: wasteTypes[0].id, quantity: 1 }]);
  };

  // Hapus baris sampah
  const handleRemoveItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, idx) => idx !== index));
    }
  };

  // Ubah kategori sampah atau kuantiti timbangan
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = field === 'quantity' ? Math.max(0, parseFloat(value) || 0) : parseInt(value);
    setItems(newItems);
  };

  // Hitung total rupiah setoran secara real-time
  const totalRupiah = items.reduce((acc, curr) => {
    const waste = wasteTypes.find(w => w.id === curr.wasteId);
    return acc + (waste ? waste.price * curr.quantity : 0);
  }, 0);

  const selectedWarga = wargaList.find(w => w.id === parseInt(selectedWargaId));

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      {/* Header Halaman */}
      <div className="bg-emerald-600 rounded-2xl p-6 text-white mb-6 shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Scale className="w-7 h-7" /> Pencatatan Setor Sampah
          </h1>
          <p className="text-emerald-100 text-sm mt-1">
            Bank Sampah Cahaya Kerja • Situbondo
          </p>
        </div>
        <span className="bg-emerald-700/80 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider">
          Area Pengurus
        </span>
      </div>

      {isSuccess ? (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-emerald-100 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">Setoran Berhasil Disimpan!</h2>
          <p className="text-slate-600 mt-2">
            Saldo <span className="font-semibold text-slate-800">{selectedWarga?.name}</span> otomatis bertambah sebesar:
          </p>
          <div className="text-3xl font-extrabold text-emerald-600 my-4">
            Rp {totalRupiah.toLocaleString('id-ID')}
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Total saldo sekarang: Rp {((selectedWarga?.saldo || 0) + totalRupiah).toLocaleString('id-ID')}
          </p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setItems([{ wasteId: wasteTypes[0].id, quantity: 1 }]);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 py-3 rounded-xl transition"
          >
            Catat Setoran Lainnya
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Pilih Warga / Nasabah */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-emerald-600" />
              Nama Warga / Nasabah Penabung
            </label>
            <select
              value={selectedWargaId}
              onChange={(e) => setSelectedWargaId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 text-base"
            >
              {wargaList.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.noRek}) — Saldo Aktif: Rp {w.saldo.toLocaleString('id-ID')}
                </option>
              ))}
            </select>
          </div>

          {/* Form Timbangan & Kategori Sampah */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-800">Rincian Timbangan Sampah</h3>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-1.5 text-sm bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold px-3 py-1.5 rounded-lg transition"
              >
                <Plus className="w-4 h-4" /> Tambah Jenis Sampah
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const currentWaste = wasteTypes.find(w => w.id === item.wasteId);
                const subtotal = (currentWaste ? currentWaste.price : 0) * item.quantity;

                return (
                  <div key={index} className="grid grid-cols-12 gap-3 p-4 bg-slate-50 rounded-xl items-center border border-slate-100">
                    {/* Pilih Jenis Sampah */}
                    <div className="col-span-12 md:col-span-5">
                      <label className="text-xs text-slate-500 font-medium block mb-1">Jenis Sampah</label>
                      <select
                        value={item.wasteId}
                        onChange={(e) => handleItemChange(index, 'wasteId', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                      >
                        {wasteTypes.map((waste) => (
                          <option key={waste.id} value={waste.id}>
                            {waste.name} (Rp {waste.price.toLocaleString('id-ID')}/{waste.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Input Jumlah/Timbangan */}
                    <div className="col-span-6 md:col-span-3">
                      <label className="text-xs text-slate-500 font-medium block mb-1">
                        Berat / Jumlah ({currentWaste?.unit})
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    {/* Subtotal Otomatis */}
                    <div className="col-span-4 md:col-span-3">
                      <label className="text-xs text-slate-500 font-medium block mb-1">Subtotal (Rp)</label>
                      <div className="text-base font-bold text-slate-800 py-2">
                        Rp {subtotal.toLocaleString('id-ID')}
                      </div>
                    </div>

                    {/* Tombol Hapus */}
                    <div className="col-span-2 md:col-span-1 flex justify-end">
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          title="Hapus baris"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ringkasan & Tombol Simpan */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold">Total Nilai Tabungan Setoran</p>
              <div className="text-3xl font-extrabold text-emerald-400">
                Rp {totalRupiah.toLocaleString('id-ID')}
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 font-bold px-8 py-3.5 rounded-xl transition shadow-lg shadow-emerald-500/20 text-base"
            >
              Simpan & Tambah Saldo <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}