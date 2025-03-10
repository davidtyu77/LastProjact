/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./*.{ts,tsx}",
        "*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                sosRed: {
                    DEFAULT: "hsl(0, 100%, 50%)", // Red color for the SOS button
                    dark: "hsl(0, 100%, 40%)",
                    glow: "rgba(255, 0, 0, 0.8)",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                full: "9999px",
            },
            keyframes: {
                "pulse-glow": {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(255, 0, 0, 0.5)" },
                    "50%": { boxShadow: "0 0 30px rgba(255, 0, 0, 0.9)" },
                },
                "sos-press": {
                    "0%": { transform: "scale(1)" },
                    "50%": { transform: "scale(0.95)" },
                    "100%": { transform: "scale(1)" },
                },
                "indicator-blink": {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                },
            },
            animation: {
                "pulse-glow": "pulse-glow 2s infinite ease-in-out",
                "sos-press": "sos-press 0.3s ease-in-out",
                "indicator-blink": "indicator-blink 1s infinite",
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
            boxShadow: {
                "sos-button": "0 0 15px rgba(255, 0, 0, 0.7)",
                "sos-pressed": "0 0 25px rgba(255, 0, 0, 0.9)",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
