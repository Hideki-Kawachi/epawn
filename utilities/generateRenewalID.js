import Renew from "../schemas/renew";

function nextLetter(sequence) {
  let newSeq;

  if (sequence.charCodeAt(1) >= 90) {
    newSeq =
      sequence.charAt(0) +
      String.fromCharCode(sequence.charCodeAt(1) + 1) +
      "N";
  } else {
    newSeq =
      sequence.charAt(0) + String.fromCharCode(sequence.charCodeAt(1) + 1);
  }

  return newSeq;
}

export default async function generateRenewalID() {
  //must have dbConnect before calling
  let latestRenew = await Renew.find({}).sort({ renewID: -1 }).limit(1);
  let latestID;

  if (latestRenew.length == 0) {
    latestID = "REN-000000";
  } else {
    latestID = latestRenew[0].renewID;
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
  }

  return latestID;
}
