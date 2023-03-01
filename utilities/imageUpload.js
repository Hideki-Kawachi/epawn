function ImageUpload(publicID, image, folder, callback) {
	let uploadPreset = "signed_preset";
	let type = "authenticated";
	let signURL = "true";

	fetch("/api/signUploadForm", {
		method: "POST",
		body: JSON.stringify({
			public_id: publicID,
			upload_preset: uploadPreset,
			folder: folder,
			type: type,
			sign_url: signURL,
		}),
	})
		.then((res) => res.json())
		.then((data) => {
			const formData = new FormData();
			formData.append("file", image);
			formData.append("public_id", publicID);
			formData.append("upload_preset", uploadPreset);
			formData.append("folder", folder);
			formData.append("sign_url", signURL);
			formData.append("type", type);
			formData.append("api_key", data.apiKey);
			formData.append("timestamp", data.timestamp);
			formData.append("signature", data.signature);

			callback(formData);
		});
}
