import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

export default function Login() {
  const [role, setRole] = useState('admin');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/warga/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
        <h1 className="text-2xl font-extrabold text-slate-900">Masuk Akun</h1>
        <p className="text-slate-500 text-xs mt-1">Pilih peran untuk melanjutkan akses sistem[cite: 2]</p>
        <form onSubmit={handleLogin} className="mt-6 space-y-4 text-left">
          <div>
            <label className="text-xs font-bold text-slate-600">Peran Pengguna</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold">
              <option value="admin">Pengurus / Admin Bank Sampah</option>
              <option value="warga">Warga / Nasabah Penabung</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600">Nomor WhatsApp / ID Rekening</label>
            <input type="text" placeholder="Contoh: 08123456789 atau BSCK-001" className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" required />
          </div>
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition mt-2">
            Masuk Sekarang
          </button>
        </form>
      </div>
    </div>
  );
}