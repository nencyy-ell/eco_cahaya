import React, { useMemo, useState } from "react";
import AIChatBot from "./components/AIChatBot";

const heroImage = "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80";
const CONTACT_WA = "6282143637980";

const initialPrices = [
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

const initialProducts = [
  [
    "Sabun Minyak Jelantah",
    "Rp 5.000 / pcs",
    "Sabun pembersih noda minyak dan cucian dari minyak jelantah murni.",
    "Tersedia",
    "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=600&q=80"
  ],
  [
    "Cairan Multi-Manfaat Eco-Enzyme (600 ml)",
    "Rp 10.000 / botol",
    "Fermentasi alami kulit buah dan sisa sayur organik multifungsi.",
    "Tersedia",
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80"
  ],
  [
    "Pupuk Kompos Organik (4 Kg)",
    "Rp 10.000 / paket",
    "Kompos subur dari sisa sayur dan dedaunan warga permukiman.",
    "Tersedia",
    "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80"
  ],
  [
    "Tas Rajut Tali Rafia MBG 'SEDAJA'",
    "Rp 100.000 - Rp 150.000",
    "Brand tas rajut kuat dari rafia bekas tali ompreng MBG.",
    "Sesuai Pesanan",
    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
  ],
  [
    "Bunga Hias Tas Kresek Bekas",
    "Rp 5.000 / kuntum",
    "Hiasan bunga cantik warna-warni dari daur ulang kresek.",
    "Tersedia",
    "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=600&q=80"
  ]
];

const initialDepositHistory = [
  { date: "14 Okt 2026", name: "Ibu Siti Aminah", item: "Botol Plastik Bersih", weight: "4 kg", nominal: 8000 },
  { date: "02 Okt 2026", name: "Ibu Siti Aminah", item: "Minyak Jelantah", weight: "3 kg", nominal: 9000 }
];

const rupiah = (n) => "Rp " + n.toLocaleString("id-ID");

function Icon({ name, size = 20 }) {
  const paths = {
    arrow: <path d="M5 12h14m-7-7 7 7-7 7" />,
    check: <path d="M20 6 9 17l-5-5" />,
    user: <><circle cx="12" cy="7" r="4" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></>,
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
    edit: <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />,
    trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
    plus: <path d="M12 5v14M5 12h14" />
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || null}
    </svg>
  );
}

function Button({ children, onClick, variant = "primary", className = "", disabled = false, type = "button", style = {} }) {
  return (
    <button type={type} disabled={disabled} onClick={onClick} style={style} className={`btn btn-${variant} ${className}`}>
      {children}
    </button>
  );
}

function Brand() {
  return (
    <div className="brand" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <img
        src="/logoclean.png"
        alt="Logo ECO-CAHAYA"
        style={{
          width: "42px",
          height: "42px",
          objectFit: "contain",
          background: "transparent"
        }}
        onError={(e) => {
          e.target.src = "/logoclean.png";
        }}
      />
      <span>
        <b style={{ fontFamily: "Marcellus, serif", fontSize: "18px", color: "var(--forest)" }}>ECO-CAHAYA</b>
        <small style={{ display: "block", fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>
          Bank Sampah Cahaya Kerja
        </small>
      </span>
    </div>
  );
}

function Header({ go, currentUser, logout }) {
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
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {currentUser ? (
          <button
            onClick={logout}
            style={{
              background: "#f0f4f1",
              border: "1px solid var(--line)",
              padding: "8px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "600",
              color: "var(--forest)",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
            title="Klik untuk keluar / ganti akun"
          >
            <Icon name="user" size={14} />
            <span>{currentUser.name} ({currentUser.role === "admin" ? "Pengurus" : "Warga"})</span>
          </button>
        ) : null}
        <Button variant="secondary" onClick={() => go("deposit")}>
          Setor Sampah
        </Button>
      </div>
    </header>
  );
}

function LoginPage({ go, targetPage, onLoginSuccess }) {
  const isResidentPortal = targetPage === "resident";
  const fixedRole = isResidentPortal ? "warga" : "admin";
  const [name, setName] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onLoginSuccess({
      name: name.trim(),
      role: fixedRole
    });
    go(targetPage);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <header className="header">
        <Brand />
        <Button variant="ghost" onClick={() => go("home")}>← Kembali ke Beranda</Button>
      </header>

      <div style={{ maxWidth: "440px", margin: "40px auto", padding: "0 20px", width: "100%" }}>
        <div className="form-panel" style={{ textAlign: "center", padding: "36px 28px" }}>
          <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#eef6f0", color: "var(--forest)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
            <Icon name="user" size={26} />
          </div>

          <h2 style={{ fontSize: "24px", color: "var(--forest)", marginBottom: "6px" }}>
            {isResidentPortal ? "Masuk Portal Warga" : "Masuk Area Pengurus"}
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "24px" }}>
            {isResidentPortal
              ? "Masukkan nama Anda untuk melihat buku tabungan dan saldo sampah."
              : "Masukkan nama petugas pengurus untuk memulai pencatatan dan pengelolaan."}
          </p>

          <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--forest)" }}>
                Akses Sebagai
              </label>
              <div style={{
                padding: "12px 14px",
                background: "#f4f6f4",
                border: "1px solid var(--line)",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--forest)"
              }}>
                {isResidentPortal ? "Warga / Nasabah Penabung" : "Pengurus / Admin Bank Sampah"}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--forest)" }}>
                {isResidentPortal ? "Nama Lengkap Warga" : "Nama Petugas Pengurus"}
              </label>
              <input
                type="text"
                placeholder={isResidentPortal ? "Contoh: Ibu Siti Aminah" : "Contoh: Khalifatul"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--line)" }}
              />
            </div>

            <Button type="submit" variant="primary" style={{ width: "100%", padding: "14px" }}>
              Masuk Sekarang
            </Button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function Home({ go, currentUser, logout, products }) {
  const handleWA = (name, price) => {
    const text = encodeURIComponent(
      `Halo Ibu Pengurus Bank Sampah Cahaya Kerja Situbondo, saya tertarik memesan produk: *${name}* (${price}). Mohon informasi stok dan perkiraan ongkos kirim ke alamat saya. Terima kasih!`
    );
    window.open(`https://wa.me/${CONTACT_WA}?text=${text}`, "_blank");
  };

  return (
    <div>
      <Header go={go} currentUser={currentUser} logout={logout} />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="kicker">Dari warga, untuk lingkungan</span>
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
            <img
              src={heroImage}
              alt="Kegiatan pemilahan sampah"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80";
              }}
            />
            <div className="floating-card">
              <div>
                <b style={{ display: "block", fontSize: "16px", color: "var(--forest)" }}>50 – 100 Kg</b>
                <small style={{ color: "var(--muted)", fontSize: "12px" }}>Terkumpul setiap bulan</small>
              </div>
            </div>
          </div>
        </section>

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
                display: "inline-block",
                background: "rgba(255,255,255,0.15)",
                padding: "6px 14px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: "600",
                marginBottom: "14px"
              }}>
                Pengiriman ke Seluruh Nusantara
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
                Buka Etalase <Icon name="arrow" size={16} />
              </Button>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "40px" }}>
          <div className="section-head">
            <span className="kicker">Karya Olahan Daur Ulang</span>
            <h2>Produk Unggulan Bank Sampah</h2>
            <p>Dibuat teliti oleh pengurus dan warga nasabah Bank Sampah Cahaya Kerja.</p>
          </div>
          <div className="products-grid">
            {products.slice(0, 3).map((item, idx) => (
              <div key={idx} className="product-card">
                <div className="img-box">
                  <img
                    src={item[4]}
                    alt={item[0]}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80";
                    }}
                  />
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
              Lihat Semua Produk Kreatif Lainnya
            </Button>
          </div>
        </section>

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

function PriceTableView({ prices, setPrices, isAdmin = false }) {
  const [q, setQ] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [name, setName] = useState("");
  const [condition, setCondition] = useState("");
  const [unit, setUnit] = useState("kg");
  const [price, setPrice] = useState("");

  const filtered = prices.filter((p) => p[0].toLowerCase().includes(q.toLowerCase()) || p[1].toLowerCase().includes(q.toLowerCase()));

  const handleOpenAdd = () => {
    setEditIndex(null);
    setName("");
    setCondition("Bersih");
    setUnit("kg");
    setPrice("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (originalIndex) => {
    const item = prices[originalIndex];
    setEditIndex(originalIndex);
    setName(item[0]);
    setCondition(item[1]);
    setUnit(item[2]);
    setPrice(item[3]);
    setIsModalOpen(true);
  };

  const handleDelete = (originalIndex) => {
    if (window.confirm(`Yakin ingin menghapus ${prices[originalIndex][0]}?`)) {
      const updated = [...prices];
      updated.splice(originalIndex, 1);
      setPrices(updated);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newItem = [name.trim(), condition.trim(), unit.trim(), parseFloat(price) || 0];

    if (editIndex !== null) {
      const updated = [...prices];
      updated[editIndex] = newItem;
      setPrices(updated);
    } else {
      setPrices([newItem, ...prices]);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="section-head" style={{ marginBottom: "30px" }}>
        <span className="kicker">Daftar Harga Transparan</span>
        <h2>Katalog Harga Sampah</h2>
        <p>Harga menyesuaikan ketetapan pengepul resmi.</p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
        <div className="form-panel" style={{ margin: 0, padding: "12px 18px", flex: "1 1 300px" }}>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <Icon name="search" />
            <input
              type="text"
              placeholder="Cari jenis sampah (misal: botol, kardus)..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ width: "100%", border: 0, outline: "none", fontSize: "14px" }}
            />
          </div>
        </div>

        {isAdmin && (
          <Button variant="primary" onClick={handleOpenAdd} style={{ padding: "12px 20px" }}>
            <Icon name="plus" size={16} /> Tambah Jenis Sampah
          </Button>
        )}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Jenis Sampah</th>
              <th>Kondisi / Keterangan</th>
              <th>Satuan</th>
              <th>Harga Beli</th>
              {isAdmin && <th style={{ textAlign: "right" }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => {
              const originalIndex = prices.findIndex((p) => p === item);
              return (
                <tr key={idx}>
                  <td><b>{item[0]}</b></td>
                  <td>{item[1]}</td>
                  <td>{item[2]}</td>
                  <td><b style={{ color: "var(--green)" }}>{rupiah(item[3])}</b></td>
                  {isAdmin && (
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <button
                          onClick={() => handleOpenEdit(originalIndex)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            border: "1px solid var(--line)",
                            background: "white",
                            color: "var(--forest)",
                            fontSize: "12px",
                            fontWeight: "600",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <Icon name="edit" size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(originalIndex)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "8px",
                            border: "1px solid #fed7d7",
                            background: "#fff5f5",
                            color: "#c53030",
                            fontSize: "12px",
                            fontWeight: "600",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <Icon name="trash" size={14} /> Hapus
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "grid",
          placeItems: "center",
          zIndex: 10000,
          padding: "20px"
        }}>
          <div className="form-panel" style={{ maxWidth: "480px", width: "100%", padding: "30px", position: "relative" }}>
            <h3 style={{ fontSize: "20px", color: "var(--forest)", marginBottom: "16px" }}>
              {editIndex !== null ? "Edit Jenis Sampah" : "Tambah Jenis Sampah Baru"}
            </h3>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px", color: "var(--muted)" }}>
                  Nama Jenis Sampah
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Botol Plastik"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px", color: "var(--muted)" }}>
                  Kondisi / Keterangan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Bersih / Kotor / KW 1"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px", color: "var(--muted)" }}>
                    Satuan
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "white" }}
                  >
                    <option value="kg">kg (Kilogram)</option>
                    <option value="biji">biji (Per Buah / Satuan)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px", color: "var(--muted)" }}>
                    Harga Beli (Rp)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Contoh: 2500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "16px" }}>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
                <Button type="submit" variant="primary">Simpan Data</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function ProductGridView({ products, setProducts, isAdmin = false }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [title, setTitle] = useState("");
  const [priceTag, setPriceTag] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("Tersedia");
  const [image, setImage] = useState("");

  const handleWA = (name, price) => {
    const text = encodeURIComponent(`Halo Bank Sampah Cahaya Kerja Situbondo, saya tertarik memesan produk kreatif: *${name}* (${price}). Mohon info ongkir dan ketersediaan stoknya.`);
    window.open(`https://wa.me/${CONTACT_WA}?text=${text}`, "_blank");
  };

  const handleOpenAdd = () => {
    setEditIndex(null);
    setTitle("");
    setPriceTag("Rp 10.000 / pcs");
    setDesc("");
    setStatus("Tersedia");
    setImage("https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (index) => {
    const item = products[index];
    setEditIndex(index);
    setTitle(item[0]);
    setPriceTag(item[1]);
    setDesc(item[2]);
    setStatus(item[3]);
    setImage(item[4]);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    if (window.confirm(`Hapus produk "${products[index][0]}"?`)) {
      const updated = [...products];
      updated.splice(index, 1);
      setProducts(updated);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const newItem = [title.trim(), priceTag.trim(), desc.trim(), status.trim(), image.trim()];

    if (editIndex !== null) {
      const updated = [...products];
      updated[editIndex] = newItem;
      setProducts(updated);
    } else {
      setProducts([newItem, ...products]);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="section-head" style={{ marginBottom: "24px" }}>
        <span className="kicker">Galeri Nasional Produk Kreatif</span>
        <h2>Karya Olahan Daur Ulang Situbondo</h2>
        <p>Dapat dikirim dari Sabang sampai Merauke langsung ke alamat Anda.</p>
      </div>

      {isAdmin && (
        <div style={{ textAlign: "right", marginBottom: "24px" }}>
          <Button variant="primary" onClick={handleOpenAdd}>
            <Icon name="plus" size={16} /> Tambah Produk Baru
          </Button>
        </div>
      )}

      <div className="products-grid">
        {products.map((item, idx) => (
          <div key={idx} className="product-card">
            <div className="img-box">
              <img
                src={item[4]}
                alt={item[0]}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80";
                }}
              />
            </div>
            <div className="content">
              <div>
                <span className="kicker" style={{ fontSize: "10px" }}>{item[3]}</span>
                <h3>{item[0]}</h3>
                <p>{item[2]}</p>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line)", paddingTop: "14px", marginBottom: isAdmin ? "10px" : "0" }}>
                  <span className="price">{item[1]}</span>
                  {!isAdmin && (
                    <Button variant="primary" onClick={() => handleWA(item[0], item[1])}>
                      Pesan via WA
                    </Button>
                  )}
                </div>

                {isAdmin && (
                  <div style={{ display: "flex", gap: "8px", borderTop: "1px solid var(--line)", paddingTop: "10px", justifyContent: "flex-end" }}>
                    <button
                      onClick={() => handleOpenEdit(idx)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        border: "1px solid var(--line)",
                        background: "white",
                        color: "var(--forest)",
                        fontSize: "12px",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <Icon name="edit" size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(idx)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        border: "1px solid #fed7d7",
                        background: "#fff5f5",
                        color: "#c53030",
                        fontSize: "12px",
                        fontWeight: "600",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <Icon name="trash" size={14} /> Hapus
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "grid",
          placeItems: "center",
          zIndex: 10000,
          padding: "20px"
        }}>
          <div className="form-panel" style={{ maxWidth: "520px", width: "100%", padding: "30px", position: "relative" }}>
            <h3 style={{ fontSize: "20px", color: "var(--forest)", marginBottom: "16px" }}>
              {editIndex !== null ? "Edit Produk Kriya" : "Tambah Produk Kriya Baru"}
            </h3>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px", color: "var(--muted)" }}>
                  Nama Produk
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Sabun Minyak Jelantah"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px", color: "var(--muted)" }}>
                    Label Harga
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rp 10.000 / botol"
                    value={priceTag}
                    onChange={(e) => setPriceTag(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px", color: "var(--muted)" }}>
                    Status Ketersediaan
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "white" }}
                  >
                    <option value="Tersedia">Tersedia</option>
                    <option value="Sesuai Pesanan">Sesuai Pesanan</option>
                    <option value="Habis">Habis</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px", color: "var(--muted)" }}>
                  URL Foto Produk
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px", color: "var(--muted)" }}>
                  Deskripsi Produk
                </label>
                <textarea
                  required
                  rows="3"
                  placeholder="Ceritakan bahan olahan dan manfaat produk..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", fontFamily: "inherit", resize: "none" }}
                ></textarea>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "16px" }}>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
                <Button type="submit" variant="primary">Simpan Produk</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Prices({ go, currentUser, logout, prices, setPrices }) {
  return (
    <div>
      <Header go={go} currentUser={currentUser} logout={logout} />
      <div className="section">
        <PriceTableView prices={prices} setPrices={setPrices} isAdmin={false} />
      </div>
      <Footer />
    </div>
  );
}

function Products({ go, currentUser, logout, products, setProducts }) {
  return (
    <div>
      <Header go={go} currentUser={currentUser} logout={logout} />
      <div className="section">
        <ProductGridView products={products} setProducts={setProducts} isAdmin={false} />
      </div>
      <Footer />
    </div>
  );
}

function Resident({ go, currentUser, logout, depositHistory }) {
  const currentResidentName = currentUser?.name || "Ibu Siti Aminah";
  const userDeposits = depositHistory.filter(
    (d) => d.name.toLowerCase() === currentResidentName.toLowerCase()
  );
  const totalUserBalance = userDeposits.reduce((sum, d) => sum + d.nominal, 0) || 45000;

  return (
    <div>
      <Header go={go} currentUser={currentUser} logout={logout} />
      <div className="section" style={{ maxWidth: "800px" }}>
        <div className="form-panel" style={{ background: "var(--forest)", color: "white" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", opacity: 0.8 }}>PORTAL NASABAH WARGA</span>
            <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.15)", padding: "4px 10px", borderRadius: "999px" }}>
              Tercatat Aktif
            </span>
          </div>
          <h2 style={{ fontSize: "28px", margin: "10px 0" }}>
            {currentResidentName}
          </h2>
          <div style={{ fontSize: "36px", fontWeight: "bold", margin: "14px 0", color: "var(--leaf)" }}>
            {rupiah(totalUserBalance)}
          </div>
          <p style={{ fontSize: "13px", opacity: 0.8 }}>
            Saldo tabungan aktif dapat dicairkan untuk belanja sembako di warung atau dialihkan ke tabungan emas Pegadaian bila mencapai Rp 50.000.
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
              {userDeposits.length > 0 ? (
                userDeposits.map((d, idx) => (
                  <tr key={idx}>
                    <td>{d.date}</td>
                    <td>{d.item}</td>
                    <td>{d.weight}</td>
                    <td><b style={{ color: "var(--green)" }}>+{rupiah(d.nominal)}</b></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>
                    Belum ada riwayat setoran tercatat untuk akun ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function AdminShell({ page, go, currentUser, children }) {
  const sideItems = [
    ["Dashboard", "admin"],
    ["Setor Sampah", "deposit"],
    ["Daftar Harga", "admin_prices"],
    ["Produk", "admin_products"]
  ];

  return (
    <div className="admin-shell">
      <aside>
        <Brand />
        <div style={{ marginTop: "20px", padding: "12px", background: "rgba(255,255,255,0.08)", borderRadius: "12px" }}>
          <span style={{ fontSize: "11px", color: "#a4c2b5", display: "block" }}>Petugas Bertugas:</span>
          <b style={{ fontSize: "14px", color: "white" }}>{currentUser?.name || "Admin Pengurus"}</b>
        </div>
        <div style={{ marginTop: "24px" }}>
          {sideItems.map(([label, target]) => (
            <button
              key={target}
              onClick={() => go(target)}
              className={`admin-nav-item ${page === target ? "active" : ""}`}
              style={{ paddingLeft: "16px" }}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => go("home")}
            className="admin-nav-item"
            style={{ marginTop: "20px", color: "#e8a098", paddingLeft: "16px" }}
          >
            ← Keluar ke Beranda
          </button>
        </div>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}

function Admin({ go, currentUser, prices, products, depositHistory }) {
  const totalWeightLogged = depositHistory.reduce((sum, d) => sum + (parseFloat(d.weight) || 0), 0) + 87.5;

  return (
    <AdminShell page="admin" go={go} currentUser={currentUser}>
      <h1 style={{ fontSize: "28px", color: "var(--forest)", marginBottom: "20px" }}>Dashboard Pengurus</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
        <div className="form-panel">
          <span className="kicker">Total Sampah Terkumpul</span>
          <h2 style={{ fontSize: "32px", color: "var(--forest)", marginTop: "8px" }}>{totalWeightLogged.toFixed(1)} Kg</h2>
          <small style={{ color: "var(--muted)" }}>Bulan Oktober 2026</small>
        </div>
        <div className="form-panel">
          <span className="kicker">Katalog Sampah Aktif</span>
          <h2 style={{ fontSize: "32px", color: "var(--forest)", marginTop: "8px" }}>{prices.length} Jenis</h2>
          <small style={{ color: "var(--muted)" }}>Tersinkronisasi otomatis</small>
        </div>
        <div className="form-panel">
          <span className="kicker">Produk Daur Ulang</span>
          <h2 style={{ fontSize: "32px", color: "var(--amber)", marginTop: "8px" }}>{products.length} Karya</h2>
          <small style={{ color: "var(--muted)" }}>Aktif di katalog publik</small>
        </div>
      </div>
      <Button onClick={() => go("deposit")}>+ Catat Setoran Baru</Button>
    </AdminShell>
  );
}

function Deposit({ go, currentUser, prices, onAddDeposit }) {
  const [step, setStep] = useState(1);
  const [qty, setQty] = useState(2.5);
  const [wasteIdx, setWasteIdx] = useState(0);
  const [residentName, setResidentName] = useState("Ibu Siti Aminah");

  const selectedWaste = prices[wasteIdx] || prices[0];
  const total = selectedWaste ? selectedWaste[3] * qty : 0;

  const handleConfirmDeposit = () => {
    onAddDeposit({
      date: "Hari Ini",
      name: residentName.trim(),
      item: `${selectedWaste[0]} (${selectedWaste[1]})`,
      weight: `${qty} ${selectedWaste[2]}`,
      nominal: total
    });
    setStep(2);
  };

  return (
    <AdminShell page="deposit" go={go} currentUser={currentUser}>
      <div style={{ maxWidth: "600px" }}>
        <h1 style={{ fontSize: "28px", color: "var(--forest)", marginBottom: "20px" }}>Formulir Setor Sampah</h1>

        {step === 1 && (
          <div className="form-panel">
            <h3 style={{ marginBottom: "16px" }}>Pilih Jenis Sampah & Masukkan Timbangan</h3>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "6px", color: "var(--muted)" }}>Nama Warga Penabung</label>
              <input
                type="text"
                value={residentName}
                onChange={(e) => setResidentName(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--line)" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "6px", color: "var(--muted)" }}>Jenis Sampah</label>
              <select
                value={wasteIdx}
                onChange={(e) => setWasteIdx(parseInt(e.target.value))}
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--line)" }}
              >
                {prices.map((p, idx) => (
                  <option key={idx} value={idx}>{p[0]} - {p[1]} ({rupiah(p[3])}/{p[2]})</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "13px", marginBottom: "6px", color: "var(--muted)" }}>Berat / Timbangan ({selectedWaste?.[2]})</label>
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
              <small style={{ color: "var(--muted)", fontSize: "11px", display: "block", marginTop: "4px" }}>
                Dicatat oleh: <b>{currentUser?.name || "Admin"}</b>
              </small>
            </div>
            <Button onClick={handleConfirmDeposit}>Lanjut Konfirmasi</Button>
          </div>
        )}

        {step === 2 && (
          <div className="form-panel" style={{ textAlign: "center" }}>
            <div style={{ width: "60px", height: "60px", background: "#eef7f0", color: "var(--green)", borderRadius: "50%", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
              <Icon name="check" size={32} />
            </div>
            <h2>Setoran Berhasil Dicatat!</h2>
            <p style={{ color: "var(--muted)", margin: "10px 0 24px" }}>
              Saldo nasabah <b>{residentName}</b> telah berhasil ditambah sebesar <b>{rupiah(total)}</b> oleh petugas <b>{currentUser?.name || "Admin"}</b>. Data otomatis diperbarui di Portal Warga.
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
            Mewujudkan zero waste permukiman melalui pembiasaan pilah sampah rumah tangga dan pemberdayaan ekonomi sirkular warga Situbondo.
          </p>
        </div>
        <div>
          <h4 style={{ color: "white", marginBottom: "14px" }}>Alamat & Lokasi</h4>
          <p>Bank Sampah Cahaya Kerja<br />Kabupaten Situbondo, Jawa Timur</p>
        </div>
        <div>
          <h4 style={{ color: "white", marginBottom: "14px" }}>Kemitraan</h4>
          <p>Dinas Lingkungan Hidup (DLH)<br />Pegadaian Situbondo</p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 ECO-CAHAYA. Hak cipta dilindungi.</span>
        <span>UINIC 8.0 Web Development</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingTargetPage, setPendingTargetPage] = useState(null);

  const [prices, setPrices] = useState(initialPrices);
  const [products, setProducts] = useState(initialProducts);
  const [depositHistory, setDepositHistory] = useState(initialDepositHistory);

  const handleAddDeposit = (newRecord) => {
    setDepositHistory([newRecord, ...depositHistory]);
  };

  const go = (target) => {
    if (target === "resident") {
      if (!currentUser || currentUser.role !== "warga") {
        setPendingTargetPage(target);
        setPage("login");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    if (["admin", "deposit", "admin_prices", "admin_products"].includes(target)) {
      if (!currentUser || currentUser.role !== "admin") {
        setPendingTargetPage(target);
        setPage("login");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    setPage(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage("home");
  };

  return (
    <>
      {useMemo(() => {
        if (page === "login") {
          return (
            <LoginPage
              go={setPage}
              targetPage={pendingTargetPage || "resident"}
              onLoginSuccess={handleLoginSuccess}
            />
          );
        }
        if (page === "home") return <Home go={go} currentUser={currentUser} logout={handleLogout} products={products} />;
        if (page === "admin") return <Admin go={go} currentUser={currentUser} prices={prices} products={products} depositHistory={depositHistory} />;
        if (page === "deposit") return <Deposit go={go} currentUser={currentUser} prices={prices} onAddDeposit={handleAddDeposit} />;

        if (page === "admin_prices") {
          return (
            <AdminShell page="admin_prices" go={go} currentUser={currentUser}>
              <PriceTableView prices={prices} setPrices={setPrices} isAdmin={true} />
            </AdminShell>
          );
        }
        if (page === "admin_products") {
          return (
            <AdminShell page="admin_products" go={go} currentUser={currentUser}>
              <ProductGridView products={products} setProducts={setProducts} isAdmin={true} />
            </AdminShell>
          );
        }

        if (page === "prices") return <Prices go={go} currentUser={currentUser} logout={handleLogout} prices={prices} setPrices={setPrices} />;
        if (page === "products") return <Products go={go} currentUser={currentUser} logout={handleLogout} products={products} setProducts={setProducts} />;
        if (page === "resident") return <Resident go={go} currentUser={currentUser} logout={handleLogout} depositHistory={depositHistory} />;
        return <Home go={go} currentUser={currentUser} logout={handleLogout} products={products} />;
      }, [page, currentUser, pendingTargetPage, prices, products, depositHistory])}

      <AIChatBot />
    </>
  );
}