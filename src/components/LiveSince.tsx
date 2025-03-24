"use client";
import { useEffect, useMemo, useState } from "react";


export default function LiveSince() {
    const startDate = useMemo(() => new Date("2024-12-25T07:30:00"), []);
  const [time, setTime] = useState({
    days: 0,
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();

      const seconds = Math.floor(diff / 1000) % 60;
      const minutes = Math.floor(diff / (1000 * 60)) % 60;
      const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      setTime({
        days,
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [startDate]); // ✅ DEPENDENCY FIXED

  const TimerBox = ({
    label,
    value,
  }: {
    label: string;
    value: string | number;
  }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/90 backdrop-blur-sm text-rose-600 text-5xl md:text-6xl px-6 py-4 rounded-xl border-2 border-rose-200 shadow-lg shadow-rose-100/50 transition-all duration-300 hover:scale-105">
        <span className="font-great-vibes">{value}</span>
      </div>
      <div className="text-xs md:text-sm text-rose-600/80 mt-3 tracking-widest font-dancing-script">
        {label}
      </div>
    </div>
  );

  return (
    <div className="text-center p-8 max-w-4xl mx-auto">
      <p className="text-rose-600 italic text-xl md:text-2xl mb-8 font-dancing-script">
        &quot;Kisah kita telah berlangsung selama 💖&quot; {/* ✅ ESCAPE QUOTES */}
      </p>
      <div className="flex justify-center items-end gap-5 flex-wrap">
        <TimerBox label="Hari" value={time.days} />
        <div className="text-rose-500 text-4xl mb-4">:</div>
        <TimerBox label="Jam" value={time.hours} />
        <div className="text-rose-500 text-4xl mb-4">:</div>
        <TimerBox label="Menit" value={time.minutes} />
        <div className="text-rose-500 text-4xl mb-4">:</div>
        <TimerBox label="Detik" value={time.seconds} />
      </div>
    </div>
  );
}
