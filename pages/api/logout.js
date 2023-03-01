import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from "../../utilities/config";

export default withIronSessionApiRoute(logout, ironOptions);

async function logout(req, res) {
	req.session.destroy();
	res.json("Session ended");
}
