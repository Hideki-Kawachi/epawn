import Item from "../schemas/item";

function nextLetter(sequence) {
	let newSeq;

	if (sequence.charCodeAt(1) >= 90) {
		newSeq =
			sequence.charAt(0) +
			String.fromCharCode(sequence.charCodeAt(1) + 1) +
			"A";
	} else {
		newSeq =
			sequence.charAt(0) + String.fromCharCode(sequence.charCodeAt(1) + 1);
	}

	return newSeq;
}

export default function generateItemID(latestItem) {
	//must have dbConnect before calling

	let latestID = latestItem;
	let idSections = latestID.split("-");
	let numSec = parseInt(idSections[1]);

	if (numSec < 999999) {
		numSec++;
		if (numSec < 10000) {
			latestID = idSections[0] + "-00000" + numSec.toString();
		} else if (numSec < 1000) {
			latestID = idSections[0] + "-0000" + numSec.toString();
		} else if (numSec < 100) {
			latestID = idSections[0] + "-000" + numSec.toString();
		} else if (numSec < 10) {
			latestID = idSections[0] + "-00" + numSec.toString();
		} else if (numSec < 100) {
			latestID = idSections[0] + "-0" + numSec.toString();
		} else {
			latestID = idSections[0] + "-" + numSec.toString();
		}
	} else {
		latestID = nextLetter(idSections[0]) + "-000000";
	}
	console.log("RETURNING LATEST ID", latestID);
	return latestID;
}
