import User from "../schemas/user";

function nextLetter(sequence) {
	let newSeq;

	if (sequence.charCodeAt(2) >= 90) {
		if (sequence.charCodeAt(1) >= 90) {
			newSeq = String.fromCharCode(sequence.charCodeAt(0) + 1) + "AA";
		} else {
			newSeq =
				sequence.charAt(0) +
				String.fromCharCode(sequence.charCodeAt(1) + 1) +
				"A";
		}
	} else {
		newSeq =
			sequence.substring(0, 2) +
			String.fromCharCode(sequence.charCodeAt(2) + 1);
	}

	return newSeq;
}

export default async function generateUserID() {
	//must have dbConnect before calling
	let latestUser = await User.find({}).sort({ userID: -1 }).limit(1);
	let latestID = latestUser[0].userID;
	if (latestID.length == 0) {
		latestID[0] = "AAA-000";
	} else {
		let idSections = latestID.split("-");
		let numSec = parseInt(idSections[1]);

		if (numSec < 999) {
			numSec++;
			if (numSec < 10) {
				latestID = idSections[0] + "-00" + numSec.toString();
			} else if (numSec < 100) {
				latestID = idSections[0] + "-0" + numSec.toString();
			} else {
				latestID = idSections[0] + "-" + numSec.toString();
			}
		} else {
			latestID = nextLetter(idSections[0]) + "-000";
		}
	}

	return latestID;
}
