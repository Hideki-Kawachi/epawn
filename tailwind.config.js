/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		colors: {
			green: {
				500: "#005747",
				400: "#138B75",
				300: "#14C6A5",
				200: "#61EBD1",
				100: "#9FF0E1",
			},
			blue: {
				500: "#18273B",
				400: "#05619E",
				300: "#129CF8",
				200: "#39ACF9",
				100: "#78C9FF",
			},
			red: {
				500: "#FF2525",
				400: "#FD4040",
				300: "#FD5959",
				200: "#FF7070",
				100: "#FF8C8C",
			},
			gray: {
				500: "#202020",
				400: "#464543",
				300: "#8E8C89",
				200: "#CDCCCA",
				100: "#FEFBF8",
			},
			yellow: "FFEA00",
		},
		fontFamily: {
			dosis: ["Dosis", "sans-serif"],
			nunito: ["Nunito", "sans-serif"],
		},
		fontSize: {
			sm: "1.25rem",
			base: "1.5rem",
			lg: "2rem",
			xl: "2.25rem",
			"2xl": "2.75rem",
			"3xl": "3.15rem",
		},
	},
	plugins: [],
};
