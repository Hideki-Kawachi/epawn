import React, { useState, useEffect } from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";
import DetailsCard from "../../../components/redeem/detailsManager";
import Modal from "react-modal";
import Submit from "../../../components/modals/submitRedeem";
import Cancel from "../../../components/modals/cancel";
import ItemCard from "../../../components/itemcard";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../utilities/config";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import DetailsCardRedeemManager from "../../../components/redeem/detailsManager";
import RejectRedeemManager from "../../../components/modals/rejectRedeemManager";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "manager") {
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

function RedeemManager({ currentUser }) {
	// Modals
	const [submitModal, setSubmitOpen] = useState(false); //Submit
	const [cancelModal, setCancelOpen] = useState(false); //Cancel
	const [customerModal, setCustomerOpen] = useState(false); //View Customer Details
	const [historyModal, setHistoryOpen] = useState(false); //Pawn History
	const [rejectModal, setRejectModal] = useState(false); //reject redeem

	//Item List Array
	const [itemList, setitemList] = useState([]);
	const [remainList, setRemainList] = useState([]);
	const [redeemList, setRedeemList] = useState([]);

	//Pawn Ticket Details
	const router = useRouter();
	const [transactionID, setTransactionID] = useState(router.query.transactionID);

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
	const [redeemerInfo, setRedeemerInfo] = useState([])
	const [redeemerID, setRedeemerID] = useState("")
	const [isOriginal, setOriginal] = useState(true) //if redeemed by original true, if authrep false
	//Item List Backend States
	const [itemListID, setItemListID] = useState("N/A");
	

	const [sendForm, setSendForm] = useState(false);

	function submitForm() {
		setSubmitOpen(true);
	}

	function cancelForm() {
		setCancelOpen(true);
	}

	function rejectForm(){
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
	function cancelContentShow() {
		return (
			<>
				Are you sure you want to cancel <b> Renewal </b> transaction?
				<br />
				All unsubmitted data will be lost.
			</>
		);
	}

	function getNewLoanDate() {
		const dt = new Date();
		return dayjs(dt).format("MM/DD/YYYY");
	}

	function getNewMaturityDate() {
		const dt = new Date();
		const nt = new Date().setDate(dt.getDate() + 120);
		return dayjs(nt).format("MM/DD/YYYY");
	}

	function getNewExpiryDate() {
		const dt = new Date();
		const nt = new Date().setDate(dt.getDate() + 30);
		return dayjs(nt).format("MM/DD/YYYY");
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
						setCustomerID(transaction.customerID);
						setBranch(transaction.branchID);
					
					}
				});
		}
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
						setRedeemerID(redeem.redeemerID)
						setAmountToPay(redeem.payment);
					// console.log(JSON.stringify("Eyo what is this " + redeem.redeemID));
					// console.log("PT is " + redeem.pawnTicketID);
					}
				});
		}
	}, [transactionID, PTNumber]);

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
						console.log("PT loan is " + JSON.stringify(data.loanAmount));
					//	console.log("Item id is " + data.itemListID);
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
				//		console.log("Item list is " + list);
					}
				});
		}
	}, [itemListID]);

	useEffect(() => {
		if (itemList) {
			setRemainList(itemList.filter((item) => item.redeemID === ""));
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
					// console.log(data)
					if (user != null) {
						// console.log(JSON.stringify(info))
						setUserInfo(user);
						if(user.userID == redeemerID){
							setRedeemerInfo(user);
						//	setOriginal(true);
						} 
						else {
							console.log("Redeemer is authorized")
							if(redeemerID != null){
							fetch("/api/users/" + customerID, {
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
							//	setOriginal(false);
								}
							});
						}
						}
					}
				});
		}
	}, [customerID, redeemerID]);

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

	return (
    <>
      <NavBar currentUser={currentUser}></NavBar>
      <Header currentUser={currentUser}></Header>
      {/* First Half */}

      <Modal isOpen={submitModal} ariaHideApp={false} className="modal">
        <Submit trigger={submitModal} setTrigger={setSubmitOpen} />
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
		/>
	  </Modal>
	
      <div id="main-content-area" className="flex-col">
        <p className="mb-5 text-xl font-semibold text-green-500 underline font-dosis">
          Redeem
        </p>
        <div className="flex">
          <DetailsCardRedeemManager
            pawnTicket={ptInfo}
            branch={branch}
            PTNumber={PTNumber}
            user={userInfo}
            customer={customerDetails}
            redeemer={redeemerInfo}
            amountToPay={amountToPay}
            cashTendered={cashTendered}
            setCashTendered={setCashTendered}
            newLoan={newLoan}
            getNewLoan={setNewLoan}
            isOriginal={isOriginal}
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
              onClick={submitForm}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RedeemManager;
