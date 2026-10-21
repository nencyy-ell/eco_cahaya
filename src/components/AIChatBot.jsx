import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Sparkles, User } from "lucide-react";

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Halo Bapak/Ibu! 👋 Saya asisten pintar Bank Sampah Cahaya Kerja. Ada yang ingin ditanyakan seputar pemilahan sampah atau cek harga setoran hari ini?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const updatedMessages = [...messages, { role: "user", text: userText }];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    // Ambil API key dari env atau gunakan key langsung
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || "sk-93c451680fe62f17-2yhp7v-7c46a0bd";

    if (apiKey) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "ECO-CAHAYA Web App"
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `Kamu adalah 'Cahaya AI', asisten ramah untuk Bank Sampah Cahaya Kerja di Situbondo.
Gunakan bahasa Indonesia yang santun, ramah, dan ringkas.

Pengetahuan Operasional & Harga Sampah:
1. Botol plastik bersih Rp 2.000/kg, kotor Rp 1.000/kg.
2. Gelas plastik bersih Rp 2.500/kg, kotor Rp 1.000/kg.
3. Kardus KW 1 Rp 1.500/kg, KW 2 Rp 1.000/kg.
4. Minyak jelantah Rp 3.000/kg.
5. Buku HVS putih dipilah Rp 1.500/kg, sampul duplex Rp 500/kg.
6. Koran bersih Rp 7.000/kg.
7. Botol beling sirup Rp 100/biji.
8. Layanan jemput sampah: Bisa dijemput pengurus untuk warga sekitar yang berhalangan mengantar.
9. Penukaran saldo: Bisa ditukar sembako di warung pengurus, atau tabungan emas Pegadaian Situbondo jika sudah minimal Rp 50.000.`
              },
              ...updatedMessages.map((m) => ({ role: m.role, content: m.text }))
            ]
          })
        });

        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          setMessages([...updatedMessages, { role: "assistant", text: reply }]);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Koneksi API gagal, beralih ke asisten lokal:", err);
      }
    }

    // Fallback otomatis (Knowledge Base Lokal jika API offline atau limit)
    setTimeout(() => {
      const lower = userText.toLowerCase();
      let reply = "";

      if (lower.includes("jemput") || lower.includes("antar") || lower.includes("ambil")) {
        reply = "Bisa sekali Bapak/Ibu! Untuk warga sekitar yang belum sempat mengantar sendiri, pengurus kami melayani penjemputan setoran sampah langsung ke rumah. Pastikan sampahnya sudah dipilah per jenis ya agar memudahkan penimbangan di tempat. 😊";
      } else if (lower.includes("emas") || lower.includes("pegadaian")) {
        reply = "Hasil tabungan sampah yang sudah terkumpul minimal Rp 50.000 bisa langsung dialihkan ke tabungan emas melalui kemitraan kami dengan Pegadaian Situbondo. Pengurus yang akan menguruskan berkasnya secara kolektif!";
      } else if (lower.includes("jelantah") || lower.includes("minyak")) {
        reply = "Minyak jelantah kami terima dengan harga Rp 3.000/kg. Minyak jelantah ini nantinya akan kami olah kembali menjadi sabun pembersih serbaguna ramah lingkungan.";
      } else if (lower.includes("botol") || lower.includes("plastik")) {
        reply = "Untuk botol plastik bersih dihargai Rp 2.000/kg, sedangkan yang kotor Rp 1.000/kg. Gelas plastik bersih Rp 2.500/kg. Dianjurkan dibersihkan dan dipipihkan terlebih dahulu ya!";
      } else if (lower.includes("kardus") || lower.includes("kertas")) {
        reply = "Kardus KW 1 dihargai Rp 1.500/kg (KW 2 Rp 1.000/kg). Buku tulis HVS putih tanpa sampul Rp 1.500/kg, dan koran bersih mencapai Rp 7.000/kg.";
      } else if (lower.includes("sembako") || lower.includes("tukar")) {
        reply = "Saldo tabungan sampah dapat ditukarkan kapan saja dengan sembako di warung pengurus kami, atau disimpan untuk persiapan hari raya dan biaya sekolah anak.";
      } else {
        reply = "Terima kasih atas pertanyaannya! Di Bank Sampah Cahaya Kerja, kami menerima aneka sampah terpilah (kardus, plastik, minyak jelantah, kertas). Silakan tanyakan kategori harga spesifik atau ajukan penjemputan ke pengurus ya! 🌱";
      }

      setMessages([...updatedMessages, { role: "assistant", text: reply }]);
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}>
      {/* Tombol Floating */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: "var(--forest, #153f32)",
            color: "white",
            padding: "14px 20px",
            borderRadius: "999px",
            border: "0",
            boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "14px"
          }}
        >
          <Sparkles size={18} style={{ color: "#e6a429" }} />
          <span>Tanya Pilah Sampah (AI)</span>
        </button>
      )}

      {/* Kotak Chat */}
      {isOpen && (
        <div
          style={{
            width: "360px",
            maxWidth: "90vw",
            height: "490px",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
            border: "1px solid #dfe5df",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          {/* Header Chat */}
          <div
            style={{
              background: "var(--forest, #153f32)",
              color: "white",
              padding: "16px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  display: "grid",
                  placeItems: "center"
                }}
              >
                <Bot size={20} style={{ color: "#62a567" }} />
              </div>
              <div>
                <b style={{ fontSize: "14px", display: "block" }}>Cahaya AI</b>
                <small style={{ fontSize: "11px", color: "#a4c2b5" }}>Asisten Pemilahan & Harga</small>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "transparent", border: 0, color: "white", cursor: "pointer" }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Area Percakapan */}
          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              background: "#f8faf8",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "13px"
            }}
          >
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  gap: "8px",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start"
                }}
              >
                {m.role === "assistant" && (
                  <div
                    style={{
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      background: "#246348",
                      color: "white",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0
                    }}
                  >
                    <Bot size={14} />
                  </div>
                )}
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "10px 14px",
                    borderRadius: m.role === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                    background: m.role === "user" ? "#153f32" : "white",
                    color: m.role === "user" ? "white" : "#131b18",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    lineHeight: "1.5"
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "#6d7a74" }}>
                <Bot size={16} />
                <span style={{ fontSize: "12px" }}>Sedang mengetik...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSend}
            style={{
              padding: "12px",
              background: "white",
              borderTop: "1px solid #dfe5df",
              display: "flex",
              gap: "8px"
            }}
          >
            <input
              type="text"
              placeholder="Tanya jenis atau harga sampah..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "999px",
                border: "1px solid #dfe5df",
                outline: "none",
                fontSize: "13px"
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#246348",
                color: "white",
                border: 0,
                display: "grid",
                placeItems: "center",
                cursor: "pointer"
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}