import Test from "../../schemas/test";
import dbConnect from "../../utilities/dbConnect";

export default function ButtonClick(req, res) {
	dbConnect();

	Test.create({ message: "from notif table created" });
	return res.json("good");
}
