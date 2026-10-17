import React, { useMemo, useState } from "react";

const heroImage = "https://images.unsplash.com/photo-1578357078586-491adf1aa5c7?auto=format&fit=crop&w=1200&q=80";

const prices = [
  ["Botol plastik", "Kotor", "kg", 1000],
  ["Botol plastik", "Bersih", "kg", 2000],
  ["Gelas plastik", "Kotor", "kg", 1000],
  ["Gelas plastik", "Bersih", "kg", 2500],
  ["Plastik keras", "Kategori umum", "kg", 500],
  ["Buku tulis bekas", "Belum dipilah", "kg", 1500],
  ["Sampul buku / duplex", "Dipisahkan", "kg", 500],
  ["Kertas HVS", "Dipisahkan, lembar putih", "kg", 1500],
  ["Kertas buram", "Kategori umum", "kg", 800],
  ["Kardus", "KW 1", "kg", 1500],
  ["Kardus", "KW 2", "kg", 1000],
  ["Besi bekas", "Kategori umum", "kg", 1500],
  ["Omplong / kaleng bekas", "Kategori umum", "kg", 500],
  ["Botol beling bekas minuman sirup", "Per biji", "biji", 100],
  ["Botol beling kecil bekas parfum", "Kategori umum", "kg", 500],
  ["Plastik bungkus / kresek bekas", "Kategori umum", "kg", 200],
  ["Kertas koran bekas", "Masih bersih", "kg", 7000],
  ["Aluminium bekas panci", "Kategori umum", "kg", 3000],
  ["Kuningan", "Kategori umum", "kg", 25000],
  ["Tembaga", "Kategori umum", "kg", 40000],
  ["Minyak jelantah", "Kategori umum", "kg", 3000]
];

const products = [
  ["Sabun Minyak Jelantah", "Rp 5.000 / pcs", "Sabun pembersih noda minyak dan cucian dari minyak jelantah murni.", "Tersedia", "https://images.unsplash.com/photo-1607006314644-8f4705353066?auto=format&fit=crop&w=600&q=80"],
  ["Cairan Multi-Manfaat Eco-Enzyme (600 ml)", "Rp 10.000 / botol", "Fermentasi alami kulit buah dan sisa sayur organik multifungsi.", "Tersedia", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80"],
  ["Pupuk Kompos Organik (4 Kg)", "Rp 10.000 / paket", "Kompos subur dari sisa sayur dan dedaunan warga permukiman.", "Tersedia", "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80"],
  ["Tas Rajut Tali Rafia MBG 'SEDAJA'", "Rp 100.000 - Rp 150.000", "Brand tas rajut kuat dari rafia bekas tali ompreng MBG.", "Sesuai Pesanan", "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"],
  ["Bunga Hias Tas Kresek Bekas", "Rp 5.000 / kuntum", "Hiasan bunga cantik warna-warni dari daur ulang kresek.", "Tersedia", "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80"]
];

const rupiah = (n) => "Rp " + n.toLocaleString("id-ID");

function Icon({ name, size = 20 }) {
  const paths = {
    leaf: <path d="M11 20A7 7 0 0 1 4 13C4 8.5 7.5 4 12 3c4.5 0 8 4.5 8 10a7 7 0 0 1-7 7Zm0 0v-8" />,
    arrow: <path d="M5 12h14m-7-7 7 7-7 7" />,
    users: <><circle cx="9" cy="7" r="4" /><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /></>,
    scale: <path d="m16 16 3-8 3 8a3 3 0 0 1-6 0ZM2 16l3-8 3 8a3 3 0 0 1-6 0ZM7 21h10M12 3v18" />,
    wallet: <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />,
    clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
    box: <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />,
    report: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />,
    check: <path d="M20 6 9 17l-5-5" />,
    truck: <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2m10 0h2m-4 0h4a2 2 0 0 0 2-2v-5a2 2 0 0 0-.58-1.41L18 8.41A2 2 0 0 0 16.59 8H14m0 10a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm-8 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" />
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || paths.leaf}
    </svg>
  );
}

function Button({ children, onClick, variant = "primary", className = "", disabled = false }) {
  return (
    <button disabled={disabled} onClick={onClick} className={`btn btn-${variant} ${className}`}>
      {children}
    </button>
  );
}

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <Icon name="leaf" size={22} />
      </span>
      <span>
        <b>Bank Sampah</b>
        <small>Cahaya Kerja</small>
      </span>
    </div>
  );
}

function Header({ go }) {
  return (
    <header className="header">
      <Brand />
      <nav>
        <button onClick={() => go("home")}>Beranda</button>
        <button onClick={() => go("prices")}>Daftar Harga</button>
        <button onClick={() => go("products")}>Katalog Produk</button>
        <button onClick={() => go("resident")}>Portal Warga</button>
        <button onClick={() => go("admin")}>Admin</button>
      </nav>
      <Button variant="secondary" onClick={() => go("deposit")}>
        Setor Sampah
      </Button>
    </header>
  );
}

function Home({ go }) {
  const handleWA = (name, price) => {
    const text = encodeURIComponent(
      `Halo Ibu Pengurus Bank Sampah Cahaya Kerja Situbondo, saya tertarik memesan produk: *${name}* (${price}). Mohon informasi stok dan perkiraan ongkos kirim ke alamat saya. Terima kasih!`
    );
    window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
  };

  return (
    <div>
      <Header go={go} />
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-copy">
            <span className="kicker">
              <Icon name="leaf" size={16} /> Dari warga, untuk lingkungan
            </span>
            <h1>
              Pilah sampah hari ini, <br />
              <em>tumbuhkan nilai untuk esok.</em>
            </h1>
            <p>
              Sampah kering yang sudah dipilah dapat disetorkan, ditimbang, lalu nilainya dicatat sebagai tabungan warga secara transparan.
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Button onClick={() => go("products")}>Beli Karya Daur Ulang</Button>
              <Button variant="secondary" onClick={() => go("prices")}>
                Lihat Harga Sampah
              </Button>
            </div>
          </div>
          <div className="hero-visual">
            <img src={heroImage} alt="Kegiatan pemilahan sampah" />
            <div className="floating-card">
              <span className="round-icon">
                <Icon name="scale" />
              </span>
              <div>
                <b style={{ display: "block", fontSize: "14px" }}>50 - 100 Kg</b>
                <small style={{ color: "var(--muted)", fontSize: "12px" }}>Terkumpul setiap bulan</small>
              </div>
            </div>
          </div>
        </section>

        {/* Banner Promosi Nasional: Dari Ujung Barat ke Timur Indonesia */}
        <section style={{ maxWidth: "1300px", margin: "0 auto 30px", padding: "0 32px" }}>
          <div style={{
            background: "linear-gradient(135deg, #153f32 0%, #246348 100%)",
            color: "white",
            padding: "36px 40px",
            borderRadius: "28px",
            display: "grid",
            gridTemplateColumns: "1.4fr 0.6fr",
            gap: "24px",
            alignItems: "center"
          }}>
            <div>
              <span style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.15)",
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "600",
                marginBottom: "14px"
              }}>
                <Icon name="truck" size={16} /> Pengiriman ke Seluruh Nusantara
              </span>
              <h2 style={{ fontSize: "28px", margin: "0 0 10px", color: "white" }}>
                Karya Daur Ulang Ibu-Ibu Situbondo Siap Menembus Seluruh Indonesia
              </h2>
              <p style={{ color: "#d2e4db", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
                Dari tas rajut tali rafia MBG "SEDAJA", eco-enzyme, pupuk kompos, hingga sabun minyak jelantah. Pesan langsung untuk pengiriman dari ujung barat (Aceh) hingga ujung timur (Papua)!
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <Button variant="secondary" onClick={() => go("products")}>
                Buka Etalase Nasional <Icon name="arrow" size={16} />
              </Button>
            </div>
          </div>
        </section>

        {/* Etalase Produk Langsung di Beranda */}
        <section className="section" style={{ paddingTop: "40px" }}>
          <div className="section-head">
            <span className="kicker">Karya Olahan Daur Ulang</span>
            <h2>Produk Unggulan Bank Sampah</h2>
            <p>Dibuat teliti oleh emak-emak pengurus dan warga nasabah Bank Sampah Cahaya Kerja.</p>
          </div>
          <div className="products-grid">
            {products.slice(0, 3).map((item, idx) => (
              <div key={idx} className="product-card">
                <div className="img-box">
                  <img src={item[4]} alt={item[0]} />
                </div>
                <div className="content">
                  <div>
                    <span className="kicker" style={{ fontSize: "10px" }}>{item[3]}</span>
                    <h3>{item[0]}</h3>
                    <p>{item[2]}</p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                    <span className="price">{item[1]}</span>
                    <Button variant="primary" onClick={() => handleWA(item[0], item[1])}>
                      Pesan via WA
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "36px" }}>
            <Button variant="secondary" onClick={() => go("products")}>
              Lihat Semua 5 Produk Kreatif Lainnya
            </Button>
          </div>
        </section>

        {/* 4 Langkah Menjadi Bernilai */}
        <section className="section" style={{ background: "white" }}>
          <div className="section-head">
            <span className="kicker">Mulai dari Rumah</span>
            <h2>4 Langkah Menjadi Bernilai</h2>
            <p>Membantu kebersihan lingkungan sekaligus membangun tabungan masa depan.</p>
          </div>
          <div className="steps">
            <div className="step">
              <span className="num">01</span>
              <h3>Pilah dari Rumah</h3>
              <p>Pisahkan sampah basah dapur dan sampah kering sesuai kategorinya.</p>
            </div>
            <div className="step">
              <span className="num">02</span>
              <h3>Setor & Timbang</h3>
              <p>Bawa setoran langsung ke bank sampah atau gunakan layanan jemput.</p>
            </div>
            <div className="step">
              <span className="num">03</span>
              <h3>Catat Otomatis</h3>
              <p>Petugas mencatat timbangan di sistem, saldo bertambah seketika.</p>
            </div>
            <div className="step">
              <span className="num">04</span>
              <h3>Tukar Manfaat</h3>
              <p>Cairkan tabungan menjadi sembako atau tabungan emas Pegadaian.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Prices({ go }) {
  const [q, setQ] = useState("");
  const filtered = prices.filter((p) => p[0].toLowerCase().includes(q.toLowerCase()) || p[1].toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <Header go={go} />
      <div className="section">
        <div className="section-head">
          <span className="kicker">Daftar Harga Transparan</span>
          <h2>Katalog Harga Sampah</h2>
          <p>Harga menyesuaikan ketetapan pengepul resmi.</p>
        </div>
        <div className="form-panel" style={{ maxWidth: "500px", margin: "0 auto 30px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Icon name="search" />
            <input
              type="text"
              placeholder="Cari jenis sampah (misal: botol, kardus)..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ width: "100%", border: 0, outline: "none" }}
            />
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Jenis Sampah</th>
                <th>Kondisi / Keterangan</th>
                <th>Satuan</th>
                <th>Harga Beli</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, idx) => (
                <tr key={idx}>
                  <td><b>{item[0]}</b></td>
                  <td>{item[1]}</td>
                  <td>{item[2]}</td>
                  <td><b style={{ color: "var(--green)" }}>{rupiah(item[3])}</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Products({ go }) {
  const handleWA = (name, price) => {
    const text = encodeURIComponent(`Halo Bank Sampah Cahaya Kerja Situbondo, saya tertarik memesan produk kreatif: *${name}* (${price}). Mohon info ongkir dan ketersediaan stoknya.`);
    window.open(`https://wa.me/6281234567890?text=${text}`, "_blank");
  };

  return (
    <div>
      <Header go={go} />
      <div className="section">
        <div className="section-head">
          <span className="kicker">Galeri Nasional Produk Kreatif</span>
          <h2>Karya Olahan Daur Ulang Situbondo</h2>
          <p>Dapat dikirim dari Sabang sampai Merauke langsung ke alamat Anda.</p>
        </div>
        <div className="products-grid">
          {products.map((item, idx) => (
            <div key={idx} className="product-card">
              <div className="img-box">
                <img src={item[4]} alt={item[0]} />
              </div>
              <div className="content">
                <div>
                  <span className="kicker" style={{ fontSize: "10px" }}>{item[3]}</span>
                  <h3>{item[0]}</h3>
                  <p>{item[2]}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                  <span className="price">{item[1]}</span>
                  <Button variant="primary" onClick={() => handleWA(item[0], item[1])}>
                    Pesan via WA
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Resident({ go }) {
  return (
    <div>
      <Header go={go} />
      <div className="section" style={{ maxWidth: "800px" }}>
        <div className="form-panel" style={{ background: "var(--forest)", color: "white" }}>
          <span style={{ fontSize: "12px", opacity: 0.8 }}>PORTAL NASABAH WARGA</span>
          <h2 style={{ fontSize: "28px", margin: "10px 0" }}>Ibu Siti Aminah (BSCK-001)</h2>
          <div style={{ fontSize: "36px", fontWeight: "bold", margin: "14px 0", color: "var(--leaf)" }}>
            Rp 45.000
          </div>
          <p style={{ fontSize: "13px", opacity: 0.8 }}>
            Saldo tabungan aktif dapat dicairkan untuk belanja sembako di warung atau dialihkan ke tabungan emas Pegadaian bila mencapai Rp 50.000[cite: 1, 2].
          </p>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Setoran Sampah</th>
                <th>Berat</th>
                <th>Nominal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>14 Okt 2026</td>
                <td>Botol Plastik Bersih[cite: 1, 2]</td>
                <td>4 kg</td>
                <td>+Rp 8.000</td>
              </tr>
              <tr>
                <td>02 Okt 2026</td>
                <td>Minyak Jelantah[cite: 1, 2]</td>
                <td>3 kg</td>
                <td>+Rp 9.000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function AdminShell({ page, go, children }) {
  const sideItems = [
    ["report", "Dashboard", "admin"],
    ["scale", "Setor Sampah", "deposit"],
    ["box", "Daftar Harga", "prices"],
    ["wallet", "Produk", "products"]
  ];

  return (
    <div className="admin-shell">
      <aside>
        <Brand />
        <div style={{ marginTop: "36px" }}>
          {sideItems.map(([ic, label, target]) => (
            <button
              key={target}
              onClick={() => go(target)}
              className={`admin-nav-item ${page === target ? "active" : ""}`}
            >
              <Icon name={ic} size={18} /> {label}
            </button>
          ))}
        </div>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}

function Admin({ go }) {
  return (
    <AdminShell page="admin" go={go}>
      <h1 style={{ fontSize: "28px", color: "var(--forest)", marginBottom: "20px" }}>Dashboard Pengurus</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
        <div className="form-panel">
          <span className="kicker">Total Sampah Terkumpul</span>
          <h2 style={{ fontSize: "32px", color: "var(--forest)", marginTop: "8px" }}>87.5 Kg</h2>
          <small style={{ color: "var(--muted)" }}>Bulan Oktober 2026[cite: 1, 2]</small>
        </div>
        <div className="form-panel">
          <span className="kicker">Nasabah Aktif</span>
          <h2 style={{ fontSize: "32px", color: "var(--forest)", marginTop: "8px" }}>42 Warga</h2>
          <small style={{ color: "var(--muted)" }}>Terdaftar resmi[cite: 1, 2]</small>
        </div>
        <div className="form-panel">
          <span className="kicker">Batch Emas Pegadaian</span>
          <h2 style={{ fontSize: "32px", color: "var(--amber)", marginTop: "8px" }}>6 Berkas</h2>
          <small style={{ color: "var(--muted)" }}>Siap disetor ke Situbondo[cite: 1, 2]</small>
        </div>
      </div>
      <Button onClick={() => go("deposit")}>+ Catat Setoran Baru</Button>
    </AdminShell>
  );
}

function Deposit({ go }) {
  const [step, setStep] = useState(1);
  const [qty, setQty] = useState(2.5);
  const [wasteIdx, setWasteIdx] = useState(0);

  const selectedWaste = prices[wasteIdx];
  const total = selectedWaste[3] * qty;

  return (
    <AdminShell page="deposit" go={go}>
      <div style={{ maxWidth: "600px" }}>
        <h1 style={{ fontSize: "28px", color: "var(--forest)", marginBottom: "20px" }}>Formulir Setor Sampah</h1>
        
        {step === 1 && (
          <div className="form-panel">
            <h3 style={{ marginBottom: "16px" }}>Pilih Jenis Sampah & Masukkan Timbangan</h3>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "6px", color: "var(--muted)" }}>Jenis Sampah</label>
              <select
                value={wasteIdx}
                onChange={(e) => setWasteIdx(parseInt(e.target.value))}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--line)" }}
              >
                {prices.map((p, idx) => (
                  <option key={idx} value={idx}>{p[0]} - {p[1]} ({rupiah(p[3])}/{p[2]})[cite: 1, 2]</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "6px", color: "var(--muted)" }}>Berat / Timbangan ({selectedWaste[2]})</label>
              <input
                type="number"
                step="0.1"
                value={qty}
                onChange={(e) => setQty(parseFloat(e.target.value) || 0)}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--line)" }}
              />
            </div>
            <div style={{ padding: "16px", background: "var(--paper)", borderRadius: "12px", marginBottom: "20px" }}>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>Total Tabungan Setoran:</span>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--green)" }}>{rupiah(total)}</div>
            </div>
            <Button onClick={() => setStep(2)}>Lanjut Konfirmasi</Button>
          </div>
        )}

        {step === 2 && (
          <div className="form-panel" style={{ textAlign: "center" }}>
            <div style={{ width: "60px", height: "60px", background: "#eef7f0", color: "var(--green)", borderRadius: "50%", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
              <Icon name="check" size={32} />
            </div>
            <h2>Setoran Berhasil Dicatat!</h2>
            <p style={{ color: "var(--muted)", margin: "10px 0 24px" }}>
              Saldo nasabah telah berhasil ditambah sebesar <b>{rupiah(total)}</b>.
            </p>
            <Button onClick={() => setStep(1)}>Input Setoran Lain</Button>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <Brand />
          <p style={{ marginTop: "16px" }}>
            Mewujudkan zero waste permukiman melalui pembiasaan pilah sampah rumah tangga dan pemberdayaan ekonomi sirkular warga Situbondo[cite: 1, 2].
          </p>
        </div>
        <div>
          <h4 style={{ color: "white", marginBottom: "14px" }}>Alamat & Lokasi</h4>
          <p>Bank Sampah Cahaya Kerja<br />Kabupaten Situbondo, Jawa Timur[cite: 1, 2]</p>
        </div>
        <div>
          <h4 style={{ color: "white", marginBottom: "14px" }}>Kemitraan</h4>
          <p>Dinas Lingkungan Hidup (DLH)<br />Pegadaian Situbondo[cite: 1, 2]</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 ECO-CAHAYA. Hak cipta dilindungi.</span>
        <span>UINIC 8.0 Web Development[cite: 4]</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState("home");

  const go = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return useMemo(() => {
    if (page === "home") return <Home go={go} />;
    if (page === "admin") return <Admin go={go} />;
    if (page === "deposit") return <Deposit go={go} />;
    if (page === "prices") return <Prices go={go} />;
    if (page === "products") return <Products go={go} />;
    if (page === "resident") return <Resident go={go} />;
    return <Home go={go} />;
  }, [page]);
}