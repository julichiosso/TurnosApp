import Image from "next/image";

export default function HeroSection() {
    return (
        <section className="relative h-[200px] w-full flex flex-col items-center justify-center overflow-hidden bg-black">
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-[url('/bg-hero.jpg')] bg-cover bg-center opacity-15"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>

            <div className="relative z-10 flex flex-col items-center text-center px-4">
                {/* Placeholder para logo */}
                <div className="w-16 h-16 bg-rojo rounded-full flex items-center justify-center mb-2 shadow-lg shadow-rojo/20">
                    <span className="text-white font-black text-xl italic uppercase">TM</span>
                </div>

                <h1 className="text-white text-3xl font-extrabold tracking-tighter uppercase italic">
                    RESERVÁ TU <span className="text-rojo">TURNO</span>
                </h1>

                <div className="mt-1">
                    <p className="text-rojo text-[10px] font-bold tracking-[0.2em] uppercase">
                        Chapa · Pintura · Granizo · Parabrisas
                    </p>
                </div>

                <p className="text-texto-muted text-[10px] mt-1 font-medium">
                    Av. Alberdi 739, San Jorge, Santa Fe
                </p>
            </div>
        </section>
    );
}
