export default async function ItemAppraisal(req, res) {
	let body = JSON.parse(req.body);
	let itemList = body.itemList;
	let appraisalPrice = body.appraisalPrice;
	console.log("item list:", itemList);
	console.log("appraisal price:", appraisalPrice);

	res.json("ASD");
}
