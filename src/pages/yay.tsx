"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function YayPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [crazyLevel, setCrazyLevel] = useState(0);
  const [earthquake, setEarthquake] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [explosions, setExplosions] = useState<Array<{ x: number; y: number }>>([]);

  const [randomBg, setRandomBg] = useState("none");
  const [randomTransform, setRandomTransform] = useState("none");
  const [cats, setCats] = useState<Array<{ left: string; top: string; duration: number; src: string }>>([]);
  const [randomScale, setRandomScale] = useState(1);

  useEffect(() => {
    setHasMounted(true); // ✅ fix hydration error
    const gifSources = [
      "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif",
      "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3BwaXJ5NmZibnU5YWdud2tieG45dDBkOHNxbDJqeWlweHBsaWplOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/GeimqsH0TLDt4tScGw/giphy.gif",
      "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3h5bHl6a3hrdnZuaXA2emoxY2V2MGJ2eGwyamF3dXJyZG4zdHl4cSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9d3LQ6TdV2Flo8ODTU/giphy.gif",
      "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmYxeTA1ZnpoaTR4ZnMwNjBvcTlkbHBiNHZlcHBqbWZzZjgwdzR4eiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/M90mJvfWfd5mbUuULX/giphy.gif",
    ];
  
    const generatedCats = Array.from({ length: 100 }).map(() => ({
      left: Math.random() * 100 + "%",
      top: Math.random() * 100 + "%",
      duration: Math.random() * 5 + 2,
      src: gifSources[Math.floor(Math.random() * gifSources.length)],
    }));
  
    setCats(generatedCats);
    setRandomScale(1 + Math.random());
  }, []);
  
  useEffect(() => {
    if (earthquake) {
      const bg = `repeating-linear-gradient(
        45deg,
        #${Math.floor(Math.random() * 16777215).toString(16)},
        #${Math.floor(Math.random() * 16777215).toString(16)}
      )`;
      const transform = `translate(
        ${Math.random() * 20 - 10}px,
        ${Math.random() * 20 - 10}px
      )`;
      setRandomBg(bg);
      setRandomTransform(transform);
    } else {
      setRandomBg("none");
      setRandomTransform("none");
    }
  }, [earthquake]);

  const playRandomSound = () => {
    const sounds = [
      "/sfx/cat.mp3",
      "/sfx/roblox.mp3",
    ];
    const audio = new Audio(sounds[Math.floor(Math.random() * sounds.length)]);
    audio.play();
  };

  useEffect(() => {
    if (earthquake) {
      const interval = setInterval(() => {
        playRandomSound();
      }, 500);
      return () => clearInterval(interval);
    }
  }, [earthquake]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setCursorPos({ x: e.clientX, y: e.clientY });
    if (crazyLevel > 2) {
      setExplosions((prev) => [...prev, { x: e.clientX, y: e.clientY }]);
    }
  };

  const Explosion = ({ x, y }: { x: number; y: number }) => (
    <motion.div
      className="absolute text-4xl"
      initial={{ scale: 0, opacity: 1 }}
      animate={{ scale: 5, opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ left: x, top: y }}
    >
      💥
    </motion.div>
  );

  if (!hasMounted) return null; // ⛔️ jangan render sampai hydration selesai

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center p-8"
      onMouseMove={handleMouseMove}
      style={{ background: randomBg, transform: randomTransform }}
    >
      {cats.map((cat, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: cat.left, top: cat.top }}
          animate={{
            rotate: [0, 360],
            scale: [0.5, 2, 0.5],
            x: [0, 500, -500, 0]
          }}
          transition={{
            duration: cat.duration,
            repeat: Infinity
          }}
        >
         <Image
  src={cat.src}
  width={100}
  height={100}
  alt="cat"
/>

        </motion.div>
      ))}

      <motion.h1
        className="text-9xl font-bold text-center mb-12 z-50"
        animate={{
          rotateX: 360,
          rotateY: 360,
          scale: randomScale
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          repeatType: "mirror"
        }}
      >
        <span style={{ textShadow: "0 0 20px #ff0000" }}>Y</span>
        <span style={{ textShadow: "0 0 20px #00ff00" }}>E</span>
        <span style={{ textShadow: "0 0 20px #0000ff" }}>Y</span>
        <span style={{ textShadow: "0 0 20px #0000ff" }}>Y</span>
        <span style={{ textShadow: "0 0 20px #0000ff" }}>Y</span>
        <span style={{ textShadow: "0 0 20px #0000ff" }}>Y</span>
        <span style={{ textShadow: "0 0 20px #ff00ff" }}>!</span>
      </motion.h1>

      <motion.button
        className="px-8 py-4 text-2xl font-bold bg-black text-white rounded-lg 
          shadow-lg hover:scale-125 transition-all duration-200 z-50"
        onClick={() => {
          setCrazyLevel(prev => prev + 1);
          setEarthquake(true);
          setTimeout(() => setEarthquake(false), 500);
          playRandomSound();
        }}
        whileHover={{ scale: 1.5 }}
        whileTap={{ scale: 0.5 }}
        animate={{
          backgroundColor: [
            "#ff0000",
            "#00ff00",
            "#0000ff",
            "#ffff00",
            "#ff00ff"
          ],
          borderRadius: ["20%", "50%"]
        }}
        transition={{
          duration: 0.3,
          repeat: Infinity
        }}
      >
        KLIK UNTUK LEBIH RUSUH! {crazyLevel > 3 && "🔥".repeat(crazyLevel)}
      </motion.button>

      <motion.div
        className="fixed pointer-events-none text-6xl"
        animate={{
          scale: [1, 2, 1],
          rotate: [0, 360]
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
        style={{
          left: cursorPos.x - 24,
          top: cursorPos.y - 24,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`
        }}
      >
        {["💣", "🎇", "🔪", "👾", "🌪️"][Math.floor(Math.random() * 5)]}
      </motion.div>

      <AnimatePresence>
        {explosions.map((pos, i) => (
          <Explosion key={i} x={pos.x} y={pos.y} />
        ))}
      </AnimatePresence>

      {crazyLevel > 5 && (
        <motion.div
          className="fixed inset-0 bg-red-500 flex items-center justify-center text-9xl font-bold"
          animate={{ opacity: [0, 1] }}
          transition={{ duration: 0.1, repeat: Infinity }}
        >
          ⚠️ WARNING! ⚠️
        </motion.div>
      )}

      <audio autoPlay loop>
        <source src="/sfx/background-chaos.mp3" type="audio/mpeg" />
      </audio>

      <div className="fixed inset-0 crt-effect pointer-events-none" />

      <style jsx global>{`
        .crt-effect {
          background: linear-gradient(
              0deg,
              rgba(0, 0, 0, 0.15) 50%,
              transparent 50%
            ),
            repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.03) 0%,
              rgba(255, 255, 255, 0.03) 1%,
              transparent 1%,
              transparent 2%
            );
          animation: scanline 0.1s linear infinite;
        }

        @keyframes scanline {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 100vh;
          }
        }

        body {
          overflow: hidden;
          cursor: none !important;
        }
      `}</style>
    </div>
  );
}
