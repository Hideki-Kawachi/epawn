import React, { useState, useEffect } from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";
import DetailsCard from "../../../components/redeem/detailsManager";
import Modal from "react-modal";
import Submit from "../../../components/modals/submitManagerRedeem";
import Cancel from "../../../components/modals/cancel";
import ItemCard from "../../../components/itemcard";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../utilities/config";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import DetailsCardRedeemManager from "../../../components/redeem/detailsManager";
import RejectRedeemManager from "../../../components/modals/rejectRedeemManager";
import printPawnTicket from "../../../utilities/printPawnTicket";
import printReceipt from "../../../utilities/printReceipt";
import dbConnect from "../../../utilities/dbConnect";
import Transaction from "../../../schemas/transaction";
import mongoose from "mongoose";
import PawnTicket from "../../../schemas/pawnTicket";
import Branch from "../../../schemas/branch";
import LoadingSpinner from "../../../components/loadingSpinner";
export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req, query }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "manager" && query.transactionID) {
			if (query.transactionID.length >= 24) {
				await dbConnect();
				let transactionInfo = await Transaction.findById(
					new mongoose.Types.ObjectId(query.transactionID.toString())
				);

				if (transactionInfo) {
					let br = await Branch.findOne({
						branchID: transactionInfo.branchID,
					});

					let pawnTicketData = await PawnTicket.find({
						itemListID: transactionInfo.itemListID,
					})
						.sort({ loanDate: -1 })
						.lean();

					let pawnHistory = [];
					for (let ticket of pawnTicketData) {
						console.log("ticket", ticket.transactionID.toString());
						let transaction = await Transaction.findOne({
							_id: new mongoose.Types.ObjectId(ticket.transactionID.toString()),
							status: { $in: ["Done", "Approved"] },
						});

						console.log("transaction:", transaction);

						let branch = await Branch.findOne({
							branchID: transaction.branchID,
						});
						let amountPaid = 0;
						if (transaction.amountPaid > 0) {
							amountPaid = transaction.amountPaid;
						} else amountPaid = 0;

						if (branch && transaction) {
							pawnHistory.push({
								pawnTicketID: ticket.pawnTicketID,
								transactionType: transaction.transactionType,
								branchID: branch.branchName,
								loanDate: dayjs(ticket.loanDate).format("MM/DD/YYYY"),

								amountPaid:
									"Php " +
									amountPaid.toLocaleString("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									}),
								loanAmount:
									"Php " +
									ticket.loanAmount.toLocaleString("en-US", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2,
									}),
							});
						}
					}

					//console.log("Pawn History is: " +  pawnHistory);

					return {
						props: {
							currentUser: req.session.userData,
							transactionData: JSON.parse(JSON.stringify(transactionInfo)),
							pawnHistory: JSON.parse(JSON.stringify(pawnHistory)),
							branchData: JSON.parse(JSON.stringify(br)),
						},
					};
				} else {
					return {
						redirect: { destination: "/" },
					};
				}
			}
			return {
				props: { currentUser: req.session.userData },
			};
		} else if (req.session.userData.role == "customer") {
			return {
				redirect: { destination: "/customer", permanent: true },
				props: {},
			};
		} else {
			return {
				redirect: { destination: "/" },
			};
		}
	},
	ironOptions
);

function RedeemManager({
	currentUser,
	transactionData,
	pawnHistory,
	branchData,
}) {
	// Modals
	const [submitModal, setSubmitOpen] = useState(false); //Submit
	const [cancelModal, setCancelOpen] = useState(false); //Cancel
	const [rejectModal, setRejectModal] = useState(false); //reject redeem
	const [partialPayment, setPartialPayment] = useState(0);
	const [loading, setLoading] = useState(false);
	const [button, setButton] = useState(true)
	//Item List Array
	const [itemList, setitemList] = useState([]);
	const [remainList, setRemainList] = useState([]);
	const [redeemList, setRedeemList] = useState([]);

	//Pawn Ticket Details
	const router = useRouter();
	const [transactionID, setTransactionID] = useState(
		router.query.transactionID
	);

	const [PTNumber, setPTNumber] = useState(""); //test A-123456
	const [ptInfo, setPTinfo] = useState([]);
	const [branch, setBranch] = useState("N/A");
	const [customerID, setCustomerID] = useState("N/A");
	const [customerDetails, setCusDetails] = useState(["N/A"]);
	const [amountToPay, setAmountToPay] = useState(0);
	const [newLoan, setNewLoan] = useState(0);
	const [redeemID, setRedeemID] = useState("N/A");
	const [userInfo, setUserInfo] = useState([]);
	const [cashTendered, setCashTendered] = useState(0);
	const [redeemerInfo, setRedeemerInfo] = useState([]);
	const [redeemerID, setRedeemerID] = useState("");
	const [isOriginal, setOriginal] = useState(true); //if redeemed by original true, if authrep false
	//Item List Backend States
	const [itemListID, setItemListID] = useState("N/A");

	const [sendForm, setSendForm] = useState(false);

	function approveForm() {
		setSubmitOpen(true);
	}

	function cancelForm() {
		setCancelOpen(true);
	}
	function submitForm() {
		setSendForm(true);
	}
	function rejectForm() {
		setRejectModal(true);
	}
	function cancelContentShow() {
		return (
			<>
				Are you sure you want to cancel <b> Redemption</b> of <br />
				<b>{PTNumber}</b>? <br /> <br />
				All unsubmitted data will be lost.
			</>
		);
	}

	function convertFloat(number) {
		return Number(number).toLocaleString("en-US", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}
	function cancelContentShow() {
		return (
			<>
				Are you sure you want to cancel <b> Renewal </b> transaction?
				<br />
				All unsubmitted data will be lost.
			</>
		);
	}

	useEffect(() => {
		if (transactionID != "N/A") {
			fetch("/api/redeem/" + transactionID, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((transaction) => {
					//console.log("Trans is now " + JSON.stringify(transaction._id))
					//  console.log("TransactionID is " + transactionID)
					if (transaction != null) {
						setBranch(transaction.branchID);
					}
				});
		}
	}, [transactionID]);

	useEffect(() => {
		if (transactionID != "N/A") {
			fetch("/api/redeem/manager/" + transactionID, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((redeem) => {
					// console.log(data)
					if (redeem != null) {
						setRedeemID(redeem.redeemID);
						setPTNumber(redeem.pawnTicketID);
						setRedeemerID(redeem.redeemerID);
						setAmountToPay(redeem.payment);
						// console.log(JSON.stringify("Eyo what is this " + redeem.redeemID));
						// console.log("PT is " + redeem.pawnTicketID);
					}
				});
		}
	}, [transactionID]);

	useEffect(() => {
		if (PTNumber != "") {
			fetch("/api/" + PTNumber, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((data) => {
					// console.log(data)
					if (data != null) {
						setCustomerID(data.customerID);
						setPTinfo(data);
						setItemListID(data.itemListID);

						fetch("/api/redeem/partialPayment/" + data.itemListID, {
							method: "GET",
							headers: {
								Accept: "application/json",
								"Content-Type": "application/json",
							},
						})
							.then((res) => res.json())
							.then((partialpay) => {
								//   console.log("Old PT is: " + JSON.stringify(oldpt));
								if (partialpay != null) {
								setPartialPayment(Number(partialpay));
								//   console.log(
								//     "Partial Payment is now: " + partialPayment
								//   );
								} else setPartialPayment(0);
							});
					}
				});
		}
	}, [PTNumber]);

	useEffect(() => {
		if (itemListID != "N/A") {
			fetch("/api/redeem/itemList/" + itemListID, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((info) => {
					// console.log(data)
					if (info != null) {
						// console.log(JSON.stringify(info))
						let list = JSON.stringify(info);
						setitemList(JSON.parse(list)); //temporary
					}
				});
		}
	}, [itemListID]);

	useEffect(() => {
		if (itemList) {
			setRemainList(
				itemList.filter(
					(item) => item.redeemID != redeemID && item.isRedeemed == false
				)
			);
			setRedeemList(itemList.filter((item) => item.redeemID === redeemID));
		}
	}, [itemList, redeemID]);

	// BACKEND TO RETRIEVE CUSTOMER NAME USING USER ID
	useEffect(() => {
		if (customerID != "N/A") {
			fetch("/api/users/" + customerID, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((user) => {
					if (user != null) {
						setUserInfo(user);
						if (user.userID == redeemerID) {
							setRedeemerInfo(user);
							setOriginal(true);
						} else {
							//	console.log("Redeemer is original");
						}
					}
				});
		}
	}, [customerID, redeemerID]);

	useEffect(() => {
		if (redeemerInfo) {
			fetch("/api/users/" + redeemerID, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((info) => {
					if (info != null) {
						setRedeemerInfo(info);
						setOriginal(false);
					}
				});
		}
	}, [redeemerID]);

	// BACKEND TO RETRIEVE CUSTOMER DETAILS WITH USERID
	useEffect(() => {
		if (customerID != "N/A") {
			fetch("/api/users/customers/" + customerID, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			})
				.then((res) => res.json())
				.then((customer) => {
					// console.log(data)
					if (customer != null) {
						setCusDetails(customer);
					}
				});
		}
	}, [customerID]);

	//APPROVE
	useEffect(() => {
		if (sendForm) {
			setLoading(true)
			let transac = {
				transactionID: router.query.transactionID,
				customerID: customerID,
				itemListID: itemListID,
				newLoanAmount: newLoan,
				oldPawnTicket: PTNumber,
				redeemID: redeemID,
				branchID: branch,
				clerkID: transactionData.clerkID,
				transactionType: transactionData.transactionType,
				totalAmount: amountToPay,
				redeemArray: redeemList,
			};
			if (newLoan > 0) {
				// console.log("transac is" + JSON.stringify(transac))
				fetch("/api/redeem/newManagerRedeem", {
					method: "POST",
					body: JSON.stringify(transac),
				})
					.then((res) => res.json())
					.then((data) => {
						console.log("DATA IS:", data);
						if (data != "error") {
							printPawnTicket(data.pawnTicketData);
							printReceipt(data.receiptData);
							router.replace("/");
						} else {
							console.log("error in updating items");
						}
					});
			} else {
				fetch("/api/redeem/newManagerRedeemNoPT", {
					method: "POST",
					body: JSON.stringify(transac),
				})
					.then((res) => res.json())
					.then((data) => {
						console.log("DATA IS:", data);
						if (data != "error") {
							printReceipt(data.receiptData);
							router.replace("/");
						} else {
							console.log("error in updating items");
						}
					});
			}
		}
	}, [sendForm]);
	useEffect(() => {
    if (cashTendered >= amountToPay) {
      setButton(false);
    } else setButton(true);
  }, [cashTendered, amountToPay]);
	return (
    <>
      <NavBar currentUser={currentUser}></NavBar>
      <Header currentUser={currentUser}></Header>
      {/* First Half */}

      <Modal isOpen={submitModal} ariaHideApp={false} className="modal">
        <Submit
          trigger={submitModal}
          setTrigger={setSubmitOpen}
          PTnumber={PTNumber}
          itemList={redeemList}
          setSendForm={setSendForm}
          sendForm={sendForm}
          amountToPay={amountToPay}
          submitForm={submitForm}
        />
      </Modal>

      <Modal isOpen={cancelModal} ariaHideApp={false} className="modal">
        <Cancel
          trigger={cancelModal}
          setTrigger={setCancelOpen}
          content={cancelContentShow()}
        />
      </Modal>

      <Modal isOpen={rejectModal} ariaHideApp={false} className="modal">
        <RejectRedeemManager
          trigger={rejectModal}
          setTrigger={setRejectModal}
          transactionID={transactionID}
          itemList={redeemList}
          redeemer={redeemerInfo}
          isOriginal={isOriginal}
          loading={loading}
          setLoading={setLoading}
        />
      </Modal>

      <LoadingSpinner isLoading={loading}></LoadingSpinner>

      <div id="main-content-area" className="flex-col">
        <p className="mb-5 text-xl font-semibold text-green-500 underline font-dosis">
          Redeem
        </p>
        <div className="flex">
          <DetailsCardRedeemManager
            pawnTicket={ptInfo}
            pawnHistory={pawnHistory}
            branch={branchData.branchName}
            PTNumber={PTNumber}
            user={userInfo}
            customer={customerDetails}
            redeemer={redeemerInfo}
            amountToPay={amountToPay}
            cashTendered={cashTendered}
            setCashTendered={setCashTendered}
            getNewLoan={setNewLoan}
            isOriginal={isOriginal}
            partialPayment={partialPayment}
			redeemList={redeemList}
            remainList={remainList}
          />
        </div>

        {/* Second Half */}

        <div className="flex">
          {/* Remaining Items  */}

          <div className="mt-20">
            <p className="ml-10 text-base font-bold font-nunito">
              Remaining Items:{" "}
            </p>
            {/* plan: CheckItem is ItemCard w/ Check*/}

            {remainList.length > 0 ? (
              <>
                <div className="p-5 mx-10 w-[720px] h-96  overflow-y-scroll bg-white border-2">
                  {remainList.map((item) => (
                    <div className="flex flex-row" key={item.itemID}>
                      <ItemCard key={item.itemID} itemDetails={item}></ItemCard>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-5 mx-10 w-[720px] h-[450px]  overflow-y-scroll bg-white border-2">
                <div className="mt-32 ">
                  <p className="text-xl font-bold text-center text-gray-300 font-nunito">
                    {" "}
                    No items displayed.
                  </p>
                  <p className="text-sm text-center text-gray-300 font-nunito">
                    {" "}
                    All items will be redeemed.
                  </p>
                </div>
              </div>
            )}
          </div>
          {/*Items for Redemption */}
          <div className="mt-20 ">
            <p className="ml-10 text-base font-bold font-nunito">
              Items for Redemption:{" "}
            </p>
            <div className="bg-white p-5 mx-10 w-[720px] h-[450px] overflow-y-scroll border-2">
              {redeemList.map((item) => (
                <ItemCard key={item.itemID} itemDetails={item}></ItemCard>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-row ml-[1180px]">
          <div>
            <button
              className="px-10 mx-2 my-5 text-base text-white bg-red-300"
              onClick={cancelForm}
            >
              Cancel
            </button>
          </div>
          <div>
            <button
              className="px-10 mx-2 my-5 text-base text-white bg-red-500"
              onClick={rejectForm}
            >
              Reject
            </button>
          </div>
          <div>
            <button
              className="px-10 mx-2 my-5 text-base text-white bg-green-300"
              onClick={approveForm} disabled={button}
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RedeemManager;
