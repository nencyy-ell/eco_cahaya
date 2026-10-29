import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gddiajhvpdvuqiljcasv.supabase.co';
const supabaseAnonKey = 'sb_publishable_-TN3qHMF8WNr1nk5pxS8HQ_owPmkcsy';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AppNotificationsContext = createContext(null);
const heroImage = "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80";
const defaultBankSettings = {
  whatsapp_number: "6285739913054",
  address: "Jl. PB Sudirman Gang Cendana RT 01/RW 01, Karang Asem, Kelurahan Patokan, Kabupaten Situbondo",
  operating_hours: "08.30–20.00",
  gold_minimum: 50000,
  gold_increment: 50000,
  deposit_terms: "Setoran ditimbang dan dicatat oleh pengurus sesuai daftar harga yang berlaku.",
  sembako_terms: "Nilai penukaran mengikuti permintaan warga dan tidak melebihi saldo tersedia."
};
const protectedPages = ["admin", "deposit", "admin_prices", "admin_products", "admin_inventory", "admin_sales", "admin_gold", "admin_report", "admin_orders", "admin_sembako", "admin_accounts", "admin_settings"];

const rupiah = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");
const whatsappUrl = (number, message = "") => {
  const phone = String(number || "").replace(/\D/g, "");
  return phone ? `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ""}` : null;
};
const dateInputValue = (date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

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
        <Button variant="ghost" onClick={() => go("admin")} style={{ color: "var(--forest)", fontWeight: "600", padding: "10px 12px" }}>
          Pengurus
        </Button>
        <button type="button" aria-label="Muat ulang data" title="Muat ulang data terbaru" onClick={() => window.location.reload()} style={{ border: "1px solid var(--line)", background: "white", color: "var(--forest)", borderRadius: "999px", padding: "9px 12px" }}>↻</button>
      </div>
    </header>
  );
}

function Footer({ settings = defaultBankSettings }) {
  const contactUrl = whatsappUrl(settings.whatsapp_number, "Halo, saya ingin bertanya tentang Bank Sampah Cahaya Kerja.");
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
          <p style={{ fontSize: "14px", color: "#a4c2b5", lineHeight: "1.5" }}>{settings.address}<br />Jam layanan: {settings.operating_hours}</p>
        </div>
        <div>
          <h4 style={{ color: "white", marginBottom: "14px", fontSize: "15px" }}>Hubungi Pengurus</h4>
          {contactUrl ? <a href={contactUrl} target="_blank" rel="noreferrer" style={{ fontSize: "14px", color: "#a4c2b5", lineHeight: "1.5" }}>WhatsApp: +{settings.whatsapp_number}</a> : <p style={{ color: "#a4c2b5" }}>Kontak belum tersedia.</p>}
        </div>
      </div>
      <div style={{ maxWidth: "1300px", margin: "0 auto", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "20px", display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#a4c2b5" }}>
        <span>© 2026 ECO-CAHAYA. Hak cipta dilindungi.</span>
        <span>UINIC 8.0 Web Development</span>
      </div>
    </footer>
  );
}

function LoginPage({
  go,
  targetPage,
  onLogin,
  onRegister,
  onForgotPassword,
  onUpdatePassword,
  isPasswordRecovery,
  onPasswordResetComplete
}) {
  const isResidentPortal = targetPage === "resident";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [passwordResetComplete, setPasswordResetComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);
    try {
      if (isPasswordRecovery && !passwordResetComplete) {
        if (password.length < 8) throw new Error("Kata sandi baru minimal 8 karakter.");
        if (password !== confirmPassword) throw new Error("Konfirmasi kata sandi tidak sama.");
        await onUpdatePassword(password);
        await onPasswordResetComplete();
        setPasswordResetComplete(true);
        setPassword("");
        setConfirmPassword("");
        setSuccessMsg("Kata sandi berhasil diperbarui. Silakan masuk dengan kata sandi baru.");
      } else if (isForgotPassword) {
        await onForgotPassword({ email: email.trim(), targetPage });
        setSuccessMsg("Jika email terdaftar, tautan untuk mengatur ulang kata sandi akan dikirim. Periksa kotak masuk dan folder spam.");
        setIsForgotPassword(false);
      } else if (isRegistering) {
        await onRegister({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
        setSuccessMsg("Pendaftaran berhasil. Akun warga langsung aktif, silakan masuk dengan email dan kata sandi.");
        setIsRegistering(false);
      } else {
        await onLogin({ email: email.trim(), password, targetPage });
        go(targetPage);
      }
    } catch (error) {
      setErrorMsg(error.message || "Tidak dapat memproses permintaan.");
    } finally {
      setIsSubmitting(false);
    }
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
            {isPasswordRecovery && !passwordResetComplete
              ? "Atur Kata Sandi Baru"
              : isForgotPassword
                ? "Lupa Kata Sandi"
                : isResidentPortal
                  ? "Cek Tabungan Warga"
                  : "Masuk Pengurus Bank Sampah"}
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "13px", marginBottom: "20px" }}>
            {isPasswordRecovery && !passwordResetComplete
              ? "Buat kata sandi baru minimal 8 karakter."
              : isForgotPassword
                ? "Masukkan email akun. Kami akan mengirim tautan untuk mengatur ulang kata sandi."
                : isResidentPortal
                  ? "Masuk dengan email dan kata sandi. Akun warga baru langsung aktif setelah mendaftar."
                  : "Masuk menggunakan akun pengurus yang telah diaktifkan di sistem."}
          </p>

          {(errorMsg || successMsg) && (
            <div style={{ padding: "10px 14px", background: "#fff5f5", color: "#c53030", borderRadius: "8px", fontSize: "13px", marginBottom: "16px", border: "1px solid #feb2b2", textAlign: "left" }}>
              <span style={{ color: successMsg && !errorMsg ? "var(--green)" : "#c53030" }}>{errorMsg || successMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
            {isRegistering && (
              <>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--forest)" }}>Nama sesuai buku tabungan</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: "100%", padding: "12px", marginBottom: "14px", borderRadius: "10px", border: "1px solid var(--line)" }} />
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--forest)" }}>Nomor WhatsApp</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: "100%", padding: "12px", marginBottom: "14px", borderRadius: "10px", border: "1px solid var(--line)" }} />
              </>
            )}
            {!isPasswordRecovery && !passwordResetComplete && (
              <>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--forest)" }}>Email</label>
                <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: "100%", padding: "12px", marginBottom: "14px", borderRadius: "10px", border: "1px solid var(--line)" }} />
              </>
            )}

            {!isForgotPassword && !passwordResetComplete && (
            <div style={{ marginBottom: "20px", position: "relative" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px", color: "var(--forest)" }}>
                  {isPasswordRecovery ? "Kata sandi baru (minimal 8 karakter)" : `Kata sandi ${isRegistering ? "(minimal 8 karakter)" : ""}`}
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete={isRegistering || isPasswordRecovery ? "new-password" : "current-password"}
                    minLength={8}
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
                {isPasswordRecovery && (
                  <>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "600", margin: "14px 0 6px", color: "var(--forest)" }}>Ulangi kata sandi baru</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--line)", fontSize: "14px", boxSizing: "border-box" }}
                    />
                  </>
                )}
            </div>
            )}

            {!passwordResetComplete && (
              <Button type="submit" variant="primary" style={{ width: "100%", padding: "14px", fontSize: "15px" }}>
                {isSubmitting
                  ? "Memproses..."
                  : isPasswordRecovery
                    ? "Simpan Kata Sandi Baru"
                    : isForgotPassword
                      ? "Kirim Tautan Reset"
                      : isRegistering
                        ? "Daftar Akun Warga"
                        : "Masuk"}
              </Button>
            )}
            {passwordResetComplete && (
              <Button type="button" variant="primary" onClick={() => { setPasswordResetComplete(false); setSuccessMsg(""); }} style={{ width: "100%", padding: "14px", fontSize: "15px" }}>
                Kembali ke Masuk
              </Button>
            )}
            {!isPasswordRecovery && !passwordResetComplete && !isRegistering && !isForgotPassword && (
              <button type="button" onClick={() => { setIsForgotPassword(true); setErrorMsg(""); setSuccessMsg(""); }} style={{ display: "block", margin: "14px auto 0", border: 0, background: "transparent", color: "var(--forest)", textDecoration: "underline" }}>
                Lupa kata sandi?
              </button>
            )}
            {isResidentPortal && !isPasswordRecovery && !isForgotPassword && !passwordResetComplete && (
              <button type="button" onClick={() => { setIsRegistering(!isRegistering); setErrorMsg(""); setSuccessMsg(""); }} style={{ display: "block", margin: "16px auto 0", border: 0, background: "transparent", color: "var(--forest)", textDecoration: "underline" }}>
                {isRegistering ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar warga"}
              </button>
            )}
            {isForgotPassword && (
              <button type="button" onClick={() => { setIsForgotPassword(false); setErrorMsg(""); setSuccessMsg(""); }} style={{ display: "block", margin: "16px auto 0", border: 0, background: "transparent", color: "var(--forest)", textDecoration: "underline" }}>
                Kembali ke masuk
              </button>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Home({ go, products, totalCleanWasteKg, settings = defaultBankSettings }) {
  const contactUrl = whatsappUrl(settings.whatsapp_number, "Halo, saya ingin bertanya tentang cara menyetor sampah.");
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
                <small style={{ color: "var(--muted)", fontSize: "12px" }}>Total berat setoran yang tercatat</small>
              </div>
            </div>
          </div>
        </section>

        <section className="section" style={{ padding: "30px 40px 10px" }}>
          <div className="section-head">
            <span className="kicker">Mudah, jelas, dan tercatat</span>
            <h2>Cara Menyetor Sampah</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {[
              ["1. Pilah", "Pisahkan sampah sesuai jenis dan kondisi pada daftar harga."],
              ["2. Datang ke bank sampah", `Kunjungi alamat kami pada jam layanan ${settings.operating_hours}.`],
              ["3. Timbang dan catat", settings.deposit_terms],
              ["4. Gunakan tabungan", `Tukar menjadi emas mulai ${rupiah(Number(settings.gold_minimum))} atau ajukan sembako sesuai saldo.`]
            ].map(([title, detail]) => (
              <div key={title} className="form-panel" style={{ background: "white", padding: "22px" }}>
                <h3 style={{ color: "var(--forest)", fontSize: "17px", marginBottom: "8px" }}>{title}</h3>
                <p style={{ color: "var(--muted)", fontSize: "14px", lineHeight: 1.6 }}>{detail}</p>
              </div>
            ))}
          </div>
          <div className="form-panel" style={{ background: "white", padding: "22px", marginTop: "16px", display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <h3 style={{ color: "var(--forest)", fontSize: "17px", marginBottom: "6px" }}>Lokasi dan jam layanan</h3>
              <p style={{ color: "var(--muted)", fontSize: "14px" }}>{settings.address}<br />Jam layanan: {settings.operating_hours}</p>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <a className="btn btn-secondary" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`} target="_blank" rel="noreferrer">Lihat peta</a>
              {contactUrl && <a className="btn btn-primary" href={contactUrl} target="_blank" rel="noreferrer">Tanya via WhatsApp</a>}
            </div>
          </div>
          <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "12px" }}>{settings.sembako_terms}</p>
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
      <Footer settings={settings} />
    </div>
  );
}

function Prices({ go, currentUser, logout, prices, settings }) {
  const [q, setQ] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const filtered = prices.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.condition.toLowerCase().includes(q.toLowerCase()));
  const pageCount = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const visiblePrices = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                onChange={(e) => {
                  setQ(e.target.value);
                  setCurrentPage(1);
                }}
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
              {visiblePrices.map((item, idx) => (
                <tr key={idx}>
                  <td><b>{item.name}</b></td>
                  <td>{item.condition}</td>
                  <td>{item.unit}</td>
                  <td><b style={{ color: "var(--green)" }}>{rupiah(item.price)}</b></td>
                </tr>
              ))}
              {visiblePrices.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>
                    Tidak ada jenis sampah yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > itemsPerPage && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginTop: "16px" }}>
            <span style={{ color: "var(--muted)", fontSize: "13px" }}>
              Menampilkan {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} dari {filtered.length} jenis sampah
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Button variant="secondary" disabled={currentPage === 1} onClick={() => setCurrentPage((page) => page - 1)}>Sebelumnya</Button>
              <span style={{ color: "var(--muted)", fontSize: "13px" }}>Halaman {currentPage} dari {pageCount}</span>
              <Button variant="secondary" disabled={currentPage === pageCount} onClick={() => setCurrentPage((page) => page + 1)}>Berikutnya</Button>
            </div>
          </div>
        )}
      </div>
      <Footer settings={settings} />
    </div>
  );
}

function Products({ go, currentUser, logout, products, onNewOrder, settings }) {
  const { notify } = useAppNotifications();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("ambil");
  const [shippingAddress, setShippingAddress] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone || Number(quantity) < 1 || Number(quantity) > Number(selectedProduct.stock || 0)) return;
    if (shippingMethod === "kirim" && !shippingAddress) return;

    const newOrder = {
      product_name: selectedProduct.title,
      product_id: selectedProduct.id,
      quantity: Number(quantity),
      buyer_name: buyerName.trim(),
      buyer_phone: buyerPhone.trim(),
      shipping_address: shippingMethod === "ambil" ? "Diambil Langsung ke Bank Sampah" : `Dikirim ke: ${shippingAddress.trim()}`,
      status: "Baru"
    };

    const { error } = await supabase.from('orders').insert([newOrder]);
    if (!error) {
      onNewOrder({ product_id: newOrder.product_id, quantity: newOrder.quantity });
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
                  <div><span className="price">{item.price_tag}</span><small style={{ display: "block", color: "var(--muted)" }}>Stok tersedia: {item.stock || 0}</small></div>
                  <Button variant="primary" disabled={!item.stock || item.stock < 1} onClick={() => { setSelectedProduct(item); setQuantity(1); }}>{item.stock > 0 ? "Pesan Sekarang" : "Stok Habis"}</Button>
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
              <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "12px" }}>Stok tersedia: {selectedProduct.stock}</p>

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
                    <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Jumlah</label>
                    <input type="number" min="1" max={selectedProduct.stock} required value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "14px" }} />
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
      <Footer settings={settings} />
    </div>
  );
}

function Resident({ go, currentUser, logout, depositHistory, redemptionRequests, residentBalance, onApplyRedemption, settings }) {
  const { notify } = useAppNotifications();
  const currentResidentName = currentUser?.name || "";
  const userDeposits = depositHistory.filter(
    (d) => d.user_name.toLowerCase() === currentResidentName.toLowerCase()
  );
  const userRedemptions = redemptionRequests.filter((request) => request.user_id === currentUser?.id);
  const totalUserBalance = residentBalance ?? 0;
  const [goldAmount, setGoldAmount] = useState(Number(settings.gold_minimum));
  const [sembakoAmount, setSembakoAmount] = useState("");
  const [sembakoDetails, setSembakoDetails] = useState("");
  
  let badgeTier = "Warga Peduli Lingkungan";
  let badgeColor = "#2d7a54";
  if (totalUserBalance >= 50000) {
    badgeTier = "Pejuang Lingkungan Lestari";
    badgeColor = "#2b6cb0";
  }

  const [selectedNota, setSelectedNota] = useState(null);

  const handleApplyGold = async (e) => {
    e.preventDefault();
    if (Number(goldAmount) < Number(settings.gold_minimum) || Number(goldAmount) > totalUserBalance) {
      notify("Nominal emas harus memenuhi batas minimal dan tidak boleh melebihi saldo tersedia.", "error");
      return;
    }

    try {
      await onApplyRedemption({
        redemption_type: "gold",
        amount: Number(goldAmount),
        item_details: "Konversi tabungan emas Pegadaian",
        quantity: 1
      });
      notify("Pengajuan emas terkirim. Saldo sudah ditahan dan status dapat dipantau di bawah.", "success");
    } catch (error) {
      notify(`Gagal mengajukan emas: ${error.message}`, "error");
    }
  };

  const handleApplySembako = async (e) => {
    e.preventDefault();
    if (Number(sembakoAmount) <= 0 || Number(sembakoAmount) > totalUserBalance || !sembakoDetails.trim()) {
      notify("Isi kebutuhan sembako dan nominal yang tidak melebihi saldo tersedia.", "error");
      return;
    }

    try {
      await onApplyRedemption({
        redemption_type: "sembako",
        amount: Number(sembakoAmount),
        item_details: sembakoDetails.trim(),
        quantity: 1
      });
      setSembakoAmount("");
      setSembakoDetails("");
      notify("Pengajuan sembako terkirim. Saldo sudah ditahan sampai pengajuan disetujui atau ditolak.", "success");
    } catch (error) {
      notify(`Gagal mengajukan sembako: ${error.message}`, "error");
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
              <p style={{ color: "var(--muted)", fontSize: "12px", marginBottom: "16px" }}>Minimal {rupiah(Number(settings.gold_minimum))}, dengan kelipatan {rupiah(Number(settings.gold_increment))}. Saldo yang diajukan langsung ditahan.</p>
            </div>
            <form onSubmit={handleApplyGold}>
              <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Nominal penukaran</label>
              <input type="number" min={settings.gold_minimum} step={settings.gold_increment} max={totalUserBalance} value={goldAmount} onChange={(e) => setGoldAmount(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: "1px solid var(--line)" }} />
              <Button type="submit" variant="primary" disabled={totalUserBalance < Number(settings.gold_minimum)} style={{ width: "100%", padding: "12px" }}>Ajukan Tukar Emas</Button>
            </form>
          </div>

          <div className="form-panel" style={{ padding: "24px", background: "white", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontSize: "17px", color: "var(--forest)", marginBottom: "6px" }}>Tukar Saldo Jadi Sembako</h3>
              <p style={{ color: "var(--muted)", fontSize: "12px", marginBottom: "16px" }}>{settings.sembako_terms} Pengurus akan mengonfirmasi ketersediaan barang.</p>
            </div>
            <form onSubmit={handleApplySembako}>
              <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Barang yang diminta</label>
              <input type="text" required value={sembakoDetails} onChange={(e) => setSembakoDetails(e.target.value)} placeholder="Contoh: beras 5 kg, minyak 1 liter" style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: "1px solid var(--line)" }} />
              <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>Nominal saldo yang digunakan</label>
              <input type="number" min="1" max={totalUserBalance} required value={sembakoAmount} onChange={(e) => setSembakoAmount(e.target.value)} style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "8px", border: "1px solid var(--line)" }} />
              <Button type="submit" variant="secondary" disabled={totalUserBalance <= 0} style={{ width: "100%", padding: "12px", borderColor: "var(--forest)", color: "var(--forest)" }}>Ajukan Penukaran Sembako</Button>
            </form>
          </div>
        </div>

        {userRedemptions.length > 0 && (
          <div className="form-panel" style={{ marginBottom: "24px", padding: "20px", background: "white" }}>
            <h4 style={{ fontSize: "15px", color: "var(--forest)", marginBottom: "10px" }}>Status Penukaran Saldo</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {userRedemptions.map((req) => (
                <div key={req.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--paper)", borderRadius: "8px", fontSize: "13px" }}>
                  <span>{req.redemption_type === "gold" ? "Emas" : "Sembako"} — {req.item_details}: <b>{rupiah(Number(req.amount))}</b></span>
                  <span style={{
                    background: req.status === 'Selesai' ? '#eef7f0' : req.status === 'Ditolak' ? '#fff5f5' : '#fefcbf',
                    color: req.status === 'Selesai' ? 'var(--green)' : req.status === 'Ditolak' ? '#c53030' : '#975a16',
                    padding: "4px 10px", borderRadius: "999px", fontWeight: "600", fontSize: "12px"
                  }}>
                    {req.status}{req.rejection_reason ? `: ${req.rejection_reason}` : ""}
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

      <Footer settings={settings} />
    </div>
  );
}

// Layout Admin Bersih Tanpa Duplikasi Sidebar
function AdminShell({ page, go, currentUser, children, newOrdersCount, newSembakoCount }) {
  const { notify } = useAppNotifications();
  const sideItems = [
    ["Dashboard", "admin"],
    ["Catat Setoran", "deposit"],
    ["Pesanan Masuk", "admin_orders"],
    ["Pengajuan Sembako", "admin_sembako"],
    ["Daftar Harga", "admin_prices"],
    ["Stok Produk", "admin_products"],
    ["Rekap Bank Sampah", "admin_inventory"],
    ["Rekap Penjualan", "admin_sales"],
    ["Batch Emas Pegadaian", "admin_gold"],
    ["Laporan Adipura/DLH", "admin_report"],
    ["Akun Warga", "admin_accounts"],
    ["Info Bank Sampah", "admin_settings"]
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
        <div style={{ padding: "0 20px", display: "grid", gap: "8px" }}>
          <button
            onClick={() => go("home")}
            style={{
              background: "rgba(232, 160, 152, 0.15)", color: "#e8a098", border: "none", width: "100%",
              padding: "12px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "14px", textAlign: "left", paddingLeft: "16px"
            }}
          >
            ← Keluar ke Beranda
          </button>
          <button
            onClick={async () => {
              const { error } = await supabase.auth.signOut();
              if (error) {
                notify(`Gagal keluar: ${error.message}`, "error");
                return;
              }
              go("home");
            }}
            style={{ background: "transparent", color: "#c2d6ce", border: "1px solid rgba(255,255,255,0.2)", width: "100%", padding: "10px", borderRadius: "8px", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}
          >
            Keluar dari akun
          </button>
        </div>
      </aside>
      <main className="admin-main" style={{ background: "var(--paper)", padding: "40px", overflowY: "auto" }}>
        <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
          <Button variant="secondary" onClick={() => window.location.reload()}>↻ Segarkan data</Button>
        </div>
        {children}
      </main>
    </div>
  );
}

function Admin({ go, currentUser, depositHistory, orders, redemptionRequests }) {
  const totalWeightLogged = depositHistory.reduce((sum, d) => sum + parseFloat(d.weight || 0), 0);
  const newOrders = orders.filter((o) => o.status === "Baru");
  const pendingRedemptions = redemptionRequests.filter((request) => request.status === "Menunggu Konfirmasi");
  const completedSales = orders.filter((order) => order.status === "Selesai");
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthSales = completedSales.filter((order) => (order.completed_at || order.created_at)?.startsWith(currentMonth));
  const dailyWeights = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dateKey = dateInputValue(date);
    const weight = depositHistory.filter((record) => record.deposit_date === dateKey)
      .reduce((sum, record) => sum + Number(record.weight || 0), 0);
    return { label: date.toLocaleDateString("id-ID", { day: "numeric", month: "short" }), weight };
  });
  const maxDailyWeight = Math.max(1, ...dailyWeights.map((day) => day.weight));
  const reportTotals = depositHistory.reduce((groups, record) => {
    const type = record.waste_type || "Tidak diketahui";
    groups[type] = groups[type] || { weight: 0, nominal: 0 };
    groups[type].weight += Number(record.weight || 0);
    groups[type].nominal += Number(record.nominal || 0);
    return groups;
  }, {});

  return (
    <AdminShell page="admin" go={go} currentUser={currentUser} newOrdersCount={newOrders.length} newSembakoCount={pendingRedemptions.length}>
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

      {pendingRedemptions.length > 0 && (
        <div style={{ padding: "16px 20px", background: "#fefcbf", border: "1px solid #f6e05e", borderRadius: "12px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#975a16" }}>
            <Icon name="bell" size={20} />
            <b>Ada {pendingRedemptions.length} pengajuan penukaran saldo menunggu konfirmasi.</b>
          </div>
          <Button variant="primary" onClick={() => go("admin_sembako")} style={{ fontSize: "13px", padding: "8px 14px", background: "#975a16" }}>Cek Sembako</Button>
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
          <span className="kicker">Penjualan selesai bulan ini</span>
          <h2 style={{ fontSize: "32px", color: "var(--green)", marginTop: "8px" }}>{rupiah(monthSales.reduce((sum, order) => sum + Number(order.total_amount || 0), 0))}</h2>
          <small style={{ color: "var(--muted)" }}>{monthSales.length} transaksi selesai</small>
        </div>
      </div>

      <div className="form-panel" style={{ background: "white", padding: "24px", marginBottom: "24px" }}>
        <h3 style={{ color: "var(--forest)", marginBottom: "18px" }}>Berat setoran 7 hari terakhir</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "12px", alignItems: "end", minHeight: "180px" }}>
          {dailyWeights.map((day) => (
            <div key={day.label} style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "end", height: "170px", gap: "7px" }}>
              <small>{day.weight.toFixed(1)} kg</small>
              <div title={`${day.weight.toFixed(1)} kg`} style={{ height: `${Math.max(4, day.weight / maxDailyWeight * 120)}px`, background: "var(--leaf)", borderRadius: "8px 8px 0 0" }} />
              <small>{day.label}</small>
            </div>
          ))}
        </div>
      </div>

      <div id="dashboard-deposits" className="form-panel" style={{ background: "white", padding: "20px", marginBottom: "24px" }}>
        <h3 style={{ color: "var(--forest)", marginBottom: "14px" }}>Setoran warga terbaru</h3>
        <div className="table-wrap">
          <table><thead><tr><th>Tanggal</th><th>Nama</th><th>Jenis sampah</th><th>Berat</th><th>Nilai</th></tr></thead>
            <tbody>{depositHistory.slice(0, 5).map((record) => <tr key={record.id}><td>{record.deposit_date}</td><td>{record.user_name}</td><td>{record.waste_type}</td><td>{record.weight} kg</td><td>{rupiah(Number(record.nominal || 0))}</td></tr>)}
              {depositHistory.length === 0 && <tr><td colSpan="5">Belum ada data setoran.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div id="dashboard-report" className="form-panel" style={{ background: "white", padding: "20px", marginBottom: "24px" }}>
        <h3 style={{ color: "var(--forest)", marginBottom: "14px" }}>Data reduksi sampah untuk laporan Adipura/DLH</h3>
        <div className="table-wrap">
          <table><thead><tr><th>Komoditas</th><th>Total berat tercatat</th><th>Nilai setoran tercatat</th></tr></thead><tbody>
            {Object.entries(reportTotals).map(([type, total]) => <tr key={type}><td>{type}</td><td>{total.weight.toFixed(2)} kg</td><td>{rupiah(total.nominal)}</td></tr>)}
            {Object.keys(reportTotals).length === 0 && <tr><td colSpan="3">Belum ada data untuk laporan.</td></tr>}
          </tbody></table>
        </div>
      </div>

      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        <Button variant="secondary" onClick={() => document.getElementById("dashboard-deposits")?.scrollIntoView({ behavior: "smooth" })}>Lihat catatan setoran</Button>
        <Button variant="secondary" onClick={() => document.getElementById("dashboard-report")?.scrollIntoView({ behavior: "smooth" })}>Lihat data Adipura</Button>
        <Button onClick={() => go("deposit")}>+ Catat Setoran Warga</Button>
        <Button variant="secondary" onClick={() => go("admin_inventory")}>Lihat Rekap Stok Sampah</Button>
        <Button variant="secondary" onClick={() => go("admin_sales")}>Lihat Rekap Penjualan</Button>
      </div>
    </AdminShell>
  );
}

function AdminOrders({ go, currentUser, orders, setOrders, products, setProducts, newOrdersCount, newSembakoCount }) {
  const { notify, confirm: confirmAction } = useAppNotifications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleMarkStatus = async (id, newStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (!error) {
      setOrders((items) => items.map((o) => o.id === id ? { ...o, status: newStatus } : o));
      const order = orders.find((item) => item.id === id);
      if (newStatus === "Ditolak" && order?.product_id) {
        const { data: product, error: productError } = await supabase.from("products_db").select("id,stock").eq("id", order.product_id).single();
        if (productError) notify(`Status diperbarui, tetapi stok terbaru gagal dimuat: ${productError.message}`, "error");
        else setProducts((items) => items.map((item) => item.id === product.id ? { ...item, stock: product.stock } : item));
      }
    } else {
      notify("Gagal memperbarui status: " + error.message, "error");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (await confirmAction("Hapus pesanan ini dari daftar?")) {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (!error) {
        const order = orders.find((item) => item.id === id);
        setOrders((items) => items.filter((o) => o.id !== id));
        if (order?.inventory_reserved && order.status !== "Selesai" && order.product_id) {
          const { data: product, error: productError } = await supabase.from("products_db").select("id,stock").eq("id", order.product_id).single();
          if (productError) notify(`Pesanan dihapus, tetapi stok terbaru gagal dimuat: ${productError.message}`, "error");
          else setProducts((items) => items.map((item) => item.id === product.id ? { ...item, stock: product.stock } : item));
        }
      } else {
        notify("Gagal menghapus: " + error.message, "error");
      }
    }
  };

  const handleManualOrder = async (e) => {
    e.preventDefault();
    const newOrd = {
      product_name: productName.trim(),
      product_id: productId,
      quantity: Number(quantity),
      buyer_name: buyerName.trim(),
      buyer_phone: buyerPhone.trim(),
      shipping_address: address.trim(),
      status: "Baru"
    };
    const { data, error } = await supabase.from('orders').insert([newOrd]).select().single();
    if (!error && data) {
      setOrders((items) => [data, ...items]);
      const { data: updatedProduct, error: productError } = await supabase.from("products_db").select("id,stock").eq("id", data.product_id).single();
      if (productError) notify(`Pesanan tersimpan, tetapi stok terbaru gagal dimuat: ${productError.message}`, "error");
      else setProducts((items) => items.map((item) => item.id === updatedProduct.id ? { ...item, stock: updatedProduct.stock } : item));
      setIsModalOpen(false);
      setProductName("");
      setBuyerName("");
      setBuyerPhone("");
      setAddress("");
      setProductId("");
      setQuantity(1);
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
              <th>Jumlah</th>
              <th>Total</th>
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
                  <td>{o.quantity || 1}</td>
                  <td>{rupiah(Number(o.total_amount || 0))}</td>
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
                      {(o.status === 'Baru' || o.status === 'Diproses') && (
                        <button onClick={() => handleMarkStatus(o.id, 'Selesai')} style={{ padding: "5px 10px", background: "var(--forest)", color: "white", border: 0, borderRadius: "6px", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}>Selesai</button>
                      )}
                      {o.status !== 'Ditolak' && o.status !== 'Selesai' && (
                        <button onClick={() => handleMarkStatus(o.id, 'Ditolak')} style={{ padding: "5px 10px", background: "#fff5f5", color: "#c53030", border: "1px solid #feb2b2", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>Tolak</button>
                      )}
                      {whatsappUrl(o.buyer_phone, `Halo ${o.buyer_name}, status pesanan ${o.product_name} (${o.quantity || 1} pcs) Anda: ${o.status}.` ) && (
                        <a href={whatsappUrl(o.buyer_phone, `Halo ${o.buyer_name}, status pesanan ${o.product_name} (${o.quantity || 1} pcs) Anda: ${o.status}.`)} target="_blank" rel="noreferrer" style={{ padding: "5px 8px", background: "#e6f4ea", color: "#137333", borderRadius: "6px", fontSize: "11px", textDecoration: "none" }}>WhatsApp</a>
                      )}
                      <button onClick={() => handleDeleteOrder(o.id)} style={{ padding: "5px 8px", background: "#fff5f5", color: "#c53030", border: "1px solid #feb2b2", borderRadius: "6px", fontSize: "11px", cursor: "pointer" }}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", color: "var(--muted)", padding: "24px" }}>
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
                <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Produk</label>
                <select required value={productId} onChange={(e) => { setProductId(e.target.value); setProductName(products.find((product) => String(product.id) === e.target.value)?.title || ""); }} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)", background: "white" }}>
                  <option value="">Pilih produk</option>
                  {products.map((product) => <option key={product.id} value={product.id} disabled={!product.stock}>{product.title} — stok {product.stock || 0}</option>)}
                </select>
              </div>
              <div><label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px" }}>Jumlah</label><input type="number" min="1" max={products.find((product) => String(product.id) === productId)?.stock || 1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--line)" }} /></div>
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

function AdminSembako({ go, currentUser, redemptionRequests, setRedemptionRequests, newOrdersCount, newSembakoCount }) {
  const { notify } = useAppNotifications();
  const requests = redemptionRequests.filter((request) => request.redemption_type === "sembako");
  const updateStatus = async (request, status) => {
    let rejectionReason = null;
    if (status === "Ditolak") {
      rejectionReason = window.prompt("Alasan penolakan (akan ditampilkan ke warga):");
      if (rejectionReason === null) return;
      if (!rejectionReason.trim()) {
        notify("Tuliskan alasan penolakan terlebih dahulu.", "error");
        return;
      }
    }
    const { data, error } = await supabase.from("redemption_requests")
      .update({ status, rejection_reason: rejectionReason, updated_at: new Date().toISOString() })
      .eq("id", request.id).select().single();
    if (error) {
      notify(`Gagal memperbarui pengajuan: ${error.message}`, "error");
      return;
    }
    setRedemptionRequests((items) => items.map((item) => item.id === request.id ? data : item));
  };

  return (
    <AdminShell page="admin_sembako" go={go} currentUser={currentUser} newOrdersCount={newOrdersCount} newSembakoCount={newSembakoCount}>
      <div className="section-head" style={{ marginBottom: "20px", textAlign: "left" }}>
        <span className="kicker">Pengelolaan Penukaran Saldo</span>
        <h2>Pengajuan Sembako Warga</h2>
        <p>Warga mengajukan barang dan nominal yang diinginkan. Saldo ditahan saat pengajuan; penolakan mengembalikan saldo tersedia.</p>
      </div>
      <div className="table-wrap" style={{ background: "white" }}>
        <table>
          <thead><tr><th>Nama Warga</th><th>WhatsApp</th><th>Barang diminta</th><th>Nominal</th><th>Status</th><th>Aksi</th></tr></thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>{request.user_name}</td>
                <td>{request.phone}</td>
                <td>{request.item_details}</td>
                <td>{rupiah(Number(request.amount))}</td>
                <td>{request.status}{request.rejection_reason ? `: ${request.rejection_reason}` : ""}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {request.status === "Menunggu Konfirmasi" && <>
                    <Button onClick={() => updateStatus(request, "Disetujui")} style={{ padding: "6px 10px", marginRight: "6px" }}>Setujui</Button>
                    <Button variant="secondary" onClick={() => updateStatus(request, "Ditolak")} style={{ padding: "6px 10px" }}>Tolak</Button>
                  </>}
                  {request.status === "Disetujui" && <Button onClick={() => updateStatus(request, "Selesai")} style={{ padding: "6px 10px" }}>Tandai selesai</Button>}
                  {whatsappUrl(request.phone, `Halo ${request.user_name}, pengajuan sembako (${request.item_details}, ${rupiah(Number(request.amount))}) Anda ${request.status.toLowerCase()}${request.rejection_reason ? `. Alasan: ${request.rejection_reason}` : ""}.`) && (
                    <a href={whatsappUrl(request.phone, `Halo ${request.user_name}, pengajuan sembako (${request.item_details}, ${rupiah(Number(request.amount))}) Anda ${request.status.toLowerCase()}${request.rejection_reason ? `. Alasan: ${request.rejection_reason}` : ""}.`)} target="_blank" rel="noreferrer" style={{ marginLeft: "6px", color: "var(--green)" }}>WhatsApp</a>
                  )}
                </td>
              </tr>
            ))}
            {requests.length === 0 && <tr><td colSpan="6" style={{ textAlign: "center", padding: "24px" }}>Belum ada pengajuan sembako.</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function Deposit({ go, currentUser, prices, depositHistory, redemptionRequests, onAddDeposit }) {
  const { notify } = useAppNotifications();
  const [qty, setQty] = useState("");
  const [wasteIdx, setWasteIdx] = useState(0);
  const [residentName, setResidentName] = useState("");
  const [lastSavedRecord, setLastSavedRecord] = useState(null);
  const [historyQuery, setHistoryQuery] = useState("");

  const uniqueResidentNames = useMemo(() => {
    const setNames = new Set(depositHistory.map(d => d.user_name));
    return Array.from(setNames);
  }, [depositHistory]);

  const filteredNames = uniqueResidentNames.filter(n => n.toLowerCase().includes(residentName.toLowerCase()) && residentName.trim() !== "");
  const filteredHistory = depositHistory.filter((record) => record.user_name.toLowerCase().includes(historyQuery.trim().toLowerCase()));

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
      deposit_date: dateInputValue(new Date()),
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
      <div className="form-panel" style={{ background: "white", padding: "22px", marginTop: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", flexWrap: "wrap", marginBottom: "14px" }}>
          <div><h2 style={{ color: "var(--forest)", fontSize: "20px" }}>Riwayat Setoran Warga</h2><p style={{ color: "var(--muted)", fontSize: "13px", marginTop: "5px" }}>Cari nama warga untuk melihat catatan dan saldo bersihnya.</p></div>
          <input type="search" value={historyQuery} onChange={(e) => setHistoryQuery(e.target.value)} placeholder="Filter berdasarkan nama..." style={{ padding: "10px", minWidth: "240px", border: "1px solid var(--line)", borderRadius: "8px" }} />
        </div>
        <div className="table-wrap">
          <table><thead><tr><th>Tanggal</th><th>Nama warga</th><th>Jenis sampah</th><th>Berat</th><th>Nilai setoran</th><th>Saldo tersedia</th></tr></thead>
            <tbody>{filteredHistory.map((record) => {
              const residentCredits = depositHistory.filter((item) => item.user_name.toLowerCase() === record.user_name.toLowerCase()).reduce((sum, item) => sum + Number(item.nominal || 0), 0);
              const residentRedemptions = redemptionRequests.filter((request) => request.user_name.toLowerCase() === record.user_name.toLowerCase() && request.status !== "Ditolak").reduce((sum, request) => sum + Number(request.amount || 0), 0);
              return <tr key={record.id}><td>{record.deposit_date}</td><td>{record.user_name}</td><td>{record.waste_type}</td><td>{record.weight} kg</td><td>{rupiah(Number(record.nominal || 0))}</td><td>{rupiah(Math.max(0, residentCredits - residentRedemptions))}</td></tr>;
            })}
              {filteredHistory.length === 0 && <tr><td colSpan="6" style={{ textAlign: "center", padding: "18px" }}>Tidak ada riwayat setoran yang cocok.</td></tr>}
            </tbody>
          </table>
        </div>
        <small style={{ display: "block", color: "var(--muted)", marginTop: "10px" }}>Saldo tersedia menghitung setoran dikurangi semua penukaran yang tidak ditolak, termasuk pengajuan yang sedang menunggu konfirmasi.</small>
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

function AdminGoldBatches({ go, currentUser, redemptionRequests, setRedemptionRequests, newOrdersCount, newSembakoCount }) {
  const { notify } = useAppNotifications();
  const goldRequests = redemptionRequests.filter((request) => request.redemption_type === "gold");
  const updateStatus = async (request, status) => {
    let rejectionReason = null;
    if (status === "Ditolak") {
      rejectionReason = window.prompt("Alasan penolakan pengajuan emas:");
      if (rejectionReason === null) return;
      if (!rejectionReason.trim()) {
        notify("Tuliskan alasan penolakan terlebih dahulu.", "error");
        return;
      }
    }
    const { data, error } = await supabase.from("redemption_requests")
      .update({ status, rejection_reason: rejectionReason, updated_at: new Date().toISOString() })
      .eq("id", request.id).select().single();
    if (error) {
      notify(`Gagal memperbarui status: ${error.message}`, "error");
      return;
    }
    setRedemptionRequests((items) => items.map((item) => item.id === request.id ? data : item));
  };
  return (
    <AdminShell page="admin_gold" go={go} currentUser={currentUser} newOrdersCount={newOrdersCount} newSembakoCount={newSembakoCount}>
      <div className="section-head" style={{ marginBottom: "20px", textAlign: "left" }}>
        <span className="kicker">Kemitraan Resmi Pegadaian Situbondo</span>
        <h2>Batch Emas Pegadaian</h2>
        <p>Kelola tahapan pengajuan konversi emas Pegadaian. Saldo ditahan saat pengajuan dan dikembalikan jika permintaan ditolak.</p>
      </div>

      <div className="table-wrap" style={{ background: "white" }}>
        <table>
          <thead>
            <tr>
              <th>Nama Nasabah Warga</th>
              <th>Nominal Dikonversi</th>
              <th>Status</th>
              <th>WhatsApp</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {goldRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.user_name}</td>
                <td><b style={{ color: "var(--amber)" }}>{rupiah(Number(request.amount))}</b></td>
                <td>{request.status}{request.rejection_reason ? `: ${request.rejection_reason}` : ""}</td>
                <td>{whatsappUrl(request.phone, `Halo ${request.user_name}, status pengajuan emas ${rupiah(Number(request.amount))} Anda: ${request.status}.`) && <a href={whatsappUrl(request.phone, `Halo ${request.user_name}, status pengajuan emas ${rupiah(Number(request.amount))} Anda: ${request.status}.`)} target="_blank" rel="noreferrer">Kirim update</a>}</td>
                <td>
                  {request.status === "Menunggu Konfirmasi" && <>
                    <Button onClick={() => updateStatus(request, "Diproses")} style={{ padding: "6px 10px", marginRight: "5px" }}>Proses</Button>
                    <Button variant="secondary" onClick={() => updateStatus(request, "Ditolak")} style={{ padding: "6px 10px" }}>Tolak</Button>
                  </>}
                  {request.status === "Diproses" && <Button onClick={() => updateStatus(request, "Siap Diambil")} style={{ padding: "6px 10px", marginRight: "5px" }}>Siap diambil</Button>}
                  {request.status === "Siap Diambil" && <Button onClick={() => updateStatus(request, "Selesai")} style={{ padding: "6px 10px" }}>Selesai</Button>}
                </td>
              </tr>
            ))}
            {goldRequests.length === 0 && <tr><td colSpan="5" style={{ textAlign: "center", padding: "24px" }}>Belum ada pengajuan emas.</td></tr>}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "20px" }}>
        <Button variant="secondary" onClick={() => window.print()}>
          <Icon name="printer" size={16} />           Cetak Daftar Pengajuan Emas
        </Button>
      </div>
    </AdminShell>
  );
}

function AdminReport({ go, currentUser, depositHistory, newOrdersCount, newSembakoCount }) {
  const today = new Date();
  const todayString = dateInputValue(today);
  const monthStart = dateInputValue(new Date(today.getFullYear(), today.getMonth(), 1));
  const [startDate, setStartDate] = useState(monthStart);
  const [endDate, setEndDate] = useState(todayString);
  const [reportDate, setReportDate] = useState(todayString);
  const [chairpersonName, setChairpersonName] = useState("Ibu Wayan");
  const [recorderName, setRecorderName] = useState(currentUser?.name || "Ibu Ketua");

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
          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px", color: "var(--muted)" }}>Tanggal laporan:</label>
            <input type="date" value={reportDate} onChange={(e) => setReportDate(e.target.value)} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "14px" }} />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px", color: "var(--muted)" }}>Nama ketua:</label>
            <input type="text" value={chairpersonName} onChange={(e) => setChairpersonName(e.target.value)} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "14px" }} />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "4px", color: "var(--muted)" }}>Nama petugas:</label>
            <input type="text" value={recorderName} onChange={(e) => setRecorderName(e.target.value)} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--line)", fontSize: "14px" }} />
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
            ( {chairpersonName} )
          </div>
          <div style={{ textAlign: "right" }}>
            Situbondo, {new Date(`${reportDate}T00:00:00`).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}<br />
            <b>Petugas Pencatat Sistem</b><br /><br /><br />
            ( {recorderName} )
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

function AdminProducts({ go, currentUser, products, setProducts, newOrdersCount, newSembakoCount }) {
  const { notify } = useAppNotifications();
  const [values, setValues] = useState({});
  const saveProduct = async (product) => {
    const stock = Number(values[product.id]?.stock ?? product.stock ?? 0);
    const priceAmount = Number(values[product.id]?.price_amount ?? product.price_amount ?? 0);
    if (!Number.isInteger(stock) || stock < 0 || priceAmount < 0) {
      notify("Stok harus berupa bilangan bulat dan harga tidak boleh negatif.", "error");
      return;
    }
    const { data, error } = await supabase.from("products_db")
      .update({ stock, price_amount: priceAmount, price_tag: rupiah(priceAmount) })
      .eq("id", product.id).select().single();
    if (error) {
      notify(`Gagal menyimpan stok produk: ${error.message}`, "error");
      return;
    }
    setProducts((items) => items.map((item) => item.id === product.id ? data : item));
    notify("Stok dan harga produk berhasil diperbarui.", "success");
  };
  return (
    <AdminShell page="admin_products" go={go} currentUser={currentUser} newOrdersCount={newOrdersCount} newSembakoCount={newSembakoCount}>
      <div className="section-head" style={{ textAlign: "left", marginBottom: "20px" }}>
        <h2>Stok Katalog Produk</h2>
        <p>Isi stok awal setiap produk. Pesanan baru otomatis mengurangi stok dan penolakan pesanan mengembalikannya.</p>
      </div>
      <div className="table-wrap" style={{ background: "white" }}>
        <table><thead><tr><th>Produk</th><th>Harga (Rp)</th><th>Stok tersedia</th><th>Aksi</th></tr></thead>
          <tbody>{products.map((product) => (
            <tr key={product.id}>
              <td><b>{product.title}</b></td>
              <td><input aria-label={`Harga ${product.title}`} type="number" min="0" value={values[product.id]?.price_amount ?? product.price_amount ?? 0} onChange={(e) => setValues((state) => ({ ...state, [product.id]: { ...state[product.id], price_amount: e.target.value } }))} style={{ width: "120px", padding: "8px", border: "1px solid var(--line)", borderRadius: "8px" }} /></td>
              <td><input aria-label={`Stok ${product.title}`} type="number" min="0" step="1" value={values[product.id]?.stock ?? product.stock ?? 0} onChange={(e) => setValues((state) => ({ ...state, [product.id]: { ...state[product.id], stock: e.target.value } }))} style={{ width: "100px", padding: "8px", border: "1px solid var(--line)", borderRadius: "8px" }} /></td>
              <td><Button onClick={() => saveProduct(product)} style={{ padding: "8px 14px" }}>Simpan</Button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </AdminShell>
  );
}

function AdminInventory({ go, currentUser, depositHistory, outflows, setOutflows, newOrdersCount, newSembakoCount }) {
  const { notify } = useAppNotifications();
  const [wasteType, setWasteType] = useState("");
  const [weight, setWeight] = useState("");
  const [details, setDetails] = useState("");
  const [movementDate, setMovementDate] = useState(dateInputValue(new Date()));
  const inventory = useMemo(() => {
    const types = [...new Set([...depositHistory.map((record) => record.waste_type), ...outflows.map((record) => record.waste_type)])];
    return types.map((type) => ({
      type,
      incoming: depositHistory.filter((record) => record.waste_type === type).reduce((sum, record) => sum + Number(record.weight || 0), 0),
      outgoing: outflows.filter((record) => record.waste_type === type).reduce((sum, record) => sum + Number(record.weight || 0), 0)
    }));
  }, [depositHistory, outflows]);
  const handleOutflow = async (event) => {
    event.preventDefault();
    const record = { waste_type: wasteType, weight: Number(weight), movement_date: movementDate, details: details.trim() };
    const { data, error } = await supabase.from("waste_outflows").insert([record]).select().single();
    if (error) {
      notify(`Gagal mencatat sampah keluar: ${error.message}`, "error");
      return;
    }
    setOutflows((items) => [data, ...items]);
    setWeight("");
    setDetails("");
    notify("Pengeluaran stok sampah berhasil dicatat.", "success");
  };
  return (
    <AdminShell page="admin_inventory" go={go} currentUser={currentUser} newOrdersCount={newOrdersCount} newSembakoCount={newSembakoCount}>
      <div className="section-head" style={{ textAlign: "left", marginBottom: "20px" }}><h2>Rekap Stok Bank Sampah</h2><p>Stok tersedia dihitung dari setoran tercatat dikurangi pengeluaran yang dicatat sejak sistem ini digunakan.</p></div>
      <div className="table-wrap" style={{ background: "white", marginBottom: "24px" }}>
        <table><thead><tr><th>Jenis sampah</th><th>Masuk (kg)</th><th>Keluar (kg)</th><th>Estimasi tersedia (kg)</th></tr></thead><tbody>
          {inventory.map((item) => <tr key={item.type}><td>{item.type}</td><td>{item.incoming.toFixed(2)}</td><td>{item.outgoing.toFixed(2)}</td><td><b>{Math.max(0, item.incoming - item.outgoing).toFixed(2)}</b></td></tr>)}
          {inventory.length === 0 && <tr><td colSpan="4">Belum ada data setoran.</td></tr>}
        </tbody></table>
      </div>
      <div className="form-panel" style={{ background: "white", padding: "24px", maxWidth: "680px" }}>
        <h3 style={{ color: "var(--forest)", marginBottom: "16px" }}>Catat sampah keluar/terjual</h3>
        <form onSubmit={handleOutflow} style={{ display: "grid", gap: "12px" }}>
          <label>Jenis sampah<select required value={wasteType} onChange={(e) => setWasteType(e.target.value)} style={{ display: "block", width: "100%", padding: "10px", marginTop: "5px", border: "1px solid var(--line)", borderRadius: "8px", background: "white" }}><option value="">Pilih jenis</option>{inventory.map((item) => <option key={item.type} value={item.type}>{item.type}</option>)}</select></label>
          <label>Berat keluar (kg)<input required type="number" step="0.01" min="0.01" value={weight} onChange={(e) => setWeight(e.target.value)} style={{ display: "block", width: "100%", padding: "10px", marginTop: "5px", border: "1px solid var(--line)", borderRadius: "8px" }} /></label>
          <label>Tanggal<input required type="date" value={movementDate} onChange={(e) => setMovementDate(e.target.value)} style={{ display: "block", padding: "10px", marginTop: "5px", border: "1px solid var(--line)", borderRadius: "8px" }} /></label>
          <label>Keterangan<input value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Contoh: dijual ke pengepul" style={{ display: "block", width: "100%", padding: "10px", marginTop: "5px", border: "1px solid var(--line)", borderRadius: "8px" }} /></label>
          <Button type="submit" disabled={!inventory.length}>Simpan pengeluaran stok</Button>
        </form>
      </div>
    </AdminShell>
  );
}

function AdminSales({ go, currentUser, orders, newOrdersCount, newSembakoCount }) {
  const today = dateInputValue(new Date());
  const month = today.slice(0, 7);
  const completed = orders.filter((order) => order.status === "Selesai");
  const todaySales = completed.filter((order) => (order.completed_at || order.created_at)?.slice(0, 10) === today);
  const monthSales = completed.filter((order) => (order.completed_at || order.created_at)?.startsWith(month));
  const productTotals = completed.reduce((groups, order) => {
    const key = order.product_name || "Produk tidak diketahui";
    groups[key] = groups[key] || { quantity: 0, amount: 0 };
    groups[key].quantity += Number(order.quantity || 1);
    groups[key].amount += Number(order.total_amount || 0);
    return groups;
  }, {});
  return (
    <AdminShell page="admin_sales" go={go} currentUser={currentUser} newOrdersCount={newOrdersCount} newSembakoCount={newSembakoCount}>
      <div className="section-head" style={{ textAlign: "left", marginBottom: "20px" }}><h2>Rekap Penjualan</h2><p>Pemasukan dihitung dari pesanan yang telah ditandai selesai. Pesanan lama tanpa harga tersimpan tidak dihitung ke omzet.</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px", marginBottom: "22px" }}>
        <div className="form-panel" style={{ background: "white", padding: "22px" }}><span className="kicker">Hari ini</span><h3 style={{ marginTop: "10px", color: "var(--forest)" }}>{rupiah(todaySales.reduce((sum, order) => sum + Number(order.total_amount || 0), 0))}</h3><small>{todaySales.length} pesanan selesai</small></div>
        <div className="form-panel" style={{ background: "white", padding: "22px" }}><span className="kicker">Bulan ini</span><h3 style={{ marginTop: "10px", color: "var(--forest)" }}>{rupiah(monthSales.reduce((sum, order) => sum + Number(order.total_amount || 0), 0))}</h3><small>{monthSales.length} pesanan selesai</small></div>
      </div>
      <div className="table-wrap" style={{ background: "white" }}><table><thead><tr><th>Produk</th><th>Jumlah terjual</th><th>Pemasukan tercatat</th></tr></thead><tbody>
        {Object.entries(productTotals).map(([name, total]) => <tr key={name}><td>{name}</td><td>{total.quantity}</td><td>{rupiah(total.amount)}</td></tr>)}
        {Object.keys(productTotals).length === 0 && <tr><td colSpan="3">Belum ada pesanan selesai.</td></tr>}
      </tbody></table></div>
    </AdminShell>
  );
}

function AdminAccounts({ go, currentUser, accounts, setAccounts, newOrdersCount, newSembakoCount }) {
  const { notify } = useAppNotifications();
  const updateAccount = async (account, status) => {
    const { data, error } = await supabase.from("bank_accounts").update({ status }).eq("user_id", account.user_id).select().single();
    if (error) {
      notify(`Gagal memperbarui akun warga: ${error.message}`, "error");
      return;
    }
    setAccounts((items) => items.map((item) => item.user_id === account.user_id ? data : item));
    if (status === "active") {
      const { error: linkError } = await supabase.from("redemption_requests")
        .update({ user_id: account.user_id, phone: account.phone })
        .eq("user_name", account.full_name)
        .is("user_id", null);
      if (linkError) {
        notify(`Akun aktif, tetapi riwayat penukaran lama belum terhubung: ${linkError.message}`, "error");
      }
    }
  };
  return (
    <AdminShell page="admin_accounts" go={go} currentUser={currentUser} newOrdersCount={newOrdersCount} newSembakoCount={newSembakoCount}>
      <div className="section-head" style={{ textAlign: "left", marginBottom: "20px" }}><h2>Akun Warga</h2><p>Akun warga baru otomatis aktif setelah pendaftaran. Akun lama yang masih menunggu persetujuan tetap dapat dikelola di sini.</p></div>
      <div className="table-wrap" style={{ background: "white" }}><table><thead><tr><th>Nama</th><th>Email</th><th>WhatsApp</th><th>Status</th><th>Aksi</th></tr></thead><tbody>
        {accounts.filter((account) => account.role === "resident").map((account) => <tr key={account.user_id}><td>{account.full_name}</td><td>{account.email}</td><td>{account.phone}</td><td>{account.status}</td><td>{account.status === "pending" && <><Button onClick={() => updateAccount(account, "active")} style={{ padding: "7px 12px", marginRight: "6px" }}>Setujui</Button><Button variant="secondary" onClick={() => updateAccount(account, "rejected")} style={{ padding: "7px 12px" }}>Tolak</Button></>}</td></tr>)}
        {accounts.filter((account) => account.role === "resident").length === 0 && <tr><td colSpan="5">Belum ada akun warga.</td></tr>}
      </tbody></table></div>
    </AdminShell>
  );
}

function AdminSettings({ go, currentUser, settings, setSettings, newOrdersCount, newSembakoCount }) {
  const { notify } = useAppNotifications();
  const [values, setValues] = useState(settings);
  const save = async (event) => {
    event.preventDefault();
    const payload = {
      ...values,
      id: 1,
      whatsapp_number: values.whatsapp_number.replace(/\D/g, ""),
      gold_minimum: Number(values.gold_minimum),
      gold_increment: Number(values.gold_increment),
      updated_at: new Date().toISOString()
    };
    const { data, error } = await supabase.from("bank_settings").upsert(payload).select().single();
    if (error) {
      notify(`Gagal menyimpan informasi: ${error.message}`, "error");
      return;
    }
    setSettings(data);
    notify("Informasi bank sampah berhasil disimpan.", "success");
  };
  const fields = [
    ["whatsapp_number", "Nomor WhatsApp (format 62...)"],
    ["address", "Alamat lengkap"],
    ["operating_hours", "Jam layanan"],
    ["gold_minimum", "Minimal penukaran emas (Rp)"],
    ["gold_increment", "Kelipatan penukaran emas (Rp)"],
    ["deposit_terms", "Ketentuan setoran dan pembayaran"],
    ["sembako_terms", "Ketentuan penukaran sembako"]
  ];
  return (
    <AdminShell page="admin_settings" go={go} currentUser={currentUser} newOrdersCount={newOrdersCount} newSembakoCount={newSembakoCount}>
      <div className="section-head" style={{ textAlign: "left", marginBottom: "20px" }}><h2>Informasi Bank Sampah</h2><p>Perubahan di sini akan ditampilkan di beranda, footer, dan portal warga.</p></div>
      <form className="form-panel" onSubmit={save} style={{ background: "white", padding: "24px", maxWidth: "760px", display: "grid", gap: "14px" }}>
        {fields.map(([key, label]) => <label key={key} style={{ fontSize: "13px", fontWeight: "600", color: "var(--forest)" }}>{label}
          {key.includes("terms") ? <textarea required rows="3" value={values[key] || ""} onChange={(e) => setValues((item) => ({ ...item, [key]: e.target.value }))} style={{ display: "block", width: "100%", marginTop: "5px", padding: "10px", border: "1px solid var(--line)", borderRadius: "8px" }} /> : <input required type={key.includes("minimum") || key.includes("increment") ? "number" : "text"} min={key.includes("minimum") || key.includes("increment") ? 1 : undefined} value={values[key] || ""} onChange={(e) => setValues((item) => ({ ...item, [key]: e.target.value }))} style={{ display: "block", width: "100%", marginTop: "5px", padding: "10px", border: "1px solid var(--line)", borderRadius: "8px" }} />}
        </label>)}
        <Button type="submit">Simpan informasi</Button>
      </form>
    </AdminShell>
  );
}

export default function App() {
  const savedPage = sessionStorage.getItem("eco-cahaya-page");
  const [page, setPage] = useState(() => {
    return savedPage && savedPage !== "login" ? savedPage : "home";
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [pendingTargetPage, setPendingTargetPage] = useState(() => savedPage && protectedPages.includes(savedPage) ? savedPage : null);
  const [authReady, setAuthReady] = useState(false);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [dataError, setDataError] = useState("");
  const [prices, setPrices] = useState([]);
  const [products, setProducts] = useState([]);
  const [depositHistory, setDepositHistory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [redemptionRequests, setRedemptionRequests] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [outflows, setOutflows] = useState([]);
  const [settings, setSettings] = useState(defaultBankSettings);
  const [residentBalance, setResidentBalance] = useState(0);
  const [publicWasteTotal, setPublicWasteTotal] = useState(0);

  const loadAccount = useCallback(async (session, failOnError = false) => {
    if (!session?.user) {
      setCurrentUser(null);
      setAuthReady(true);
      return null;
    }
    const { data, error } = await supabase.from("bank_accounts")
      .select("user_id,email,full_name,phone,role,status")
      .eq("user_id", session.user.id).maybeSingle();
    if (error) {
      const message = `Tidak dapat memeriksa akun. Pastikan migration database sudah dijalankan: ${error.message}`;
      setDataError(message);
      setCurrentUser(null);
      setAuthReady(true);
      if (failOnError) throw new Error(message);
      return null;
    }
    if (!data || data.status !== "active") {
      setCurrentUser(null);
      setAuthReady(true);
      return data;
    }
    const account = {
      id: data.user_id,
      email: data.email,
      name: data.full_name,
      phone: data.phone,
      status: data.status,
      role: data.role === "admin" ? "admin" : "warga"
    };
    setCurrentUser(account);
    setAuthReady(true);
    return account;
  }, []);

  const refreshData = useCallback(async () => {
    setDataError("");
    const errors = [];
    try {
      const results = await Promise.all([
        supabase.from("prices").select("*").order("id", { ascending: true }),
        supabase.from("products_db").select("*").order("id", { ascending: true }),
        supabase.from("bank_settings").select("*").eq("id", 1).maybeSingle(),
        supabase.rpc("get_public_waste_total")
      ]);
      const [priceResult, productResult, settingsResult, wasteTotalResult] = results;
      if (priceResult.error) errors.push(`Daftar harga: ${priceResult.error.message}`);
      else setPrices(priceResult.data || []);
      if (productResult.error) errors.push(`Katalog produk: ${productResult.error.message}`);
      else setProducts(productResult.data || []);
      if (settingsResult.error) errors.push(`Pengaturan bank sampah: ${settingsResult.error.message}`);
      else if (settingsResult.data) setSettings(settingsResult.data);
      if (wasteTotalResult.error) errors.push(`Total setoran sampah: ${wasteTotalResult.error.message}`);
      else setPublicWasteTotal(Number(wasteTotalResult.data || 0));

      if (currentUser?.role === "admin") {
        const adminResults = await Promise.all([
          supabase.from("deposits").select("*").order("deposit_date", { ascending: false }),
          supabase.from("orders").select("*").order("created_at", { ascending: false }),
          supabase.from("redemption_requests").select("*").order("created_at", { ascending: false }),
          supabase.from("bank_accounts").select("*").order("created_at", { ascending: false }),
          supabase.from("waste_outflows").select("*").order("movement_date", { ascending: false })
        ]);
        const [depositsResult, ordersResult, redemptionResult, accountsResult, outflowResult] = adminResults;
        [
          ["Riwayat setoran", depositsResult, setDepositHistory],
          ["Pesanan", ordersResult, setOrders],
          ["Penukaran saldo", redemptionResult, setRedemptionRequests],
          ["Akun warga", accountsResult, setAccounts],
          ["Stok sampah keluar", outflowResult, setOutflows]
        ].forEach(([label, result, setter]) => {
          if (result.error) errors.push(`${label}: ${result.error.message}`);
          else setter(result.data || []);
        });
      } else if (currentUser?.role === "warga") {
        const [depositsResult, redemptionResult, balanceResult] = await Promise.all([
          supabase.from("deposits").select("*").eq("user_name", currentUser.name).order("deposit_date", { ascending: false }),
          supabase.from("redemption_requests").select("*").eq("user_id", currentUser.id).order("created_at", { ascending: false }),
          supabase.rpc("get_resident_available_balance")
        ]);
        if (depositsResult.error) errors.push(`Riwayat setoran: ${depositsResult.error.message}`);
        else setDepositHistory(depositsResult.data || []);
        if (redemptionResult.error) errors.push(`Riwayat penukaran: ${redemptionResult.error.message}`);
        else setRedemptionRequests(redemptionResult.data || []);
        if (balanceResult.error) errors.push(`Saldo tabungan: ${balanceResult.error.message}`);
        else setResidentBalance(Number(balanceResult.data || 0));
      }

      if (errors.length) {
        const message = errors.join(" • ");
        console.error("Gagal menyegarkan data ECO-CAHAYA:", message);
        setDataError(message);
      }
    } catch (error) {
      console.error("Gagal menyegarkan data ECO-CAHAYA:", error);
      setDataError(`Gagal memuat data dari Supabase: ${error.message}`);
    }
  }, [currentUser]);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setDataError(`Sesi login tidak dapat dipulihkan: ${error.message}`);
        setAuthReady(true);
        return;
      }
      loadAccount(data.session);
    });
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        const recoveryTarget = localStorage.getItem("eco-cahaya-password-reset-target") || "resident";
        setPendingTargetPage(recoveryTarget);
        setPage("login");
        setIsPasswordRecovery(true);
      }
      if (session) {
        Promise.resolve().then(() => active && loadAccount(session));
      } else if (active) {
        setCurrentUser(null);
        setAuthReady(true);
      }
    });
    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, [loadAccount]);

  useEffect(() => {
    sessionStorage.setItem("eco-cahaya-page", page);
  }, [page]);

  useEffect(() => {
    const initialRefreshId = window.setTimeout(() => { refreshData(); }, 0);
    const refreshOnFocus = () => {
      if (document.visibilityState === "visible") refreshData();
    };
    const intervalId = window.setInterval(refreshData, 60000);
    window.addEventListener("focus", refreshOnFocus);
    return () => {
      window.clearTimeout(initialRefreshId);
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshOnFocus);
    };
  }, [refreshData]);

  const totalCleanWasteKg = useMemo(() => {
    return currentUser?.role === "admin"
      ? depositHistory.reduce((acc, curr) => acc + parseFloat(curr.weight || 0), 0)
      : publicWasteTotal;
  }, [currentUser, depositHistory, publicWasteTotal]);

  const handleAddDeposit = (newRecord) => {
    setDepositHistory((items) => [newRecord, ...items]);
  };

  const handleApplyRedemption = async (request) => {
    const { data, error } = await supabase.rpc("request_balance_redemption", {
      p_redemption_type: request.redemption_type,
      p_amount: request.amount,
      p_item_details: request.item_details,
      p_quantity: request.quantity
    });
    if (error) throw new Error(error.message);
    setRedemptionRequests((items) => [data, ...items]);
    setResidentBalance((balance) => Math.max(0, balance - Number(request.amount)));
    const { data: balance, error: balanceError } = await supabase.rpc("get_resident_available_balance");
    if (balanceError) {
      console.error("Gagal memperbarui saldo setelah penukaran:", balanceError.message);
      setDataError(`Penukaran tersimpan, tetapi saldo terbaru gagal dimuat: ${balanceError.message}`);
    } else {
      setResidentBalance(Number(balance || 0));
    }
  };

  const handleNewOrder = (newOrder) => {
    setProducts((items) => items.map((item) => item.id === newOrder.product_id
      ? { ...item, stock: Number(item.stock || 0) - Number(newOrder.quantity || 1) }
      : item));
    if (currentUser?.role === "admin") refreshData();
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

    if (protectedPages.includes(target)) {
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

  const handleLogin = async ({ email, password, targetPage }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const account = await loadAccount(data.session, true);
    const expectedRole = targetPage === "resident" ? "warga" : "admin";
    if (!account || account.status !== "active" || (account.role !== "admin" && account.role !== "warga")) {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw new Error(`Akun belum aktif dan sesi gagal ditutup: ${signOutError.message}`);
      if (account?.status === "pending") {
        throw new Error("Email dan kata sandi benar, tetapi akun masih menunggu persetujuan pengurus.");
      }
      if (account?.status === "rejected") {
        throw new Error("Akun ini ditolak pengurus. Silakan hubungi pengurus bank sampah.");
      }
      throw new Error("Data akun belum ditemukan. Minta pengurus memeriksa tabel bank_accounts dan mengaktifkan role akun ini.");
    }
    if (account.role !== expectedRole) {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw new Error(`Akun tidak memiliki akses ke halaman ini dan sesi gagal ditutup: ${signOutError.message}`);
      throw new Error("Akun ini tidak memiliki akses untuk halaman tersebut.");
    }
  };

  const handleForgotPassword = async ({ email, targetPage }) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin
    });
    if (error) throw error;
    localStorage.setItem("eco-cahaya-password-reset-target", targetPage);
  };

  const handleUpdatePassword = async (password) => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };

  const handlePasswordResetComplete = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(`Kata sandi diperbarui, tetapi sesi reset belum dapat ditutup: ${error.message}`);
    localStorage.removeItem("eco-cahaya-password-reset-target");
    setIsPasswordRecovery(false);
  };

  const handleRegister = async ({ name, email, phone, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, phone } }
    });
    if (error) throw error;
    if (!data.session) {
      throw new Error("Akun sudah tersimpan, tetapi Supabase masih mewajibkan verifikasi email. Agar warga bisa langsung masuk, nonaktifkan Confirm email di Dashboard Supabase: Authentication > Providers > Email.");
    }
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) throw signOutError;
  };

  const handleLogout = () => {
    supabase.auth.signOut().then(({ error }) => {
      if (error) {
        console.error("Gagal mengakhiri sesi:", error.message);
        setDataError(`Gagal keluar: ${error.message}`);
      }
    });
    setCurrentUser(null);
    setResidentBalance(0);
    setPage("home");
  };

  let content;
  const loginTarget = pendingTargetPage || (protectedPages.includes(page) ? page : "resident");
  if (!authReady) {
    content = <div role="status" style={{ minHeight: "50vh", display: "grid", placeItems: "center", color: "var(--muted)" }}>Memulihkan sesi...</div>;
  } else if (page === "login" || (protectedPages.includes(page) && !currentUser)) {
    content = <LoginPage
      go={setPage}
      targetPage={loginTarget}
      onLogin={handleLogin}
      onRegister={handleRegister}
      onForgotPassword={handleForgotPassword}
      onUpdatePassword={handleUpdatePassword}
      onPasswordResetComplete={handlePasswordResetComplete}
      isPasswordRecovery={isPasswordRecovery}
    />;
  } else if (currentUser?.role === "warga" && protectedPages.includes(page)) {
    content = <Resident go={go} currentUser={currentUser} logout={handleLogout} depositHistory={depositHistory} redemptionRequests={redemptionRequests} residentBalance={residentBalance} onApplyRedemption={handleApplyRedemption} settings={settings} />;
  } else if (currentUser?.role === "admin" && page === "resident") {
    content = <Admin go={go} currentUser={currentUser} depositHistory={depositHistory} orders={orders} redemptionRequests={redemptionRequests} />;
  } else if (page === "home") {
    content = <Home go={go} products={products} totalCleanWasteKg={totalCleanWasteKg} settings={settings} />;
  } else if (page === "admin") {
    content = <Admin go={go} currentUser={currentUser} depositHistory={depositHistory} orders={orders} redemptionRequests={redemptionRequests} />;
  } else if (page === "deposit") {
    content = <Deposit go={go} currentUser={currentUser} prices={prices} depositHistory={depositHistory} redemptionRequests={redemptionRequests} onAddDeposit={handleAddDeposit} />;
  } else if (page === "admin_prices") {
    content = <AdminPrices go={go} currentUser={currentUser} prices={prices} setPrices={setPrices} newOrdersCount={orders.filter((order) => order.status === "Baru").length} newSembakoCount={redemptionRequests.filter((request) => request.status === "Menunggu Konfirmasi").length} />;
  } else if (page === "admin_products") {
    content = <AdminProducts go={go} currentUser={currentUser} products={products} setProducts={setProducts} newOrdersCount={orders.filter((order) => order.status === "Baru").length} newSembakoCount={redemptionRequests.filter((request) => request.status === "Menunggu Konfirmasi").length} />;
  } else if (page === "admin_inventory") {
    content = <AdminInventory go={go} currentUser={currentUser} depositHistory={depositHistory} outflows={outflows} setOutflows={setOutflows} newOrdersCount={orders.filter((order) => order.status === "Baru").length} newSembakoCount={redemptionRequests.filter((request) => request.status === "Menunggu Konfirmasi").length} />;
  } else if (page === "admin_sales") {
    content = <AdminSales go={go} currentUser={currentUser} orders={orders} newOrdersCount={orders.filter((order) => order.status === "Baru").length} newSembakoCount={redemptionRequests.filter((request) => request.status === "Menunggu Konfirmasi").length} />;
  } else if (page === "admin_orders") {
    content = <AdminOrders go={go} currentUser={currentUser} orders={orders} setOrders={setOrders} products={products} setProducts={setProducts} newOrdersCount={orders.filter((order) => order.status === "Baru").length} newSembakoCount={redemptionRequests.filter((request) => request.status === "Menunggu Konfirmasi").length} />;
  } else if (page === "admin_sembako") {
    content = <AdminSembako go={go} currentUser={currentUser} redemptionRequests={redemptionRequests} setRedemptionRequests={setRedemptionRequests} newOrdersCount={orders.filter((order) => order.status === "Baru").length} newSembakoCount={redemptionRequests.filter((request) => request.status === "Menunggu Konfirmasi").length} />;
  } else if (page === "admin_gold") {
    content = <AdminGoldBatches go={go} currentUser={currentUser} redemptionRequests={redemptionRequests} setRedemptionRequests={setRedemptionRequests} newOrdersCount={orders.filter((order) => order.status === "Baru").length} newSembakoCount={redemptionRequests.filter((request) => request.status === "Menunggu Konfirmasi").length} />;
  } else if (page === "admin_report") {
    content = <AdminReport go={go} currentUser={currentUser} depositHistory={depositHistory} newOrdersCount={orders.filter((order) => order.status === "Baru").length} newSembakoCount={redemptionRequests.filter((request) => request.status === "Menunggu Konfirmasi").length} />;
  } else if (page === "admin_accounts") {
    content = <AdminAccounts go={go} currentUser={currentUser} accounts={accounts} setAccounts={setAccounts} newOrdersCount={orders.filter((order) => order.status === "Baru").length} newSembakoCount={redemptionRequests.filter((request) => request.status === "Menunggu Konfirmasi").length} />;
  } else if (page === "admin_settings") {
    content = <AdminSettings go={go} currentUser={currentUser} settings={settings} setSettings={setSettings} newOrdersCount={orders.filter((order) => order.status === "Baru").length} newSembakoCount={redemptionRequests.filter((request) => request.status === "Menunggu Konfirmasi").length} />;
  } else if (page === "prices") {
    content = <Prices go={go} currentUser={currentUser} logout={handleLogout} prices={prices} settings={settings} />;
  } else if (page === "products") {
    content = <Products go={go} currentUser={currentUser} logout={handleLogout} products={products} onNewOrder={handleNewOrder} settings={settings} />;
  } else if (page === "resident") {
    content = <Resident go={go} currentUser={currentUser} logout={handleLogout} depositHistory={depositHistory} redemptionRequests={redemptionRequests} residentBalance={residentBalance} onApplyRedemption={handleApplyRedemption} settings={settings} />;
  } else {
    content = <Home go={go} products={products} totalCleanWasteKg={totalCleanWasteKg} settings={settings} />;
  }

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
      {dataError && <div role="alert" style={{ position: "fixed", left: "16px", right: "16px", bottom: "16px", zIndex: 30000, padding: "14px", borderRadius: "10px", background: "#fff5f5", color: "#9b2c2c", boxShadow: "0 6px 24px #0002" }}>{dataError}</div>}
      {content}
    </>
    </AppNotificationsProvider>
  );
}