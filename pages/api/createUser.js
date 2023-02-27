import dbConnect from "../../utilities/dbConnect";

export default function CreateUser(req, res) {
	dbConnect();

	let body = JSON.parse(req.body);

	console.log("body is:", body);
	res.json("good");
}
