"use client";

export default function ScrollHintButton({ targetId }: { targetId: string }) {
  const handleScroll = () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <button
      onClick={handleScroll}
      className="mt-auto mb-6 text-white text-sm md:text-base italic drop-shadow hover:underline"
    >
      💌 Lanjut ke bagian selanjutnya ⬇️
    </button>
  );
}
