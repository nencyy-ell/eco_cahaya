import React from 'react';
import { products } from '../data/mockData';
import { ShoppingBag, Truck, Award, ShieldCheck, Heart, ArrowUpRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const adminWhatsApp = "6281234567890"; // Ganti dengan nomor WhatsApp pengurus bank sampah

  const handleBuyWhatsApp = (productName, price) => {
    const text = encodeURIComponent(
      `Halo Ibu Pengurus Bank Sampah Cahaya Kerja, saya tertarik membeli produk karya kreatif: *${productName}* seharga Rp ${price.toLocaleString('id-ID')}. Mohon info ongkir dan ketersediaan stoknya untuk pengiriman ke alamat saya. Terima kasih!`
    );
    window.open(`https://wa.me/${adminWhatsApp}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section: Promosi Seluruh Indonesia */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-4 py-1.5 rounded-full text-xs font-semibold text-emerald-200">
            <Truck className="w-4 h-4" /> Pengiriman Karya Kreatif ke Seluruh Pelosok Nusantara
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight">
            Dari Tangan Ibu-Ibu Situbondo, <br className="hidden sm:inline" />
            <span className="text-emerald-300">Menjaga Bumi Menembus Nusantara</span>
          </h1>

          <p className="text-slate-200 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Setiap produk yang Anda beli bukan sekadar daur ulang limbah, melainkan denyut kemandirian ekonomi keluarga dan ikhtiar bersama menuju <em>Zero Waste Permukiman</em>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#katalog"
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold px-7 py-3.5 rounded-xl transition shadow-lg shadow-emerald-400/20 flex items-center gap-2"
            >
              Lihat Galeri Produk <ArrowUpRight className="w-5 h-5" />
            </a>
            <Link
              to="/setor"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl transition"
            >
              Menu Setor Sampah (Admin)
            </Link>
          </div>
        </div>
      </section>

      {/* Nilai Tambah & Dampak */}
      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">100% Karya Daur Ulang</h3>
            <p className="text-sm text-slate-500 mt-1">Dibuat teliti dari tali rafia ompreng MBG, minyak jelantah, dan sisa sayur organik.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Kirim dari Ujung ke Ujung</h3>
            <p className="text-sm text-slate-500 mt-1">Siap dikirim ke seluruh provinsi di Indonesia dengan pengemasan aman dan ramah lingkungan.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Pemberdayaan Komunitas</h3>
            <p className="text-sm text-slate-500 mt-1">Membantu tabungan emas dan sembako para nasabah Bank Sampah Cahaya Kerja.</p>
          </div>
        </div>
      </section>

      {/* Galeri Produk Nasional */}
      <section id="katalog" className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider">Etalase Karya Lokal</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">Katalog Produk Kreatif Ramah Lingkungan</h2>
          <p className="text-slate-500 text-sm mt-2">Pilih produk favorit Anda dan hubungi pengurus kami langsung melalui WhatsApp untuk pemesanan.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
              <div className="h-48 overflow-hidden relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                  {item.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{item.name}</h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{item.desc}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Harga</span>
                    <span className="text-base font-extrabold text-emerald-600">{item.priceRange}</span>
                  </div>

                  <button
                    onClick={() => handleBuyWhatsApp(item.name, item.price)}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition"
                  >
                    <MessageCircle className="w-4 h-4" /> Pesan via WA
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}