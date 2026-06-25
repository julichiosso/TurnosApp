import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: "#0A0A0A",
                surface: "#141414",
                "surface-2": "#1E1E1E",
                rojo: "#CC0000",
                "rojo-hover": "#AA0000",
                texto: "#FFFFFF",
                "texto-muted": "#9CA3AF",
                borde: "#2A2A2A",
            },
            fontFamily: {
                sans: ["DM Sans", "sans-serif"],
            },
        },
    },
    plugins: [],
};
export default config;
