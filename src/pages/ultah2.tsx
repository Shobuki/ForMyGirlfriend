import React, { useEffect, useState } from "react";

// ===== Gemini API =====
const GEMINI_API_KEY = "AIzaSyBnk0uFETv54L0xaAXLG_er6ZUa_A5JzIM";
const GEMINI_PROMPT = `
Buatkan puisi ulang tahun yang sangat romantis untuk perempuan bernama Jeslyn, berisi harapan panjang umur, kebahagiaan, dan ungkapan cinta. Tulis dalam 5 bait, bahasa Indonesia, gunakan rima dan diksi puitis, tapi tetap personal seperti dari kekasih.
`;

const fallbackPoem = [
  "Di hari bahagia, cahaya terpancar di wajahmu, Jeslyn tercinta,",
  "Semoga setiap detik hidupmu selalu berwarna, penuh tawa.",
  "Panjang umur, sehat selalu, dan impianmu tak lagi hanya angan.",
  "Aku ingin menjadi alasan senyummu, penghapus segala kesedihan.",
  "Selamat ulang tahun, sayangku, di setiap doa, namamu kutitipkan."
].join("\n");

// CLIENT-ONLY BALLOONS/CONFETTI
function PinkBalloonsClientOnly() {
  const [balloons, setBalloons] = useState<any[]>([]);
  const [confetti, setConfetti] = useState<any[]>([]);
  useEffect(() => {
    // Generate balloons only in client
    const b = Array.from({ length: 11 }, (_, i) => ({
      left: 6 + Math.random() * 88,
      delay: Math.random() * 6,
      duration: 8 + Math.random() * 5,
      scale: 0.92 + Math.random() * 0.24,
      color:
        Math.random() > 0.6
          ? "#fd2d85"
          : Math.random() > 0.5
          ? "#fdbaec"
          : "#ff90b3",
    }));
    setBalloons(b);
    const c = Array.from({ length: 21 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 5 + Math.random() * 2.5,
      size: 13 + Math.random() * 12,
      color:
        Math.random() > 0.7
          ? "#fff6fa"
          : Math.random() > 0.48
          ? "#fdbaec"
          : "#ffd6ec",
      rotate: Math.random() * 360,
      shape: Math.random() > 0.6 ? "★" : "✦",
    }));
    setConfetti(c);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {balloons.map((b, i) => (
        <span
          key={i}
          className="absolute animate-balloon"
          style={{
            left: `${b.left}%`,
            bottom: "-80px",
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            transform: `scale(${b.scale})`,
            opacity: 0.86,
            zIndex: 1,
          }}
        >
          <svg width="38" height="75" viewBox="0 0 38 75">
            <ellipse cx="19" cy="29" rx="18" ry="27" fill={b.color} />
            <rect x="16" y="55" width="6" height="16" rx="3" fill="#ffe8f3" />
            <path d="M19 56 Q19 62, 24 72" stroke="#f9b0cf" strokeWidth="2" fill="none"/>
          </svg>
        </span>
      ))}
      {confetti.map((c, i) => (
        <span
          key={`c-${i}`}
          className="absolute animate-confetti"
          style={{
            left: `${c.left}%`,
            top: "-18px",
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            fontSize: `${c.size}px`,
            color: c.color,
            opacity: 0.97,
            transform: `rotate(${c.rotate}deg)`,
            zIndex: 2,
          }}
        >
          {c.shape}
        </span>
      ))}
    </div>
  );
}

// Rainbow Text
function RainbowLines({ text }: { text: string }) {
  const pastelGradients = [
    "linear-gradient(90deg,#ff90b3,#fdbaec 60%,#ffd6ec)",
    "linear-gradient(90deg,#f9b0cf,#fd2d85 60%,#fff6fa)",
    "linear-gradient(90deg,#fdbaec,#fd2d85,#f9b0cf)",
    "linear-gradient(90deg,#fdbaec,#ff90b3,#f9b0cf)",
    "linear-gradient(90deg,#ffd6ec,#fd2d85,#fdbaec)",
    "linear-gradient(90deg,#fff6fa,#fdbaec,#ffd6ec)",
  ];
  return (
    <div className="flex flex-col gap-2 items-center">
      {text.split(/\n|<br\s*\/?>/g).map((line, i) =>
        <span
          key={i}
          className="rainbow-text font-bold"
          style={{
            background: pastelGradients[i % pastelGradients.length],
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
            fontSize: "1.09em",
            animation: `shimmer 2.7s linear ${i * 0.19}s infinite`,
            fontFamily: "'Quicksand', 'Inter', sans-serif",
            letterSpacing: ".08em",
            padding: "0 .15em"
          }}
        >{line}</span>
      )}
    </div>
  );
}

// ========== MAIN PAGE ==========
export default function Ultah2Page() {
  const [poem, setPoem] = useState<string>(fallbackPoem);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    async function fetchPoem() {
      try {
        const url =
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
          GEMINI_API_KEY;

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: GEMINI_PROMPT }] }]
          })
        });

        if (!res.ok) {
          const text = await res.text();
          setErrorMsg(`Gagal generate puisi: [${res.status}] ${text}`);
          setPoem(fallbackPoem);
          setLoading(false);
          return;
        }

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && typeof text === "string") {
          setPoem(text);
        } else {
          setErrorMsg("Format respons Gemini tidak sesuai.");
          setPoem(fallbackPoem);
        }
      } catch (err: any) {
        setErrorMsg("Terjadi error koneksi ke Gemini API.");
        setPoem(fallbackPoem);
      }
      setLoading(false);
    }
    fetchPoem();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-pink-200 to-fuchsia-200 relative overflow-x-hidden py-14">
      {/* Balloons & Confetti only on client */}
      <PinkBalloonsClientOnly />

      {/* Header */}
      <div className="absolute top-0 left-0 w-full flex justify-center mt-7 pointer-events-none z-10">
        <h1
          className="text-5xl font-pacifico font-bold text-center bg-gradient-to-r from-pink-400 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text drop-shadow-pink-glow animate-bounce select-none shadow-xl"
          style={{
            textShadow: "0 5px 32px #fd2d8577, 0 1.5px 0 #fff7",
            letterSpacing: ".05em"
          }}
        >
          🎂 Happy Birthday Jeslyn! 🎉
        </h1>
      </div>

      {/* Kartu Puisi */}
      <div className="mt-40 md:mt-52 flex flex-col items-center justify-center gap-4 z-20 relative">
        <div className="rounded-3xl shadow-2xl border-2 border-pink-200 bg-white/95 p-8 pb-7 w-[97vw] max-w-lg text-center relative glassy-card" style={{backdropFilter:"blur(10px)"}}>
          <span className="text-lg font-quicksand font-bold mb-4 block tracking-wide bg-gradient-to-r from-pink-500 to-fuchsia-400 text-transparent bg-clip-text" style={{letterSpacing:".07em"}}>
            Puisi Spesial Untukmu 💖
          </span>
          <div className="font-quicksand font-medium text-pink-700 mb-3 text-base" style={{letterSpacing:".04em"}}>
            Untuk Jeslyn, Bidadariku di Hari Bahagia
          </div>
          <div className="text-base md:text-lg font-quicksand leading-relaxed mb-7 animate-fade-in-slow px-2">
            {loading ? (
              <span className="italic text-pink-400 block my-5">Lagi buat puisinya dulu ya...</span>
            ) : (
              <RainbowLines text={poem} />
            )}
            {errorMsg && (
              <div className="text-pink-400 text-xs mt-3">{errorMsg}</div>
            )}
          </div>

          {/* Audio Only (YouTube, autoplay, hidden video) */}
          <div className="w-full flex flex-col items-center gap-1">
            <span className="text-pink-400 font-quicksand text-sm mb-2">
              Putar lagu spesial buat kamu (dengarkan sampai habis ya!)
            </span>
            <iframe
              width="1"
              height="1"
              style={{
                minWidth: "1px",
                minHeight: "1px",
                border: "none",
                opacity: 0.001,
                pointerEvents: "none",
                position: "absolute"
              }}
              src="https://www.youtube.com/embed/WtLXpfPpb-k?autoplay=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1"
              title="Lagu Ulang Tahun"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              tabIndex={-1}
            />
            <audio controls autoPlay loop className="w-full max-w-[260px] rounded-xl shadow-pink-200 border border-pink-200 mt-3 bg-white/70" style={{ boxShadow: "0 2px 10px #fec0ef55" }}>
              <source src="https://docs.google.com/uc?export=open&id=1V0mOJv44UN7DdNHTtz9AfUexfKgeRT-9" type="audio/mp3" />
              (Jika audio YouTube gagal, lagu offline akan diputar.)
            </audio>
          </div>
        </div>
      </div>

      {/* Dekorasi bawah: Heart-floating */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-none z-20">
        <span className="text-5xl animate-heartfloat" style={{ color: "#fd2d85" }}>♥</span>
        <span className="text-4xl animate-heartfloat2" style={{ color: "#fdbaec" }}>♥</span>
        <span className="text-3xl animate-heartfloat3" style={{ color: "#f9b0cf" }}>♥</span>
      </div>

      {/* Google Fonts & custom animation */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Quicksand:wght@500;700&display=swap');
        body {
          font-family: 'Quicksand', 'Inter', sans-serif;
          background: #ffe8f3;
        }
        .font-pacifico { font-family: 'Pacifico', cursive; }
        .font-quicksand { font-family: 'Quicksand', sans-serif; }
        .glassy-card {
          background: rgba(255,255,255,0.94);
          box-shadow: 0 8px 36px 0 rgba(252,150,208,0.13), 0 1.5px 8px 0 #fec0ef88;
          border: 2.5px solid #fff3fa99;
          backdrop-filter: blur(10px);
        }
        .drop-shadow-pink-glow {
          filter: drop-shadow(0 4px 16px #fd2d8580);
        }
        .animate-fade-in-slow {
          animation: fadein 2s;
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: none;}
        }
        @keyframes shimmer {
          0% { background-position: -350px 0; }
          100% { background-position: 350px 0; }
        }
        .rainbow-text {
          background-size: 320% 100%;
          background-position: 0 0;
          transition: background-position 1.5s cubic-bezier(.77,0,.18,1);
        }
        .rainbow-text:hover {
          background-position: 100% 0;
          filter: brightness(1.12) drop-shadow(0 2px 6px #fd2d8570);
        }
        @keyframes balloon {
          0% { transform: translateY(80px) scale(var(--balloon-scale,1)); opacity:0.5;}
          8% { opacity:1;}
          92% { opacity:1;}
          100% { transform: translateY(-105vh) scale(var(--balloon-scale,1)); opacity:0.1;}
        }
        .animate-balloon { animation-name: balloon; animation-timing-function: cubic-bezier(.49,1,.71,-0.22); animation-iteration-count: infinite; }
        @keyframes confetti {
          0% { transform: translateY(-10px) rotate(0);}
          50% { transform: translateY(55vh) rotate(180deg);}
          100% { transform: translateY(105vh) rotate(360deg); opacity:.2;}
        }
        .animate-confetti { animation-name: confetti; animation-timing-function: linear; animation-iteration-count: infinite;}
        @keyframes heartfloat {
          0% { transform: translateY(0) scale(1);}
          100% { transform: translateY(-42px) scale(1.13);}
        }
        @keyframes heartfloat2 {
          0% { transform: translateY(0) scale(1);}
          100% { transform: translateY(-34px) scale(1.08);}
        }
        @keyframes heartfloat3 {
          0% { transform: translateY(0) scale(1);}
          100% { transform: translateY(-28px) scale(1.11);}
        }
        .animate-heartfloat { animation: heartfloat 2.2s ease-in-out infinite alternate;}
        .animate-heartfloat2 { animation: heartfloat2 2.7s ease-in-out infinite alternate;}
        .animate-heartfloat3 { animation: heartfloat3 3.1s ease-in-out infinite alternate;}
      `}</style>
    </div>
  );
}
