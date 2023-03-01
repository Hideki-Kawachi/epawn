export const ironOptions = {
	cookieName: "userData",
	password: process.env.IRON_PASS,
	cookieOptions: {
		secure: process.env.NODE_ENV === "production", //should be true in prod
		maxAge: undefined,
	},
};
