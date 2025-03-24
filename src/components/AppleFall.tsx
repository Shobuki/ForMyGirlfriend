import { Apple } from "lucide-react";

const AppleFall = () => {
  const apples = Array.from({ length: 10 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {apples.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = 5 + Math.random() * 5;

        return (
          <div
            key={i}
            className="absolute"
            style={{
              top: "-10%",
              left: `${left}%`,
              animation: `fall ${duration}s linear ${delay}s infinite, sway 3s ease-in-out infinite`,
            }}
          >
            <Apple className="text-red-500" style={{ width: 24, height: 24 }} />
          </div>
        );
      })}
    </div>
  );
};

export default AppleFall;
