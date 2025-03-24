import { Flower } from "lucide-react";

const SakuraFall = () => {
  const petals = Array.from({ length: 12 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {petals.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 5 + Math.random() * 5;
        const size = 16 + Math.random() * 16;

        return (
          <div
            key={i}
            className="absolute"
            style={{
              top: "-10%",
              left: `${left}%`,
              animation: `fall ${duration}s linear ${delay}s infinite, sway 4s ease-in-out infinite`,
            }}
          >
            <Flower className="text-white opacity-70" style={{ width: size, height: size }} />
          </div>
        );
      })}
    </div>
  );
};

export default SakuraFall;
