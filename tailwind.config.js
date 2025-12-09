/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    black: '#050505',      /* Pitch Black */
                    offblack: '#0F0F0F',   /* Soft Black */
                    white: '#F5F5F5',      /* Off White */
                    gold: '#C8A97E',       /* Muted Champagne Gold */
                    gray: '#888888',       /* Neutral Gray */
                    sand: '#E5E5E5',       /* Sand */
                    ivory: '#FFFFF0',      /* Ivory */
                    cream: '#F5F5DC',      /* Cream */
                    charcoal: '#36454F',   /* Charcoal */
                    antique: '#8B4513'     /* Antique Gold Base */
                }
            },
            fontFamily: {
                serif: ['"Italiana"', 'serif'],
                sans: ['"Montserrat"', 'sans-serif'],
                display: ['"Italiana"', 'serif'],
            },
            transitionTimingFunction: {
                'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                'cinema': 'cubic-bezier(0.19, 1, 0.22, 1)',
            },
            animation: {
                'sheen': 'sheen 1s ease-in-out infinite',
            },
            keyframes: {
                sheen: {
                    '0%, 100%': { transform: 'translateX(-100%)' },
                    '50%': { transform: 'translateX(100%)' }
                }
            }
        }
    },
    plugins: [],
}
