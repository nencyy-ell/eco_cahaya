import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Home as HomeIcon, Store, Scale, User, FileText } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo sekaligus tombol ke Home */}
        <Link to="/" className="flex items-center gap-2 text-emerald-700 font-extrabold text-lg">
          <Leaf className="w-6 h-6 text-emerald-500" />
          <span>ECO-CAHAYA</span>
        </Link>

        {/* Menu Navigasi Lengkap */}
        <nav className="flex items-center gap-1 sm:gap-2 text-sm font-semibold">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              isActive('/') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HomeIcon className="w-4 h-4" /> Beranda
          </Link>

          <Link
            to="/katalog"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              isActive('/katalog') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Store className="w-4 h-4" /> Katalog
          </Link>

          <Link
            to="/admin/setor"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              isActive('/admin/setor') ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
            }`}
          >
            <Scale className="w-4 h-4" /> Setor
          </Link>

          <Link
            to="/warga/dashboard"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              isActive('/warga/dashboard') ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4 text-blue-600" /> Warga
          </Link>

          <Link
            to="/admin/laporan"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              isActive('/admin/laporan') ? 'bg-slate-100 text-slate-800' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-600" /> Laporan
          </Link>
        </nav>
      </div>
    </header>
  );
}