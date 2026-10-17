import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/mockData';
import { MessageCircle, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';

export default function DetailProduk() {
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id)) || products[0];

  const handleBuy = () => {
    const text = encodeURIComponent(`Halo Bank Sampah Cahaya Kerja, saya ingin memesan *${product.name}*. Tolong info ongkir ke kota saya.`);
    window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link to="/katalog" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
      </Link>
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover min-h-[300px]" />
        <div className="p-8 flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-3">{product.name}</h1>
            <p className="text-2xl font-black text-emerald-600 mt-2">{product.priceRange}</p>
            <p className="text-slate-600 text-sm mt-4 leading-relaxed">{product.desc}</p>
            <div className="mt-6 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-emerald-600" /> Siap dikirim ke seluruh wilayah Indonesia</div>
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Dibuat murni oleh pengrajin Bank Sampah Situbondo</div>
            </div>
          </div>
          <button onClick={handleBuy} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20">
            <MessageCircle className="w-5 h-5" /> Beli via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}