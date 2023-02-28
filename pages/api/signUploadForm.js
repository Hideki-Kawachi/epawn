const cloudinary = require("cloudinary").v2;
const apiSecret = process.env.API_SECRET;
const apiKey = process.env.API_KEY;

export default async function SignUploadForm(req, res) {
	const info = JSON.parse(req.body);

	const timestamp = Math.round(new Date().getTime() / 1000);

	const signature = cloudinary.utils.api_sign_request(
		{
			folder: info.folder,
			public_id: info.public_id,
			timestamp: timestamp,
			type: info.type,
			upload_preset: info.upload_preset,
		},
		apiSecret
	);

	// console.log("API SEC:", apiSecret);
	// console.log("API KEY:", apiKey);
	// console.log("SIGNATURE:", signature);
	// console.log("TIMESTAMP:", timestamp);

	res.json({ timestamp, signature, apiKey: apiKey });
}
