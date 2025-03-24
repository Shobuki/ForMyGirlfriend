import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import Stars from "@/components/Stars";
import ScrollHintButton from "@/components/ScrollHint";
import LiveSince from "@/components/LiveSince";
import Waves from "@/components/Waves";
import Image from "next/image";
import { motion } from "framer-motion";

import { useRouter } from "next/navigation";
import { useRef } from "react";





import { Flower, Apple } from "lucide-react";


// Ganti nama file juga dari FlowerFall → SakuraFall












export default function Home() {

    const [activeIndex, setActiveIndex] = useState(0);

    const imageUrls: string[] = [
        "https://drive.google.com/uc?id=17WavSAyLKnLdhBMAO7MET_NgYZ_ImBwK",
        "https://drive.google.com/uc?id=17TPBbVwcbdc463CFa3yIiy8YsPq1-HlY",
        "https://drive.google.com/uc?id=17TgltJRx-kRdLZqZd84spVL2bGYg2rvD",
    ];

    // ⏱️ Otomatis slide
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % imageUrls.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [imageUrls.length]);

    // 👆 Swipe gesture
    const swipeHandlers = useSwipeable({
        onSwipedLeft: () =>
            setActiveIndex((prev) => (prev + 1) % imageUrls.length),
        onSwipedRight: () =>
            setActiveIndex((prev) =>
                prev === 0 ? imageUrls.length - 1 : prev - 1
            ),
        preventScrollOnSwipe: true,
        trackMouse: true,
    });



    const FloralBorder = () => (
        <>
            {/* TOP - Putih & berputar */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex space-x-2 z-20 text-white">
                <Flower color="pink" className="w-6 h-6 animate-spin-slow" />
                <Flower color="pink" className="w-6 h-6 animate-spin-slow" />
            </div>

            {/* BOTTOM - Putih & berputar */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 rotate-180 z-20 text-white">
                <Flower color="pink" className="w-6 h-6 animate-spin-slow" />
                <Flower color="pink" className="w-6 h-6 animate-spin-slow" />
            </div>

            {/* LEFT - Merah & blink */}
            <div className="absolute top-1/2 -left-5 -translate-y-1/2 flex flex-col space-y-2 z-20 text-red-500">
                <Apple color="red" className="w-5 h-5 animate-blink" />
                <Apple color="red" className="w-5 h-5 animate-blink" />
            </div>

            {/* RIGHT - Merah & blink */}
            <div className="absolute top-1/2 -right-5 -translate-y-1/2 flex flex-col space-y-2 z-20 text-red-500">
                <Apple color="red" className="w-5 h-5 animate-blink" />
                <Apple color="red" className="w-5 h-5 animate-blink" />
            </div>
        </>
    );


    const typingVariant = {
        hidden: { opacity: 0, width: 0 },
        visible: (i: number) => ({
            opacity: 1,
            width: "100%",
            transition: {
                delay: i * 1,
                duration: 1.5,
                ease: "easeInOut"
            },
        }),
    };

    const router = useRouter();


    const noBtnRef = useRef<HTMLButtonElement>(null);
    const [noBtnPos, setNoBtnPos] = useState({ x: 0, y: 0 });
    const [noIsFlying, setNoIsFlying] = useState(false);

    const moveNoButton = () => {
        setNoIsFlying(true);
        const button = noBtnRef.current;
        if (!button) return;

        // Dapatkan container parent
        const container = button.parentElement;
        if (!container) return;

        // Hitung dimensi container dan tombol
        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        // Hitung batas maksimum dengan margin 10px
        const maxX = containerRect.width - buttonRect.width - 10;
        const maxY = containerRect.height - buttonRect.height - 10;

        // Generate posisi acak dalam batas yang aman
        const randX = Math.random() * maxX + 5;
        const randY = Math.random() * maxY + 5;

        setNoBtnPos({ x: randX, y: randY });
    };





    return (
        <>
            {/* SCROLL HINT DI LUAR MAIN */}



            {/* SEMUA SECTION */}
            <main className="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth">
                {/* SECTION 1 */}

                <section
                    id="section-1"
                    className="relative snap-start h-screen w-full bg-pink-400 flex flex-col justify-between items-center px-4 py-8"
                >
                    <Stars />

                    {/* Konten Tengah */}
                    <div className="flex-1 flex flex-col justify-center items-center">
                        <p className="text-white text-lg mb-4">Halo Jeslyn ✨</p>
                        <div className="rounded-full overflow-hidden shadow-lg border-4 border-white w-[100px] h-[100px] md:w-[300px] md:h-[300px]">
                            <Image
                                src="https://media2.giphy.com/media/Cmr1OMJ2FN0B2/giphy.gif"
                                alt="penguin"
                                width={300}
                                height={300}
                                className="w-full h-full object-cover"
                            />

                        </div>
                    </div>

                    {/* Tombol ScrollHint tetap di bawah, tapi tidak "keluar" dari section */}
                    <ScrollHintButton targetId="section-2" />
                </section>


                {/* SECTION 2 */}
                <section
                    id="section-2"
                    className="relative snap-start h-screen w-full bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex flex-col justify-between items-center px-4 py-8"
                >
                    <Stars />
                    <div className="meteor" />

                    {/* Tengah */}
                    <div className="flex-1 flex items-center justify-center z-10 text-center">
                        <h1 className="text-white text-4xl font-bold">
                            Kita ternyata dah lama ya pacaran hehe
                        </h1>

                    </div>

                    {/* Scroll hint di bawah */}
                    <ScrollHintButton targetId="section-3" />
                </section>


                {/* SECTION 3 */}


                <section
                    id="section-3"
                    className="relative snap-start h-screen w-full bg-gradient-to-br from-cyan-500 to-blue-600 flex flex-col justify-between items-center px-4 pt-8 overflow-hidden"
                >
                    <Stars />

                    <div className="flex-1 flex flex-col items-center justify-center z-10 text-center">
                        <LiveSince />
                        <p className="text-white text-lg mt-6 italic shadow-lg">
                            Ternyata udah lama banget ya :O ❤️
                        </p>
                    </div>

                    <Waves />
                    <ScrollHintButton targetId="section-4" />


                </section>

                <section id="section-4" className="relative snap-start h-screen w-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 flex flex-col justify-between items-center px-4 py-8">
                    <div className="flex-1 flex flex-col items-center justify-center z-10 text-center">
                        <h1 className="text-white text-4xl font-bold mb-6 animate-appear font-dancing-script">
                            Ini video kemarin :D
                        </h1>
                        <iframe
                            src="https://drive.google.com/file/d/17SsmgnO2Y_VV8_KKPzXzxQx0CFgIs1aM/preview"
                            width="640"
                            height="480"
                            allow="autoplay; encrypted-media"
                            className="rounded-lg shadow-lg"
                        ></iframe>
                    </div>
                </section>


                {/* SECTION 5 */}
                <section
                    id="section-5"
                    className="relative snap-start h-screen w-full bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 flex flex-col justify-between items-center px-4 py-8"
                >


                    <Stars />

                    <div className="flex-1 flex flex-col justify-center items-center space-y-6">
                        <h1 className="text-white text-3xl font-bold text-center mb-4">
                            Kenangan Kita 😍
                        </h1>

                        <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[500px] z-10">
                            {/* Carousel Image with border */}
                            <div
                                {...swipeHandlers}
                                className="overflow-hidden w-full h-full rounded-xl shadow-lg border-4 border-rose-300 relative z-0"
                            >
                                <div
                                    className="flex transition-transform duration-700 ease-in-out"
                                    style={{
                                        transform: `translateX(-${activeIndex * 100}%)`,
                                    }}
                                >
                                    {imageUrls.map((url, index) => (
                                        <div key={index} className="min-w-full h-full">
                                            <Image
                                                src={url}
                                                alt={`slide-${index}`}
                                                width={400}
                                                height={500}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Floral decoration di atas border */}
                            <FloralBorder />
                        </div>





                        {/* Indikator */}
                        <div className="flex space-x-2">
                            {imageUrls.map((_, index) => (
                                <span
                                    key={index}
                                    className={`w-3 h-3 rounded-full ${activeIndex === index ? "bg-white" : "bg-white/50"
                                        }`}
                                ></span>
                            ))}
                        </div>
                    </div>


                    <ScrollHintButton targetId="section-6" />
                </section>






                <section
                    id="section-6"
                    className="relative snap-start h-screen w-full bg-gradient-to-br from-red-100 via-pink-100 to-rose-100 flex flex-col justify-center items-center px-4 py-8 overflow-hidden"
                >


                    {/* Konten Puisi */}
                    <div className="relative z-10 max-w-2xl text-center space-y-6 px-8 py-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border-4 border-white shadow-none">
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2">

                        </div>

                        <h2 className="text-3xl font-dancing-script text-red-500 mb-12">
                            &#10084; Untuk Jeslyn &#10084;
                        </h2>

                        <h2 className="text-3xl font-dancing-script text-red-500 mb-12">
                            &#10084;  &#10084;
                        </h2>
                        <div className="space-y-4 text-red-700 font-dancing-script text-lg leading-relaxed overflow-hidden">
                            {[
                                "Walaupun memori kita belum banyak,",
                                "tapi aku ingin bersamamu selalu membuat memori.",
                                "Mulai dari senyummu di pagi hari,",
                                "hingga genggaman tangan di tengah senja.",
                                "Kita pernah banyak bertanya hal aneh,",
                                "dan saling diam namun tetap nyaman.",
                                "Aku ingin terus berjalan bersamamu,",
                                "melewati waktu,",
                                "menyusun cerita,",
                                "dalam kisah bernama kita.",
                            ].map((text, i) => (
                                <motion.p
                                    key={i}
                                    className={`overflow-hidden whitespace-nowrap mx-auto ${i === 9 ? "text-red-500 font-semibold" : ""}`}
                                    custom={i}
                                    variants={typingVariant}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {text}
                                </motion.p>
                            ))}


                            <div className="flex justify-center py-8">
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                                >
                                    <Apple color="red" className="w-8 h-8" />
                                </motion.div>
                            </div>

                        </div>


                    </div>




                </section>


                <section
                    id="section-7"
                    className="relative snap-start h-screen w-full bg-gradient-to-br from-pink-200 via-pink-300 to-pink-400 flex flex-col justify-center items-center px-4 overflow-hidden"
                >
                    <h1 className="text-3xl font-dancing-script text-center text-red-600 mb-12">
                        Apakah kamu masih mau jadi pacarku? 🥺❤️
                    </h1>

                    <div className="relative w-full h-48 flex justify-center items-center">
                        <button
                            onClick={() => router.push("/yay")}
                            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 z-10"
                        >
                            Yes ❤️
                        </button>

                        <button
                            ref={noBtnRef}
                            onMouseEnter={moveNoButton}
                            className={`px-6 py-3 bg-gray-300 text-black font-semibold rounded-xl shadow-lg transition-all duration-300 z-10 ${noIsFlying ? "absolute" : "ml-6 relative"
                                }`}
                            style={noIsFlying ? {
                                left: `${noBtnPos.x}px`,
                                top: `${noBtnPos.y}px`,
                                transition: 'left 0.3s, top 0.3s' // Tambahkan animasi smooth
                            } : {}}
                        >
                            No 💔
                        </button>
                    </div>
                    <div className="rounded-full overflow-hidden shadow-lg border-4 border-white w-[100px] h-[100px] md:w-[300px] md:h-[300px]">
                        <Image
                            src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjVzbWFoeGFoN2xzYjFzZTJ4NXN0ejd1YmZndm1yNjkyN2Ftamd3MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/gXhBZfzijya76/giphy.gif"
                            alt="crab"
                            width={300}
                            height={300}
                            className="w-full h-full object-cover"
                        />

                    </div>
                </section>






            </main>
        </>
    );
}
