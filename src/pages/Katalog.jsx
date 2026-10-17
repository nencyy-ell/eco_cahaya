import React from 'react';
import { products } from '../data/mockData';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Katalog() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Galeri Produk Daur Ulang</h1>
        <p className="text-slate-500 text-sm mt-1">
          Karya kreatif ramah lingkungan dari nasabah Bank Sampah Cahaya Kerja Situbondo.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
            <img 
              src={item.image} 
              alt={item.name} 
              className="h-48 w-full object-cover" 
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80";
              }}
            />
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-600">{item.category}</span>
                <h3 className="font-bold text-slate-900 mt-1">{item.name}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{item.desc}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="font-extrabold text-emerald-600">{item.priceRange}</span>
                <Link to={`/katalog/${item.id}`} className="text-xs font-bold text-slate-700 hover:text-emerald-600 flex items-center gap-1">
                  Detail <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}