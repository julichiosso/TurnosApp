export default function HeroSection() {
    return (
        <section className="relative w-full flex flex-col items-center justify-center overflow-hidden bg-black" style={{ height: "160px" }}>
            {/* Background image — visible */}
            <div className="absolute inset-0 bg-[url('/logo-taller.jpg')] bg-cover bg-center opacity-40" />
            {/* Gradient only covers the bottom half for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/80" />

            <div className="relative z-10 flex flex-col items-center text-center px-4">
                {/* Logo TM — 48px */}
                <div className="rounded-full flex items-center justify-center mb-2 shadow-lg shadow-red-900/30">
                    <span className="text-white font-black text-base uppercase tracking-tight"></span>
                </div>

                <h1 className="text-white font-extrabold tracking-tight uppercase leading-none" style={{ fontSize: "26px" }}>
                    RESERVÁ TU <span className="text-[#CC0000]">TURNO</span>
                </h1>

                <p className="text-[#CC0000] mt-1 font-bold uppercase" style={{ fontSize: "12px", letterSpacing: "0.08em" }}>
                    Chapa · Pintura · Granizo
                </p>

                <p className="text-gray-500 mt-0.5 font-medium" style={{ fontSize: "11px" }}>
                    Av. Alberdi 739, San Jorge
                </p>
            </div>
        </section>
    );
}
