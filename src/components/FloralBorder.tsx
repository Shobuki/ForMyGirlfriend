import { Flower, Apple } from "lucide-react";

const FloralBorder = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-0 left-0 right-0 flex justify-between px-8">
      <Flower className="w-12 h-12 text-rose-400/50" />
      <Flower className="w-12 h-12 text-rose-400/50" />
    </div>

    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8">
      <Flower className="w-12 h-12 text-rose-400/50 transform rotate-180" />
      <Flower className="w-12 h-12 text-rose-400/50 transform rotate-180" />
    </div>

    <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-8">
      <Apple className="w-8 h-8 text-red-400/50" />
      <Apple className="w-8 h-8 text-red-400/50" />
    </div>

    <div className="absolute right-0 top-0 bottom-0 flex flex-col justify-between py-8">
      <Apple className="w-8 h-8 text-red-400/50" />
      <Apple className="w-8 h-8 text-red-400/50" />
    </div>
  </div>
);

export default FloralBorder;
