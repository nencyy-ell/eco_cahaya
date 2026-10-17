import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Katalog from './pages/Katalog';
import DetailProduk from './pages/DetailProduk';
import Login from './pages/Login';
import DashboardWarga from './pages/DashboardWarga';
import TukarSaldo from './pages/TukarSaldo';
import DashboardAdmin from './pages/DashboardAdmin';
import SetorSampah from './pages/SetorSampah';
import LaporanDLH from './pages/LaporanDLH';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col justify-between">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/katalog" element={<Katalog />} />
            <Route path="/katalog/:id" element={<DetailProduk />} />
            <Route path="/login" element={<Login />} />
            <Route path="/warga/dashboard" element={<DashboardWarga />} />
            <Route path="/warga/tukar-saldo" element={<TukarSaldo />} />
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />
            <Route path="/admin/setor" element={<SetorSampah />} />
            <Route path="/admin/laporan" element={<LaporanDLH />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}