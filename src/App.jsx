import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import SetorSampah from './pages/SetorSampah';
import { Leaf, Scale, Store } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-emerald-700 font-extrabold text-lg">
              <Leaf className="w-6 h-6 text-emerald-500" />
              <span>ECO-CAHAYA</span>
            </Link>

            <nav className="flex items-center gap-2 sm:gap-4 text-sm font-semibold">
              <Link to="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700">
                <Store className="w-4 h-4 text-emerald-600" /> Etalase Produk
              </Link>
              <Link to="/setor" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                <Scale className="w-4 h-4" /> Form Setor
              </Link>
            </nav>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setor" element={<SetorSampah />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}