import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "retro-brown": "#5e292f",
        "retro-red": "#ff3036",
        "retro-orange": "#f55b1d",
        "retro-yellow": "#e0af46",
        "retro-tan": "#e3cfaa",
      },
    },
  },
  plugins: [],
};
export default config;
