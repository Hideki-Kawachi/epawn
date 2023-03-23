import Redeem from "../schemas/redeem";

function nextLetter(sequence) {
	let newSeq;

	if (sequence.charCodeAt(1) >= 90) {
		newSeq =
			sequence.charAt(0) +
			String.fromCharCode(sequence.charCodeAt(1) + 1) +
			"D";
	} else {
		newSeq =
			sequence.charAt(0) + String.fromCharCode(sequence.charCodeAt(1) + 1);
	}

	return newSeq;
}

export default async function generateRedeemID() {
	//must have dbConnect before calling
	let latestRedeem = await Redeem.find({}).sort({ redeemID: -1 }).limit(1);
	let latestID;

	if (latestRedeem.length == 0) {
		latestID = "RED-000000";
	} else {
		latestID = latestRedeem[0].redeemID;
		let idSections = latestID.split("-");
		let numSec = parseInt(idSections[1]);

		if (numSec < 999999) {
			numSec++;
			if (numSec < 10) {
				latestID = idSections[0] + "-00000" + numSec.toString();
			} else if (numSec < 100) {
				latestID = idSections[0] + "-0000" + numSec.toString();
			} else if (numSec < 1000) {
				latestID = idSections[0] + "-000" + numSec.toString();
			} else if (numSec < 10000) {
				latestID = idSections[0] + "-0" + numSec.toString();
			} else {
				latestID = idSections[0] + "-" + numSec.toString();
			}
		} else {
			latestID = nextLetter(idSections[0]) + "-000000";
		}
	}

	return latestID;
}
