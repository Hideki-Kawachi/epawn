import mongoose from "mongoose";
import Test from "../../schemas/test";
import dbConnect from "../../utilities/dbConnect";

export default async function NotifTable(req, res) {
	dbConnect();

	let all = null;

	const changeStream = await Test.watch().on("change", async (data) => {
		// console.log("hahu");
		all = await Test.find({});
		console.log("all", all);

		if (all) {
			// console.log("ALL IS:", all);
			await changeStream.close();
			res.json(all);
		} else {
			// console.log("NER", all);
		}
	});
}
