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
            keyframes: {
                kenburns: {
                    '0%': { transform: 'scale(1.0) translate(0, 0)', transformOrigin: 'center center' },
                    '100%': { transform: 'scale(1.1) translate(2%, -2%)', transformOrigin: 'center center' },
                },
            },
            animation: {
                kenburns: 'kenburns 20s ease-out infinite alternate-reverse both',
            },
        },
    },
    plugins: [
        require('@tailwindcss/line-clamp'),
    ],
};
export default config;
