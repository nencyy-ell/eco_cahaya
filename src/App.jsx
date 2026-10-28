import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gddiajhvpdvuqiljcasv.supabase.co';
const supabaseAnonKey = 'sb_publishable_-TN3qHMF8WNr1nk5pxS8HQ_owPmkcsy';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AppNotificationsContext = createContext(null);
const heroImage = "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80";

const rupiah = (n) => "Rp " + n.toLocaleString("id-ID");

function useAppNotifications() {
  const notifications = useContext(AppNotificationsContext);
  if (!notifications) {
    throw new Error("useAppNotifications harus digunakan di dalam AppNotificationsProvider.");
  }
  return notifications;
}

function AppNotificationsProvider({ children }) {
  const [notification, setNotification] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const nextId = React.useRef(0);

  const notify = useCallback((message, type = "info") => {
    setNotification({ id: ++nextId.current, message, type });
  }, []);

  const confirmAction = useCallback((message) => new Promise((resolve) => {
    setConfirmation({ message, resolve });
  }), []);

  const resolveConfirmation = (accepted) => {
    confirmation?.resolve(accepted);
    setConfirmation(null);
  };

  useEffect(() => {
    if (!notification) return undefined;
    const timeoutId = window.setTimeout(() => setNotification(null), 4500);
    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  const value = useMemo(() => ({ notify, confirm: confirmAction }), [notify, confirmAction]);

  return (
    <AppNotificationsContext.Provider value={value}>
      {children}
      {notification && (
        <div
          key={notification.id}
          role={notification.type === "error" ? "alert" : "status"}
          aria-live={notification.type === "error" ? "assertive" : "polite"}
          style={{
            position: "fixed", right: "24px", bottom: "24px", zIndex: 20000,
            maxWidth: "min(420px, calc(100vw - 32px))", padding: "14px 18px",
            borderRadius: "12px", color: "white", fontSize: "14px", lineHeight: 1.5,
            background: notification.type === "error" ? "#b83227" : notification.type === "success" ? "var(--forest)" : "#2b6cb0",
            boxShadow: "0 8px 28px rgba(0,0,0,0.2)"
          }}
        >
          {notification.message}
          <button
            type="button"
            aria-label="Tutup notifikasi"
            onClick={() => setNotification(null)}
            style={{ marginLeft: "14px", border: 0, background: "transparent", color: "white", fontSize: "18px", cursor: "pointer" }}
          >
            ×
          </button>
        </div>
      )}
      {confirmation && (
        <div role="presentation" style={{ position: "fixed", inset: 0, zIndex: 21000, background: "rgba(0,0,0,0.45)", display: "grid", placeItems: "center", padding: "20px" }}>
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="app-confirmation-title"
            className="form-panel"
            style={{ width: "100%", maxWidth: "420px", padding: "24px", background: "white" }}
          >
            <h2 id="app-confirmation-title" style={{ fontSize: "20px", color: "var(--forest)", marginBottom: "10px" }}>Konfirmasi</h2>
            <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.5, marginBottom: "22px" }}>{confirmation.message}</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Button variant="secondary" onClick={() => resolveConfirmation(false)}>Batal</Button>
              <Button variant="primary" onClick={() => resolveConfirmation(true)}>Ya, lanjutkan</Button>
            </div>
          </div>
        </div>
      )}
    </AppNotificationsContext.Provider>
  );
}

function printReceipt() {
  const clearPrintMode = () => document.body.classList.remove("printing-receipt");
  document.body.classList.add("printing-receipt");
  window.addEventListener("afterprint", clearPrintMode, { once: true });
  window.print();
}

function Icon({ name, size = 20 }) {
  const paths = {
    arrow: <path d="M5 12h14m-7-7 7 7-7 7" />,
    check: <path d="M20 6 9 17l-5-5" />,
    user: <><circle cx="12" cy="7" r="4" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" /></>,
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
    printer: <><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></>,
    award: <><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
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
        style={{ width: "42px", height: "42px", objectFit: "contain", background: "transparent" }}
        onError={(e) => { e.target.src = "/logo.png"; }}
      />
      <span>
        <b style={{ fontFamily: "Marcellus, serif", fontSize: "18px", color: "var(--forest)" }}>ECO-CAHAYA</b>
        <small style={{ display: "block", fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>
          Bank Sampah Cahaya Kerja Situbondo
        </small>
      </span>
    </div>
  );
}

function Header({ go, currentTab, currentUser, logout }) {
  const isActive = (tabName) => currentTab === tabName;
  const tabStyle = (tabName) => ({
    background: "transparent", border: "none", cursor: "pointer", fontSize: "15px",
    fontWeight: isActive(tabName) ? "700" : "500", color: isActive(tabName) ? "var(--forest)" : "var(--muted)",
    paddingBottom: "4px", borderBottom: isActive(tabName) ? "2px solid var(--forest)" : "2px solid transparent", transition: "all 0.2s ease"
  });

  return (
    <header style={{
      width: "100%", background: "white", borderBottom: "1px solid var(--line)",
      padding: "16px 40px", display: "flex", justifyContent: "space-between", alignItems: "center",
      position: "sticky", top: 0, zIndex: 1000, boxSizing: "border-box"
    }}>
      <Brand />
      <nav style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        <button onClick={() => go("home")} style={tabStyle("home")}>Beranda</button>
        <button onClick={() => go("prices")} style={tabStyle("prices")}>Daftar Harga</button>
        <button onClick={() => go("products")} style={tabStyle("products")}>Katalog Produk</button>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {currentUser ? (
          <button
            onClick={logout}
            style={{
              background: "#f0f4f1", border: "1px solid var(--line)", padding: "8px 16px",
              borderRadius: "999px", fontSize: "13px", fontWeight: "600", color: "var(--forest)",
              display: "flex", alignItems: "center", gap: "6px", cursor: "pointer"
            }}
          >
            <Icon name="user" size={15} />
            <span>{currentUser.name} ({currentUser.role === "admin" ? "Pengurus" : "Warga"})</span>
          </button>
        ) : null}

        <Button variant="secondary" onClick={() => go("resident")} style={{ borderColor: "var(--forest)", color: "var(--forest)", fontWeight: "600", padding: "10px 18px" }}>
          Portal Warga
        </Button>
        <Button variant="primary" onClick={() => go("deposit")} style={{ background: "var(--forest)", color: "white", fontWeight: "600", padding: "10px 18px" }}>
          Catat Setoran Warga
        </Button>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#0b221a", color: "#d2e4db", padding: "50px 40px 30px", boxSizing: "border-box", width: "100%" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "40px", marginBottom: "30px" }}>
        <div>
          <Brand />
          <p style={{ marginTop: "16px", fontSize: "14px", lineHeight: "1.6", color: "#a4c2b5" }}>
            Mewujudkan lingkungan bersih dan ekonomi sirkular mandiri bagi warga Kelurahan Patokan, Situbondo.
          </p>
        </div>
        <div>
          <h4 style={{ color: "white", marginBottom: "14px", fontSize: "15px" }}>Alamat & Lokasi</h4>
          <p style={{ fontSize: "14px", color: "#a4c2b5", lineHeight: "1.5" }}>Bank Sampah Cahaya Kerja<br />Kelurahan Patokan, Situbondo, Jawa Timur</p>
        </div>
        <div>
          <h4 style={{ color: "white", marginBottom: "14px", fontSize: "15px" }}>Kemitraan</h4>
          <p style={{ fontSize: "14px", color: "#a4c2b5", lineHeight: "1.5" }}>Dinas Lingkungan Hidup (DLH)<br />Pegadaian Situbondo</p>
        </div>
      </div>
      <div style={{ maxWidth: "1300px", margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#a4c2b5" }}>
        <span>© 2026 ECO-CAHAYA. Hak cipta dilindungi.</span>
        <span>UINIC 8.0 Web Development</span>
      </div>
    </footer>
  );
}

function LoginPage({ go, targetPage, onLoginSuccess }) {
  const isResidentPortal = targetPage === "resident";
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim()) return;

    if (!isResidentPortal) {
      if (password !== "cahayakerja2026") {
        setErrorMsg("Kata sandi pengurus salah! Gunakan: cahayakerja2026");
        return;
      }
      onLoginSuccess({ name: name.trim(), role: "admin" });
    } else {
      onLoginSuccess({ name: name.trim(), role: "warga" });
    }
    go(targetPage);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "var(--paper)" }}>
      <header style={{ padding: "16px 40px", background: "white", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Brand />
        <Button variant="ghost" onClick={() => go("home")}>← Kembali ke Beranda</Button>
      </header>

      <div style={{ maxWidth: "440px", margin: "40px auto", padding: "0 20px", width: "100%" }}>
        <div className="form-panel" style={{ textAlign: "center", padding: "36px 28px", background: "white" }}>
          <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#eef6f0", color: "var(--forest)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
            <Icon name="user" size={26} />
          </div>
          <h2 style={{ fontSize: "22px", color: "var(--forest)", marginBottom: "6px" }}>
            {isResidentPortal ? "Cek Tabungan Warga" : "Masuk Pengurus Bank Sampah"}
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "20px" }}>
            {isResidentPortal
              ? "Masukkan nama lengkap Anda untuk melihat saldo tabungan dan riwayat setoran sampah."
              : "Masukkan nama petugas dan kata sandi pengurus untuk membuka halaman pengelolaan."}
          </p>

          {errorMsg && (
            <div style={{ padding: "10px 14px", background: "#fff5f5", color: "#c53030", borderRadius: "8px", fontSize: "13px", marginBottom: "16px", border: "1px solid #feb2b2", textAlign: "left" }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--forest)" }}>
                {isResidentPortal ? "Nama Lengkap Warga (Sesuai Data Bank Sampah)" : "Nama Petugas Pengurus"}
              </label>
              <input
                type="text"
                placeholder={isResidentPortal ? "Contoh: Bu Ngateman / Sugeng" : "Contoh: Ibu Wayan"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--line)", fontSize: "14px" }}
              />
            </div>

            {!isResidentPortal && (
              <div style={{ marginBottom: "24px", position: "relative" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--forest)" }}>
                  Kata Sandi Pengurus
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: "100%", padding: "12px 40px 12px 12px", borderRadius: "10px", border: "1px solid var(--line)", fontSize: "14px", boxSizing: "border-box" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}
                    title={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
                  >
                    <Icon name="eye" size={18} />
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" variant="primary" style={{ width: "100%", padding: "14px", fontSize: "15px" }}>
              {isResidentPortal ? "Buka Buku Tabungan Saya" : "Masuk Dashboard Pengurus"}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Home({ go, products, totalCleanWasteKg }) {
  return (
    <div>
      <Header go={go} currentTab="home" />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="kicker">Yuk, Peduli Sampah dari Rumah Kita!</span>
            <h1>
              Pilah sampah hari ini, <br />
              <em>bikin lingkungan bersih & tabungan nambah.</em>
            </h1>
            <p>
              Sampah rumah tangga dan minyak jelantah yang ibu-ibu kumpulkan di rumah bisa disetor ke Bank Sampah Cahaya Kerja Patokan. Dicatat transparan, bisa jadi sembako atau tabungan emas!
            </p>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              <Button onClick={() => go("products")}>Lihat Produk Daur Ulang</Button>
              <Button variant="secondary" onClick={() => go("prices")}>Cek Harga Sampah</Button>
            </div>
          </div>
          <div className="hero-visual">
            <img
              src={heroImage}
              alt="Kegiatan pemilahan sampah"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80"; }}
            />
            <div className="floating-card">
              <div>
                <b style={{ display: "block", fontSize: "16px", color: "var(--forest)" }}>{totalCleanWasteKg.toFixed(1)} Kg Sampah</b>
                <small style={{ color: "var(--muted)", fontSize: "12px" }}>Berhasil dikelola warga Patokan</small>
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "40px" }}>
          <div className="section-head">
            <span className="kicker">Karya Kriya Buatan Tangan Asli</span>
            <h2>Produk Unggulan 100% Handmade</h2>
            <p>Dibuat teliti dengan penuh cinta oleh ibu-ibu kader lingkungan Bank Sampah Cahaya Kerja.</p>
          </div>
          <div className="products-grid">
            {products.slice(0, 3).map((item, idx) => (
              <div key={idx} className="product-card">
                <div className="img-box">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80"; }}
                  />
                </div>
                <div className="content">
                  <div>
                    <span className="kicker" style={{ fontSize: "10px" }}>{item.status}</span>
                    <h3>{item.title}</h3>
                    <p style={{ fontSize: "13px", lineHeight: "1.5" }}>{item.description}</p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                    <span className="price">{item.price_tag}</span>
                    <Button variant="primary" onClick={() => go("products")}>Beli / Pesan</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "36px" }}>
            <Button variant="secondary" onClick={() => go("products")}>Lihat Semua Produk Kreatif Lainnya</Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Prices({ go, currentUser, logout, prices }) {
  const [q, setQ] = useState("");
  const filtered = prices.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.condition.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <Header go={go} currentTab="prices" currentUser={currentUser} logout={logout} />
      <div className="section" style={{ padding: "40px 40px" }}>
        <div className="section-head" style={{ marginBottom: "30px" }}>
          <span className="kicker">Transparan dan Menguntungkan Warga</span>
          <h2>Daftar Harga Setor Sampah</h2>
          <p>Harga beli disesuaikan dengan standar pengepul resmi agar ibu-ibu makin semangat memilah dari dapur.</p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
          <div className="form-panel" style={{ margin: 0, padding: "12px 18px", flex: "1 1 300px", background: "white" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Icon name="search" />
              <input
                type="text"
                placeholder="Cari jenis sampah (misal: botol, kardus, jelantah)..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                style={{ width: "100%", border: 0, outline: "none", fontSize: "14px" }}
              />
            </div>
          </div>
        </div>

        <div className="table-wrap" style={{ background: "white" }}>
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
                  <td><b>{item.name}</b></td>
                  <td>{item.condition}</td>
                  <td>{item.unit}</td>
                  <td><b style={{ color: "var(--green)" }}>{rupiah(item.price)}</b></td>
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

function Products({ go, currentUser, logout, products, onNewOrder }) {
  const { notify } = useAppNotifications();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [shippingMethod, setShippingMethod] = useState("ambil");
  const [shippingAddress, setShippingAddress] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone) return;
    if (shippingMethod === "kirim" && !shippingAddress) return;

    const newOrder = {
      product_name: selectedProduct.title,
      buyer_name: buyerName.trim(),
      buyer_phone: buyerPhone.trim(),
      shipping_address: shippingMethod === "ambil" ? "Diambil Langsung ke Bank Sampah" : `Dikirim ke: ${shippingAddress.trim()}`,
      status: "Baru"
    };

    const { data, error } = await supabase.from('orders').insert([newOrder]).select();
    if (!error && data) {
      onNewOrder(data[0]);
      setSuccessMsg(true);
      setTimeout(() => {
        setSuccessMsg(false);
        setSelectedProduct(null);
        setBuyerName("");
        setBuyerPhone("");
        setShippingAddress("");
        setShippingMethod("ambil");
      }, 2500);
    } else {
      notify("Gagal mengirim pesanan: " + error.message, "error");
    }
  };

  return (
    <div>
      <Header go={go} currentTab="products" currentUser={currentUser} logout={logout} />
      <div className="section" style={{ padding: "40px 40px" }}>
        <div className="section-head" style={{ marginBottom: "24px" }}>
          <span className="kicker">Galeri Karya Daur Ulang Warga</span>
          <h2>Belanja Sambil Menjaga Lingkungan</h2>
          <p>Pesan langsung produk handmade berkualitas. Pilih diambil sendiri atau dikirim ke rumah!</p>
        </div>

        <div className="products-grid">
          {products.map((item, idx) => (
            <div key={idx} className="product-card">
              <div className="img-box">
                <img
                  src={item.image_url}
                  alt={item.title}
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80"; }}
                />
              </div>
              <div className="content">
                <div>
                  <span className="kicker" style={{ fontSize: "10px" }}>{item.status}</span>
                  <h3>{item.title}</h3>
                  <p style={{ fontSize: "13px", lineHeight: "1.5" }}>{item.description}</p>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--line)", paddingTop: "14px" }}>
                  <span className="price">{item.price_tag}</span>
                  <Button variant="primary" onClick={() => setSelectedProduct(item)}>Pesan Sekarang</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedProduct && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "grid", placeItems: "center", zIndex: 10000, padding: "20px" }}>
            <div className="form-panel" style={{ maxWidth: "460px", width: "100%", padding: "30px", background: "white", position: "relative" }}>
              <h3 style={{ fontSize: "20px", color: "var(--forest)", marginBottom: "6px" }}>Pesan Produk Kriya</h3>
              <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px" }}><b>{selectedProduct.title}</b> ({selectedProduct.price_tag})</p>

              {successMsg ? (
                <div style={{ padding: "16px", background: "#eef7f0", color: "var(--green)", borderRadius: "10px", textAlign: "center", fontSize: "14px" }}>
                  <b>Pesanan Berhasil Dikirim!</b> Pengurus akan segera menyiapkan pesanan dan menghubungi Anda.
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Nama Lengkap Pemesan</label>
                    <input type="text" required placeholder="Contoh: Ibu Rina" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Nomor WhatsApp (Aktif)</label>
                    <input type="text" required placeholder="Contoh: 081234567890" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "14px" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Metode Pengambilan Pesanan</label>
                    <select value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "white", fontSize: "14px" }}>
                      <option value="ambil">Diambil Langsung ke Bank Sampah</option>
                      <option value="kirim">Dikirim ke Alamat Rumah</option>
                    </select>
                  </div>
                  {shippingMethod === "kirim" && (
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Alamat Pengiriman Lengkap</label>
                      <textarea required rows="2" placeholder="Contoh: Jl. Melati No. 12, Patokan, Situbondo" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", fontFamily: "inherit", resize: "none", fontSize: "14px" }}></textarea>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
                    <Button variant="secondary" onClick={() => setSelectedProduct(null)}>Batal</Button>
                    <Button type="submit" variant="primary">Kirim Pesanan</Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function Resident({ go, currentUser, logout, depositHistory, onApplyGold, onApplySembako, sembakoRequests }) {
  const { notify } = useAppNotifications();
  const currentResidentName = currentUser?.name || "Bu Ngateman";
  const userDeposits = depositHistory.filter(
    (d) => d.user_name.toLowerCase() === currentResidentName.toLowerCase()
  );

  const userSembakoReqs = sembakoRequests.filter(
    (s) => s.user_name.toLowerCase() === currentResidentName.toLowerCase()
  );

  const totalUserBalance = userDeposits.reduce((sum, d) => sum + parseFloat(d.nominal || 0), 0) || 35000;
  
  let badgeTier = "Warga Peduli Lingkungan";
  let badgeColor = "#2d7a54";
  if (totalUserBalance >= 50000) {
    badgeTier = "Pejuang Lingkungan Lestari";
    badgeColor = "#2b6cb0";
  }

  const [goldSuccess, setGoldSuccess] = useState(false);
  const [sembakoSuccess, setSembakoSuccess] = useState(false);
  const [selectedNota, setSelectedNota] = useState(null);

  const handleApplyGold = async (e) => {
    e.preventDefault();
    if (totalUserBalance < 50000) {
      notify("Maaf, saldo tabungan belum mencukupi untuk penukaran emas Pegadaian (minimal Rp 50.000).", "error");
      return;
    }

    const newBatch = {
      id: `VCH-${Math.floor(Math.random() * 9000) + 1000}`,
      user_name: currentResidentName,
      amount: 50000,
      status: "Siap Disetor ke Pegadaian"
    };

    const { error } = await supabase.from('gold_batches').insert([newBatch]);
    if (!error) {
      onApplyGold(newBatch);
      setGoldSuccess(true);
      setTimeout(() => setGoldSuccess(false), 3000);
    } else {
      notify("Gagal mengajukan emas: " + error.message, "error");
    }
  };

  const handleApplySembako = async (e) => {
    e.preventDefault();
    if (totalUserBalance <= 0) {
      notify("Saldo tabungan Anda saat ini Rp 0.", "error");
      return;
    }

    const newReq = {
      user_name: currentResidentName,
      amount: totalUserBalance,
      status: "Menunggu Konfirmasi"
    };

    const { data, error } = await supabase.from('sembako_requests').insert([newReq]).select();
    if (!error && data) {
      onApplySembako(data[0]);
      setSembakoSuccess(true);
      setTimeout(() => setSembakoSuccess(false), 3000);
    } else {
      notify("Gagal mengajukan sembako: " + error.message, "error");
    }
  };

  return (
    <div>
      <Header go={go} currentTab="resident" currentUser={currentUser} logout={logout} />
      <div className="section" style={{ maxWidth: "860px", padding: "40px 20px" }}>
        <div className="form-panel" style={{ background: "var(--forest)", color: "white", marginBottom: "24px", padding: "30px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <span style={{ fontSize: "12px", opacity: 0.8 }}>BUKU TABUNGAN WARGA • KELURAHAN PATOKAN</span>
            <span style={{ fontSize: "11px", background: badgeColor, color: "white", padding: "6px 14px", borderRadius: "999px", display: "inline-flex", alignItems: "center", gap: "6px", fontWeight: "bold" }}>
              <Icon name="award" size={14} /> {badgeTier}
            </span>
          </div>

          <h2 style={{ fontSize: "28px", margin: "14px 0 6px" }}>Halo, {currentResidentName}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", marginTop: "16px" }}>
            <div>
              <span style={{ fontSize: "13px", opacity: 0.8 }}>Total Tabungan Sampah Anda:</span>
              <div style={{ fontSize: "38px", fontWeight: "bold", color: "var(--leaf)" }}>{rupiah(totalUserBalance)}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
          <div className="form-panel" style={{ padding: "24px", background: "white", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontSize: "17px", color: "var(--forest)", marginBottom: "6px" }}>Konversi Tabungan Emas</h3>
              <p style={{ color: "var(--muted)", fontSize: "12px", marginBottom: "16px" }}>Syarat minimal saldo Rp 50.000 untuk ditukar emas batangan Pegadaian.</p>
              {goldSuccess && <div style={{ padding: "10px", background: "#eef7f0", color: "var(--green)", borderRadius: "8px", fontSize: "13px", marginBottom: "12px" }}>Berhasil diajukan ke pengurus!</div>}
            </div>
            <Button variant="primary" onClick={handleApplyGold} style={{ width: "100%", padding: "12px" }}>Tukar Tabungan Emas</Button>
          </div>

          <div className="form-panel" style={{ padding: "24px", background: "white", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontSize: "17px", color: "var(--forest)", marginBottom: "6px" }}>Tukar Saldo Jadi Sembako</h3>
              <p style={{ color: "var(--muted)", fontSize: "12px", marginBottom: "16px" }}>Gunakan saldo tabungan untuk belanja kebutuhan sembako di warung bank sampah.</p>
              {sembakoSuccess && <div style={{ padding: "10px", background: "#eef7f0", color: "var(--green)", borderRadius: "8px", fontSize: "13px", marginBottom: "12px" }}>Pengajuan sembako terkirim! Cek status di bawah.</div>}
            </div>
            <Button variant="secondary" onClick={handleApplySembako} style={{ width: "100%", padding: "12px", borderColor: "var(--forest)", color: "var(--forest)" }}>Tukar Jadi Sembako</Button>
          </div>
        </div>

        {userSembakoReqs.length > 0 && (
          <div className="form-panel" style={{ marginBottom: "24px", padding: "20px", background: "white" }}>
            <h4 style={{ fontSize: "15px", color: "var(--forest)", marginBottom: "10px" }}>Status Pengajuan Sembako Anda</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {userSembakoReqs.map((req, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--paper)", borderRadius: "8px", fontSize: "13px" }}>
                  <span>Nominal: <b>{rupiah(req.amount)}</b></span>
                  <span style={{
                    background: req.status === 'Disetujui' ? '#eef7f0' : '#fefcbf',
                    color: req.status === 'Disetujui' ? 'var(--green)' : '#975a16',
                    padding: "4px 10px", borderRadius: "999px", fontWeight: "600", fontSize: "12px"
                  }}>
                    {req.status === 'Disetujui' ? '✅ Silakan diambil di tempat bank sampah' : req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="table-wrap" style={{ background: "white" }}>
          <h3 style={{ padding: "20px", margin: 0, fontSize: "16px", color: "var(--forest)", borderBottom: "1px solid var(--line)" }}>Riwayat Setoran Sampah & Nota Digital</h3>
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jenis Sampah</th>
                <th>Berat</th>
                <th>Nilai Rupiah</th>
                <th style={{ textAlign: "right" }}>Nota Digital</th>
              </tr>
            </thead>
            <tbody>
              {userDeposits.length > 0 ? (
                userDeposits.map((d, idx) => (
                  <tr key={idx}>
                    <td>{d.deposit_date}</td>
                    <td><b>{d.waste_type}</b></td>
                    <td>{d.weight} kg</td>
                    <td><b style={{ color: "var(--green)" }}>+{rupiah(d.nominal)}</b></td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        onClick={() => setSelectedNota(d)}
                        style={{ padding: "6px 12px", background: "#eef6f0", border: "1px solid var(--line)", borderRadius: "6px", fontSize: "12px", fontWeight: "600", color: "var(--forest)", cursor: "pointer" }}
                      >
                        Lihat Nota
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>
                    Belum ada riwayat setoran tercatat untuk nama ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedNota && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "grid", placeItems: "center", zIndex: 10000, padding: "20px" }}>
          <div className="form-panel receipt-print" style={{ maxWidth: "400px", width: "100%", padding: "28px", background: "white" }}>
            <div style={{ textAlign: "center", borderBottom: "2px dashed var(--line)", paddingBottom: "14px", marginBottom: "14px" }}>
              <b style={{ fontFamily: "Marcellus, serif", fontSize: "16px", color: "var(--forest)" }}>NOTA DIGITAL SETORAN</b>
              <small style={{ display: "block", color: "var(--muted)", fontSize: "11px" }}>Bank Sampah Cahaya Kerja Patokan</small>
            </div>
            <div style={{ fontSize: "13px", display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Tanggal:</span> <b>{selectedNota.deposit_date}</b></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Nama Warga:</span> <b>{selectedNota.user_name}</b></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Jenis Sampah:</span> <b>{selectedNota.waste_type}</b></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Berat Timbangan:</span> <b>{selectedNota.weight} kg</b></div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--line)", paddingTop: "8px", fontSize: "15px" }}><span>Total Rupiah:</span> <b style={{ color: "var(--green)" }}>{rupiah(selectedNota.nominal)}</b></div>
            </div>
            <div className="no-print" style={{ display: "flex", gap: "10px" }}>
              <Button variant="secondary" style={{ flex: 1 }} onClick={() => setSelectedNota(null)}>Tutup</Button>
              <Button variant="primary" className="no-print" style={{ flex: 1 }} onClick={printReceipt}><Icon name="printer" size={14} /> Cetak</Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// Layout Admin Bersih Tanpa Duplikasi Sidebar
function AdminShell({ page, go, currentUser, children, newOrdersCount, newSembakoCount }) {
  const sideItems = [
    ["Dashboard", "admin"],
    ["Catat Setoran", "deposit"],
    ["Pesanan Masuk", "admin_orders"],
    ["Pengajuan Sembako", "admin_sembako"],
    ["Daftar Harga", "admin_prices"],
    ["Batch Emas Pegadaian", "admin_gold"],
    ["Laporan Adipura/DLH", "admin_report"]
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", fontSize: "15px" }}>
      <aside className="no-print" style={{ background: "var(--forest)", color: "white", padding: "24px 0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ padding: "0 20px 20px 20px", borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
            <Brand />
          </div>
          <div style={{ margin: "20px 20px", padding: "12px", background: "rgba(255,255,255,0.08)", borderRadius: "10px" }}>
            <span style={{ fontSize: "11px", color: "#a4c2b5", display: "block" }}>Petugas Pengurus:</span>
            <b style={{ fontSize: "14px", color: "white" }}>{currentUser?.name || "Ibu Ketua"}</b>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            {sideItems.map(([label, target]) => {
              const active = page === target;
              const hasBadge = (target === "admin_orders" && newOrdersCount > 0) || (target === "admin_sembako" && newSembakoCount > 0);
              const badgeNum = target === "admin_orders" ? newOrdersCount : newSembakoCount;

              return (
                <button
                  key={target}
                  onClick={() => go(target)}
                  style={{
                    background: active ? "rgba(255,255,255,0.15)" : "transparent",
                    color: active ? "white" : "#c2d6ce",
                    border: "none", padding: "14px 20px", textAlign: "left", fontSize: "15px",
                    fontWeight: active ? "700" : "500", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    borderLeft: active ? "4px solid var(--leaf)" : "4px solid transparent"
                  }}
                >
                  <span>{label}</span>
                  {hasBadge && (
                    <span style={{ background: "#e53e3e", color: "white", fontSize: "11px", padding: "2px 7px", borderRadius: "999px", fontWeight: "bold" }}>
                      {badgeNum}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        <div style={{ padding: "0 20px" }}>
          <button
            onClick={() => go("home")}
            style={{
              background: "rgba(232, 160, 152, 0.15)", color: "#e8a098", border: "none", width: "100%",
              padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "14px", textAlign: "left", paddingLeft: "16px"
            }}
          >
            ← Keluar ke Beranda
          </button>
        </div>
      </aside>
      <main className="admin-main" style={{ background: "var(--paper)", padding: "40px", overflowY: "auto" }}>
        {children}
      </main>
    </div>
  );
}

function Admin({ go, currentUser, depositHistory, orders, goldBatches, sembakoRequests }) {
  const totalWeightLogged = depositHistory.reduce((sum, d) => sum + parseFloat(d.weight || 0), 0);
  const newOrders = orders.filter((o) => o.status === "Baru");
  const newSembako = sembakoRequests.filter((s) => s.status === "Menunggu Konfirmasi");

  return (
    <AdminShell page="admin" go={go} currentUser={currentUser} newOrdersCount={newOrders.length} newSembakoCount={newSembako.length}>
      <h1 style={{ fontSize: "28px", color: "var(--forest)", marginBottom: "20px" }}>Dashboard Pengurus Bank Sampah</h1>
      
      {newOrders.length > 0 && (
        <div style={{ padding: "16px 20px", background: "#fff5f5", border: "1px solid #feb2b2", borderRadius: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#c53030" }}>
            <Icon name="bell" size={20} />
            <b>Ada {newOrders.length} Pesanan Kriya Baru Masuk!</b>
          </div>
          <Button variant="primary" onClick={() => go("admin_orders")} style={{ fontSize: "13px", padding: "8px 14px" }}>Lihat Pesanan</Button>
        </div>
      )}

      {newSembako.length > 0 && (
        <div style={{ padding: "16px 20px", background: "#fefcbf", border: "1px solid #f6e05e", borderRadius: "12px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#975a16" }}>
            <Icon name="bell" size={20} />
            <b>Ada {newSembako.length} Pengajuan Sembako Baru dari Warga!</b>
          </div>
          <Button variant="primary" onClick={() => go("admin_sembako")} style={{ fontSize: "13px", padding: "8px 14px", background: "#975a16" }}>Cek Pengajuan</Button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" }}>
        <div className="form-panel" style={{ background: "white", padding: "24px" }}>
          <span className="kicker">Total Sampah Warga</span>
          <h2 style={{ fontSize: "32px", color: "var(--forest)", marginTop: "8px" }}>{totalWeightLogged.toFixed(1)} Kg</h2>
          <small style={{ color: "var(--muted)" }}>Tercatat di Supabase</small>
        </div>
        <div className="form-panel" style={{ background: "white", padding: "24px" }}>
          <span className="kicker">Pesanan Kriya Masuk</span>
          <h2 style={{ fontSize: "32px", color: "var(--amber)", marginTop: "8px" }}>{orders.length} Pesanan</h2>
          <small style={{ color: "var(--muted)" }}>{newOrders.length} belum diproses</small>
        </div>
        <div className="form-panel" style={{ background: "white", padding: "24px" }}>
          <span className="kicker">Pengajuan Sembako</span>
          <h2 style={{ fontSize: "32px", color: "var(--green)", marginTop: "8px" }}>{sembakoRequests.length} Berkas</h2>
          <small style={{ color: "var(--muted)" }}>{newSembako.length} menunggu acc</small>
        </div>
      </div>

      <div style={{ display: "flex", gap: "14px" }}>
        <Button onClick={() => go("deposit")} style={{ padding: "12px 24px" }}>+ Catat Setoran Warga</Button>
        <Button variant="secondary" onClick={() => go("admin_report")} style={{ padding: "12px 24px" }}>Cetak Laporan Adipura/DLH</Button>
      </div>
    </AdminShell>
  );
}

function AdminOrders({ go, currentUser, orders, setOrders, newOrdersCount, newSembakoCount }) {
  const { notify, confirm: confirmAction } = useAppNotifications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleMarkStatus = async (id, newStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (!error) {
      setOrders(orders.map((o) => o.id === id ? { ...o, status: newStatus } : o));
    } else {
      notify("Gagal memperbarui status: " + error.message, "error");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (await confirmAction("Hapus pesanan ini dari daftar?")) {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (!error) {
        setOrders(orders.filter(o => o.id !== id));
      } else {
        notify("Gagal menghapus: " + error.message, "error");
      }
    }
  };

  const handleManualOrder = async (e) => {
    e.preventDefault();
    const newOrd = {
      product_name: productName.trim(),
      buyer_name: buyerName.trim(),
      buyer_phone: buyerPhone.trim(),
      shipping_address: address.trim(),
      status: "Baru"
    };
    const { data, error } = await supabase.from('orders').insert([newOrd]).select();
    if (!error && data) {
      setOrders([data[0], ...orders]);
      setIsModalOpen(false);
      setProductName("");
      setBuyerName("");
      setBuyerPhone("");
      setAddress("");
    } else {
      notify("Gagal menambah pesanan: " + error.message, "error");
    }
  };

  return (
    <AdminShell page="admin_orders" go={go} currentUser={currentUser} newOrdersCount={newOrdersCount} newSembakoCount={newSembakoCount}>
      <div className="section-head" style={{ marginBottom: "20px", textAlign: "left" }}>
        <span className="kicker">Kelola Pesanan Kriya Masuk</span>
        <h2>Pesanan Masuk</h2>
        <p>Pantau pesanan online maupun offline secara real-time langsung di dashboard pengurus.</p>
      </div>

      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>+ Tambah Pesanan Offline</Button>
      </div>

      <div className="table-wrap" style={{ background: "white" }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Pemesan</th>
              <th>Produk</th>
              <th>WhatsApp</th>
              <th>Pengiriman</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Aksi & Ubah Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((o, idx) => (
                <tr key={idx}>
                  <td><b>#{o.id}</b></td>
                  <td>{o.buyer_name}</td>
                  <td><b>{o.product_name}</b></td>
                  <td>{o.buyer_phone}</td>
                  <td>{o.shipping_address}</td>
                  <td>
                    <span style={{ background: o.status === 'Baru' ? '#fff5f5' : o.status === 'Diproses' ? '#fefcbf' : '#eef7f0', color: o.status === 'Baru' ? '#c53030' : o.status === 'Diproses' ? '#975a16' : 'var(--green)', padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}>
                      {o.status === 'Baru' && (
                        <button onClick={() => handleMarkStatus(o.id, 'Diproses')} style={{ padding: "5px 10px", background: "#2b6cb0", color: "white", border: 0, borderRadius: "6px", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>Proses</button>
                      )}
                      {o.status !== 'Selesai' && (
                        <button onClick={() => handleMarkStatus(o.id, 'Selesai')} style={{ padding: "5px 10px", background: "var(--forest)", color: "white", border: 0, borderRadius: "6px", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>Selesai</button>
                      )}
                      <button onClick={() => handleDeleteOrder(o.id)} style={{ padding: "5px 8px", background: "#fff5f5", color: "#c53030", border: "1px solid #feb2b2", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>
                  Belum ada pesanan kriya masuk.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "grid", placeItems: "center", zIndex: 10000, padding: "20px" }}>
          <div className="form-panel" style={{ maxWidth: "460px", width: "100%", padding: "30px", background: "white" }}>
            <h3 style={{ fontSize: "20px", color: "var(--forest)", marginBottom: "16px" }}>Tambah Pesanan Manual (Offline)</h3>
            <form onSubmit={handleManualOrder} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Nama Produk</label>
                <input type="text" required placeholder="Contoh: Tas Rajut SEDAJA" value={productName} onChange={(e) => setProductName(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Nama Pembeli</label>
                <input type="text" required placeholder="Contoh: Ibu Rina" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Nomor WhatsApp</label>
                <input type="text" required placeholder="Contoh: 081234567890" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Keterangan / Pengambilan</label>
                <input type="text" required placeholder="Diambil langsung di bank sampah" value={address} onChange={(e) => setAddress(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)" }} />
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "14px" }}>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
                <Button type="submit" variant="primary">Simpan Pesanan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function AdminSembako({ go, currentUser, sembakoRequests, setSembakoRequests, newOrdersCount, newSembakoCount }) {
  const { notify } = useAppNotifications();
  const handleApprove = async (id) => {
    const { error } = await supabase.from('sembako_requests').update({ status: 'Disetujui' }).eq('id', id);
    if (!error) {
      setSembakoRequests(sembakoRequests.map(s => s.id === id ? { ...s, status: 'Disetujui' } : s));
    } else {
      notify("Gagal menyetujui: " + error.message, "error");
    }
  };

  return (
    <AdminShell page="admin_sembako" go={go} currentUser={currentUser} newOrdersCount={newOrdersCount} newSembakoCount={newSembakoCount}>
      <div className="section-head" style={{ marginBottom: "20px", textAlign: "left" }}>
        <span className="kicker">Pengelolaan Penukaran Saldo</span>
        <h2>Pengajuan Sembako Warga</h2>
        <p>Setujui penukaran saldo tabungan menjadi sembako agar warga bisa mengambilnya langsung di tempat.</p>
      </div>

      <div className="table-wrap" style={{ background: "white" }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Warga</th>
              <th>Nominal Ditukar</th>
              <th>Status Pengajuan</th>
              <th style={{ textAlign: "right" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sembakoRequests.length > 0 ? (
              sembakoRequests.map((s, idx) => (
                <tr key={idx}>
                  <td><b>#{s.id}</b></td>
                  <td>{s.user_name}</td>
                  <td><b style={{ color: "var(--green)" }}>{rupiah(s.amount)}</b></td>
                  <td>
                    <span style={{ background: s.status === 'Disetujui' ? '#eef7f0' : '#fefcbf', color: s.status === 'Disetujui' ? 'var(--green)' : '#975a16', padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {s.status === 'Menunggu Konfirmasi' && (
                      <button onClick={() => handleApprove(s.id)} style={{ padding: "6px 12px", background: "var(--forest)", color: "white", border: 0, borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                        Setujui Penukaran
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>
                  Belum ada pengajuan sembako.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function Deposit({ go, currentUser, prices, depositHistory, onAddDeposit }) {
  const { notify } = useAppNotifications();
  const [qty, setQty] = useState("");
  const [wasteIdx, setWasteIdx] = useState(0);
  const [residentName, setResidentName] = useState("");
  const [lastSavedRecord, setLastSavedRecord] = useState(null);

  const uniqueResidentNames = useMemo(() => {
    const setNames = new Set(depositHistory.map(d => d.user_name));
    return Array.from(setNames);
  }, [depositHistory]);

  const filteredNames = uniqueResidentNames.filter(n => n.toLowerCase().includes(residentName.toLowerCase()) && residentName.trim() !== "");

  const selectedWaste = prices[wasteIdx] || prices[0];
  const parsedQty = parseFloat(qty) || 0;
  const totalRupiah = selectedWaste ? selectedWaste.price * parsedQty : 0;
  const factor = selectedWaste ? (selectedWaste.co2_factor || 1.2) : 1.2;
  const totalCo2e = (parsedQty * factor).toFixed(2);

  const handleConfirmDeposit = async (e) => {
    e.preventDefault();
    if (!residentName.trim() || parsedQty <= 0) {
      notify("Mohon lengkapi nama warga dan berat timbangan dengan benar.", "error");
      return;
    }

    const newRecord = {
      user_name: residentName.trim(),
      deposit_date: new Date().toISOString().split('T')[0],
      waste_type: `${selectedWaste.name} (${selectedWaste.condition})`,
      weight: parsedQty,
      price_per_kg: parseFloat(selectedWaste.price),
      nominal: parseFloat(totalRupiah),
      co2e_reduced: parseFloat(totalCo2e)
    };

    const { data, error } = await supabase.from('deposits').insert([newRecord]).select();
    if (!error && data) {
      onAddDeposit(data[0]);
      setLastSavedRecord(data[0]);
      setResidentName("");
      setQty("");
    } else {
      notify("Gagal mencatat setoran: " + error.message, "error");
    }
  };

  return (
    <AdminShell page="deposit" go={go} currentUser={currentUser}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", alignItems: "start" }}>
        <div>
          <h1 style={{ fontSize: "28px", color: "var(--forest)", marginBottom: "20px" }}>Catat Setoran Warga</h1>

          <div className="form-panel" style={{ background: "white", padding: "30px" }}>
            <form onSubmit={handleConfirmDeposit}>
              <div style={{ marginBottom: "16px", position: "relative" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--forest)" }}>Nama Warga Penabung (Kelurahan Patokan)</label>
                <input
                  type="text"
                  required
                  placeholder="Ketik nama warga (misal: Bu Ngateman / Sugeng)..."
                  value={residentName}
                  onChange={(e) => setResidentName(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--line)", fontSize: "14px" }}
                />
                {filteredNames.length > 0 && (
                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: "1px solid var(--line)", borderRadius: "8px", zIndex: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", maxHeight: "150px", overflowY: "auto" }}>
                    {filteredNames.map((n, idx) => (
                      <div
                        key={idx}
                        onClick={() => setResidentName(n)}
                        style={{ padding: "10px 14px", cursor: "pointer", borderBottom: "1px solid var(--paper)", fontSize: "14px" }}
                        onMouseEnter={(e) => e.target.style.background = "#f4f6f4"}
                        onMouseLeave={(e) => e.target.style.background = "white"}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--forest)" }}>Jenis Sampah</label>
                <select
                  value={wasteIdx}
                  onChange={(e) => setWasteIdx(parseInt(e.target.value))}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--line)", background: "white", fontSize: "14px" }}
                >
                  {prices.map((p, idx) => (
                    <option key={idx} value={idx}>{p.name} - {p.condition} ({rupiah(p.price)}/{p.unit})</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--forest)" }}>Berat / Timbangan ({selectedWaste?.unit})</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="Masukkan berat (contoh: 2.5)"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--line)", fontSize: "14px" }}
                />
              </div>

              <div style={{ padding: "18px", background: "var(--paper)", borderRadius: "12px", marginBottom: "20px" }}>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>Total Tabungan Warga (Rupiah):</span>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: "var(--green)" }}>{rupiah(totalRupiah)}</div>
              </div>

              <Button type="submit" variant="primary" style={{ width: "100%", padding: "14px" }}>Simpan Setoran Warga</Button>
            </form>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: "20px", color: "var(--forest)", marginBottom: "20px" }}>Bukti Nota Setoran Terakhir</h2>
          {lastSavedRecord ? (
            <div className="form-panel receipt-print" style={{ background: "white", padding: "30px", borderTop: "6px solid var(--forest)" }}>
              <div style={{ textAlign: "center", borderBottom: "2px dashed var(--line)", paddingBottom: "14px", marginBottom: "16px" }}>
                <b style={{ fontFamily: "Marcellus, serif", fontSize: "16px", color: "var(--forest)" }}>NOTA DIGITAL RESMI</b>
                <small style={{ display: "block", color: "var(--muted)", fontSize: "11px" }}>Bank Sampah Cahaya Kerja Patokan</small>
              </div>
              <div style={{ fontSize: "14px", display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Tanggal:</span> <b>{lastSavedRecord.deposit_date}</b></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Nama Warga:</span> <b>{lastSavedRecord.user_name}</b></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Jenis Sampah:</span> <b>{lastSavedRecord.waste_type}</b></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Berat Timbangan:</span> <b>{lastSavedRecord.weight} kg</b></div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--line)", paddingTop: "10px", fontSize: "16px" }}><span>Total Rupiah:</span> <b style={{ color: "var(--green)" }}>{rupiah(lastSavedRecord.nominal)}</b></div>
              </div>
              <Button variant="secondary" className="no-print" onClick={printReceipt} style={{ width: "100%" }}>
                <Icon name="printer" size={16} /> Cetak Nota Ini
              </Button>
            </div>
          ) : (
            <div className="form-panel" style={{ background: "white", padding: "40px", textAlign: "center", color: "var(--muted)" }}>
              <p>Belum ada setoran yang baru disimpan pada sesi ini. Silakan isi formulir di sebelah kiri dan klik simpan.</p>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function AdminPrices({ go, currentUser, prices, setPrices, newOrdersCount, newSembakoCount }) {
  const { notify, confirm: confirmAction } = useAppNotifications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [name, setName] = useState("");
  const [condition, setCondition] = useState("");
  const [unit, setUnit] = useState("kg");
  const [price, setPrice] = useState("");
  const [co2Factor, setCo2Factor] = useState("1.5");

  const handleOpenAdd = () => {
    setEditItem(null);
    setName("");
    setCondition("Bersih");
    setUnit("kg");
    setPrice("");
    setCo2Factor("1.5");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditItem(item);
    setName(item.name);
    setCondition(item.condition);
    setUnit(item.unit);
    setPrice(item.price);
    setCo2Factor(item.co2_factor || 1.5);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (await confirmAction("Hapus jenis sampah ini dari database?")) {
      const { error } = await supabase.from('prices').delete().eq('id', id);
      if (!error) {
        setPrices(prices.filter(p => p.id !== id));
      } else {
        notify("Gagal menghapus: " + error.message, "error");
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      name: name.trim(),
      condition: condition.trim(),
      unit: unit.trim(),
      price: parseFloat(price) || 0,
      co2_factor: parseFloat(co2Factor) || 1.2
    };

    if (editItem) {
      const { data, error } = await supabase.from('prices').update(payload).eq('id', editItem.id).select();
      if (!error && data) {
        setPrices(prices.map(p => p.id === editItem.id ? data[0] : p));
        setIsModalOpen(false);
      } else {
        notify("Gagal update: " + error.message, "error");
      }
    } else {
      const { data, error } = await supabase.from('prices').insert([payload]).select();
      if (!error && data) {
        setPrices([data[0], ...prices]);
        setIsModalOpen(false);
      } else {
        notify("Gagal menambah: " + error.message, "error");
      }
    }
  };

  return (
    <AdminShell page="admin_prices" go={go} currentUser={currentUser} newOrdersCount={newOrdersCount} newSembakoCount={newSembakoCount}>
      <div className="section-head" style={{ marginBottom: "20px", textAlign: "left" }}>
        <span className="kicker">Pengelolaan Komoditas Sampah</span>
        <h2>Daftar Harga</h2>
        <p>Tambah, ubah, atau hapus daftar harga beli sampah untuk warga secara fleksibel (Langsung tersimpan di database).</p>
      </div>

      <div style={{ textAlign: "right", marginBottom: "20px" }}>
        <Button variant="primary" onClick={handleOpenAdd}>+ Tambah Jenis Sampah</Button>
      </div>

      <div className="table-wrap" style={{ background: "white" }}>
        <table>
          <thead>
            <tr>
              <th>Jenis Sampah</th>
              <th>Kondisi / Keterangan</th>
              <th>Satuan</th>
              <th>Harga Beli</th>
              <th style={{ textAlign: "right" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((item, idx) => (
              <tr key={idx}>
                <td><b>{item.name}</b></td>
                <td>{item.condition}</td>
                <td>{item.unit}</td>
                <td><b style={{ color: "var(--green)" }}>{rupiah(item.price)}</b></td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: "8px" }}>
                    <button onClick={() => handleOpenEdit(item)} style={{ padding: "5px 10px", background: "white", border: "1px solid var(--line)", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} style={{ padding: "5px 10px", background: "#fff5f5", color: "#c53030", border: "1px solid #feb2b2", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "grid", placeItems: "center", zIndex: 10000, padding: "20px" }}>
          <div className="form-panel" style={{ maxWidth: "460px", width: "100%", padding: "30px", background: "white" }}>
            <h3 style={{ fontSize: "20px", color: "var(--forest)", marginBottom: "16px" }}>{editItem ? "Edit Komoditas Sampah" : "Tambah Komoditas Baru"}</h3>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Nama Sampah</label>
                <input type="text" required placeholder="Contoh: Aluminium Panci" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)" }} />
              </div>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Kondisi</label>
                <input type="text" required placeholder="Contoh: Bersih" value={condition} onChange={(e) => setCondition(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Satuan</label>
                  <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "white" }}>
                    <option value="kg">kg</option>
                    <option value="biji">biji</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Harga (Rp)</label>
                  <input type="number" required placeholder="15000" value={price} onChange={(e) => setPrice(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "14px" }}>
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
                <Button type="submit" variant="primary">Simpan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

function AdminGoldBatches({ go, currentUser, goldBatches, newOrdersCount, newSembakoCount }) {
  return (
    <AdminShell page="admin_gold" go={go} currentUser={currentUser} newOrdersCount={newOrdersCount} newSembakoCount={newSembakoCount}>
      <div className="section-head" style={{ marginBottom: "20px", textAlign: "left" }}>
        <span className="kicker">Kemitraan Resmi Pegadaian Situbondo</span>
        <h2>Batch Emas Pegadaian</h2>
        <p>Rekapitulasi berkas voucher kelipatan Rp 50.000 untuk disetorkan fisik oleh pengurus ke Pegadaian.</p>
      </div>

      <div className="table-wrap" style={{ background: "white" }}>
        <table>
          <thead>
            <tr>
              <th>Kode Voucher</th>
              <th>Nama Nasabah Warga</th>
              <th>Nominal Dikonversi</th>
              <th>Status Penyetoran Fisik</th>
            </tr>
          </thead>
          <tbody>
            {goldBatches.map((b, idx) => (
              <tr key={idx}>
                <td><b>{b.id}</b></td>
                <td>{b.user_name}</td>
                <td><b style={{ color: "var(--amber)" }}>{rupiah(b.amount)}</b></td>
                <td><span style={{ background: "#fefcbf", color: "#975a16", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600" }}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Button variant="secondary" onClick={() => window.print()}>
          <Icon name="printer" size={16} /> Cetak Lembar Batch Pegadaian
        </Button>
      </div>
    </AdminShell>
  );
}

function AdminReport({ go, currentUser, depositHistory, newOrdersCount, newSembakoCount }) {
  const [startDate, setStartDate] = useState("2026-10-01");
  const [endDate, setEndDate] = useState("2026-10-31");

  const filteredHistory = depositHistory.filter((row) => {
    if (!row.deposit_date) return true;
    return row.deposit_date >= startDate && row.deposit_date <= endDate;
  });

  return (
    <AdminShell page="admin_report" go={go} currentUser={currentUser} newOrdersCount={newOrdersCount} newSembakoCount={newSembakoCount}>
      <div className="section-head no-print" style={{ marginBottom: "20px", textAlign: "left" }}>
        <span className="kicker">Pelaporan Titik Pantau Adipura</span>
        <h2>Laporan Adipura/DLH</h2>
        <p>Filter berdasarkan rentang tanggal kalender dan cetak dokumen resmi untuk Dinas Lingkungan Hidup (DLH).</p>
      </div>

      <div className="form-panel no-print" style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "14px", background: "white" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px", color: "var(--muted)" }}>Dari Tanggal:</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "14px" }} />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px", color: "var(--muted)" }}>Sampai Tanggal:</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "14px" }} />
          </div>
        </div>
        <Button variant="primary" onClick={() => window.print()} style={{ padding: "10px 18px" }}>
          <Icon name="printer" size={16} /> Cetak Dokumen Laporan (PDF)
        </Button>
      </div>

      <div id="printable-report" style={{ background: "white", padding: "36px", borderRadius: "16px", border: "1px solid var(--line)" }}>
        <div style={{ textAlign: "center", borderBottom: "2px solid var(--forest)", paddingBottom: "16px", marginBottom: "20px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", color: "var(--forest)" }}>PEMERINTAH KABUPATEN SITUBONDO</h3>
          <h4 style={{ margin: "4px 0", fontSize: "16px" }}>DINAS LINGKUNGAN HIDUP • EVALUASI TITIK PANTAU ADIPURA</h4>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>Laporan Reduksi Sampah Bank Sampah Cahaya Kerja, Kelurahan Patokan</p>
          <small style={{ color: "var(--muted)" }}>Periode: {startDate} s.d. {endDate}</small>
        </div>

        <table style={{ width: "100%", fontSize: "13px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#edf4f0", textAlign: "left" }}>
              <th style={{ padding: "10px" }}>No</th>
              <th style={{ padding: "10px" }}>Tanggal</th>
              <th style={{ padding: "10px" }}>Nama Nasabah</th>
              <th style={{ padding: "10px" }}>Komoditas Terpilah</th>
              <th style={{ padding: "10px" }}>Tonase/Berat</th>
              <th style={{ padding: "10px" }}>Total Rupiah</th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length > 0 ? (
              filteredHistory.map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--line)" }}>
                  <td style={{ padding: "10px" }}>{i + 1}</td>
                  <td style={{ padding: "10px" }}>{row.deposit_date}</td>
                  <td style={{ padding: "10px" }}>{row.user_name}</td>
                  <td style={{ padding: "10px" }}>{row.waste_type}</td>
                  <td style={{ padding: "10px" }}>{row.weight} kg</td>
                  <td style={{ padding: "10px", color: "var(--green)", fontWeight: "bold" }}>{rupiah(row.nominal)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px", color: "var(--muted)" }}>Tidak ada data pada rentang tanggal tersebut.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", fontSize: "13px" }}>
          <div>
            Mengetahui,<br />
            <b>Ketua Bank Sampah Cahaya Kerja</b><br /><br /><br />
            ( Ibu Wayan )
          </div>
          <div style={{ textAlign: "right" }}>
            Situbondo, 27 Oktober 2026<br />
            <b>Petugas Pencatat Sistem</b><br /><br /><br />
            ( {currentUser?.name || "Ibu Ketua"} )
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingTargetPage, setPendingTargetPage] = useState(null);

  const [prices, setPrices] = useState([]);
  const [products, setProducts] = useState([]);
  const [depositHistory, setDepositHistory] = useState([]);
  const [goldBatches, setGoldBatches] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sembakoRequests, setSembakoRequests] = useState([]);

  useEffect(() => {
    async function fetchCloudData() {
      const { data: priceData } = await supabase.from('prices').select('*').order('id', { ascending: true });
      if (priceData && priceData.length > 0) setPrices(priceData);

      const { data: prodData } = await supabase.from('products_db').select('*').order('id', { ascending: true });
      if (prodData && prodData.length > 0) setProducts(prodData);

      const { data: depData } = await supabase.from('deposits').select('*').order('deposit_date', { ascending: false });
      if (depData) setDepositHistory(depData);

      const { data: goldData } = await supabase.from('gold_batches').select('*');
      if (goldData && goldData.length > 0) setGoldBatches(goldData);

      const { data: orderData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (orderData) setOrders(orderData);

      const { data: sembakoData } = await supabase.from('sembako_requests').select('*').order('created_at', { ascending: false });
      if (sembakoData) setSembakoRequests(sembakoData);
    }
    fetchCloudData();
  }, []);

  const totalCleanWasteKg = useMemo(() => {
    return depositHistory.reduce((acc, curr) => acc + parseFloat(curr.weight || 0), 0) + 211.1;
  }, [depositHistory]);

  const handleAddDeposit = (newRecord) => {
    setDepositHistory([newRecord, ...depositHistory]);
  };

  const handleApplyGold = (newBatch) => {
    setGoldBatches([newBatch, ...goldBatches]);
  };

  const handleApplySembako = (newReq) => {
    setSembakoRequests([newReq, ...sembakoRequests]);
  };

  const handleNewOrder = (newOrder) => {
    setOrders([newOrder, ...orders]);
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

    if (["admin", "deposit", "admin_prices", "admin_products", "admin_gold", "admin_report", "admin_orders", "admin_sembako"].includes(target)) {
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
    <AppNotificationsProvider>
    <>
      <style>{`
        @media print {
          .no-print, aside, header, footer, .btn {
            display: none !important;
          }
          body, main, .admin-main {
            padding: 0 !important;
            background: white !important;
            overflow: visible !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          #printable-report {
            border: none !important;
            padding: 20px !important;
            box-shadow: none !important;
            width: 100% !important;
          }
          body.printing-receipt * {
            visibility: hidden !important;
          }
          body.printing-receipt .receipt-print,
          body.printing-receipt .receipt-print * {
            visibility: visible !important;
          }
          body.printing-receipt .receipt-print {
            position: fixed !important;
            inset: 0 auto auto 0 !important;
            width: 80mm !important;
            max-width: 80mm !important;
            margin: 0 !important;
            padding: 8mm !important;
            border: 1px solid #dfe5df !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            background: white !important;
          }
          body.printing-receipt .receipt-print .no-print {
            display: none !important;
          }
        }
      `}</style>
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
        if (page === "home") return <Home go={go} products={products} totalCleanWasteKg={totalCleanWasteKg} />;
        if (page === "admin") return <Admin go={go} currentUser={currentUser} depositHistory={depositHistory} orders={orders} goldBatches={goldBatches} sembakoRequests={sembakoRequests} />;
        if (page === "deposit") return <Deposit go={go} currentUser={currentUser} prices={prices} depositHistory={depositHistory} onAddDeposit={handleAddDeposit} />;

        if (page === "admin_prices") {
          return <AdminPrices go={go} currentUser={currentUser} prices={prices} setPrices={setPrices} newOrdersCount={orders.filter(o => o.status === 'Baru').length} newSembakoCount={sembakoRequests.filter(s => s.status === 'Menunggu Konfirmasi').length} />;
        }
        if (page === "admin_products") {
          return (
            <AdminShell page="admin_products" go={go} currentUser={currentUser} newOrdersCount={orders.filter(o => o.status === 'Baru').length} newSembakoCount={sembakoRequests.filter(s => s.status === 'Menunggu Konfirmasi').length}>
              <ProductGridView products={products} />
            </AdminShell>
          );
        }
        if (page === "admin_orders") {
          return <AdminOrders go={go} currentUser={currentUser} orders={orders} setOrders={setOrders} newOrdersCount={orders.filter(o => o.status === 'Baru').length} newSembakoCount={sembakoRequests.filter(s => s.status === 'Menunggu Konfirmasi').length} />;
        }
        if (page === "admin_sembako") {
          return <AdminSembako go={go} currentUser={currentUser} sembakoRequests={sembakoRequests} setSembakoRequests={setSembakoRequests} newOrdersCount={orders.filter(o => o.status === 'Baru').length} newSembakoCount={sembakoRequests.filter(s => s.status === 'Menunggu Konfirmasi').length} />;
        }
        if (page === "admin_gold") {
          return <AdminGoldBatches go={go} currentUser={currentUser} goldBatches={goldBatches} newOrdersCount={orders.filter(o => o.status === 'Baru').length} newSembakoCount={sembakoRequests.filter(s => s.status === 'Menunggu Konfirmasi').length} />;
        }
        if (page === "admin_report") {
          return <AdminReport go={go} currentUser={currentUser} depositHistory={depositHistory} newOrdersCount={orders.filter(o => o.status === 'Baru').length} newSembakoCount={sembakoRequests.filter(s => s.status === 'Menunggu Konfirmasi').length} />;
        }

        if (page === "prices") return <Prices go={go} currentUser={currentUser} logout={handleLogout} prices={prices} />;
        if (page === "products") return <Products go={go} currentUser={currentUser} logout={handleLogout} products={products} onNewOrder={handleNewOrder} />;
        if (page === "resident") return <Resident go={go} currentUser={currentUser} logout={handleLogout} depositHistory={depositHistory} onApplyGold={handleApplyGold} onApplySembako={handleApplySembako} sembakoRequests={sembakoRequests} />;
        return <Home go={go} products={products} totalCleanWasteKg={totalCleanWasteKg} />;
      }, [page, currentUser, pendingTargetPage, prices, products, depositHistory, goldBatches, orders, sembakoRequests, totalCleanWasteKg])}
    </>
    </AppNotificationsProvider>
  );
}