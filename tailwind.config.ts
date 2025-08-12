import type { Config } from 'tailwindcss';

const config: Config = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)'],
                bon: ['var(--font-bon)'],
                sahel: ['var(--font-sahel)'],
            },
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
    ],
};
export default config;