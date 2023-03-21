import React, { useState, useEffect } from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";
import DetailsCardClerk from "../../../components/renew/detailsClerk";
import Modal from "react-modal";
import Submit from "../../../components/modals/submitRenewal";
import Cancel from "../../../components/modals/cancel";
import PawnDetails from "../../../components/modals/pawnDetails";
import ItemMockData from "./ITEMS_MOCK_DATA";
import ItemCard from "../../../components/itemcard";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../utilities/config";
import { useRouter } from "next/router";
import dayjs from "dayjs";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "clerk") {
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

function RenewClerk({ currentUser }) {
  // Modals
  const [submitModal, setSubmitOpen] = useState(false); //Submit
  const [cancelModal, setCancelOpen] = useState(false); //Cancel
  const [customerModal, setCustomerOpen] = useState(false); //View Customer Details
  const [historyModal, setHistoryOpen] = useState(false); //Pawn History
  const [mode, setMode] = useState(true); //how the layout behaves, true if no PT, select if PT is false
  //Item List Array
  const [itemList, setitemList] = useState(["N/A"]);

  //Pawn Ticket Details
  const [PTNumber, setPTNumber] = useState(""); //test A-123456
  const [userInfo, setUserInfo] = useState([]);
  const [ptInfo, setPTinfo] = useState([]);
  const [branch, setBranch] = useState("N/A");
  const [customerID, setCustomerID] = useState("N/A");
  const [customerDetails, setCusDetails] = useState(["N/A"]);
  const [amountToPay, setAmountToPay] = useState();
  const [newLoan, setNewLoan] = useState(0);

  //Item List Backend States
  const [itemListID, setItemListID] = useState("");
  const [transactionID, setTransactionID] = useState("");
  const [sendForm, setSendForm] = useState(false);
  const [button, setButton] = useState(true); //disabled if PT number is invalid
  const [button2, setButton2] = useState(true); //disabled if No amount Paid or less than total interest

  const router = useRouter();

	function submitOpen() {
    setSubmitOpen(true);
  }

  function cancelForm() {
    setCancelOpen(true);
  }

  function searchPawnTicket(ptnumber) {
    setPTNumber(ptnumber);
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

  function changeMode() {
    setMode(!mode);
    console.log("Mode changed to " + mode);
  }

  function getNewLoanDate() {
    const dt = new Date();
    return dayjs(dt).format("MM/DD/YYYY")
  }

  function getNewMaturityDate() {
    const dt = dayjs(new Date());
    const nt = dt.add(1, "month");
    return dayjs(nt).format("MM/DD/YYYY");
  }

  function getNewExpiryDate(){
    const dt = dayjs(new Date());
    const nt = dt.add(4, "month");
    return dayjs(nt).format("MM/DD/YYYY");
  }
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
            setTransactionID(data.transactionID);
            setPTinfo(JSON.parse(JSON.stringify(data)));
            setItemListID(data.itemListID);
            setButton(false);
          } else {
            setPTinfo("N/A");
            setTransactionID("N/A");
            setButton(true);
          }
        });
    }
  }, [PTNumber]);

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
          // console.log(data)
          if (transaction != null) {
            setBranch(transaction.branchID);
          } else {
            setItemListID("N/A");
            setBranch("N/A");
          }
        });
    }
  }, [transactionID]);

  // BACKEND TO RETRIEVE ItemListID using TransactionID
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
            setUserInfo(JSON.parse(JSON.stringify(user)));
          }
        });
    }
  }, [customerID]);

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
            setCusDetails(JSON.parse(JSON.stringify(customer)));
          }
        });
    }
  }, [customerID]);
  useEffect(() => {
    if (sendForm) {
      if (customerID) {
        let transac = {
          customerID: customerID,
          itemListID: itemListID,
          clerkID: currentUser.userID,
          pawnTicketID: PTNumber,
          branchID: currentUser.branchID,
          totalAmount: amountToPay,
        };
        // console.log("transac is" + JSON.stringify(transac))
        fetch("/api/renewal/newClerkRenewal", {
          method: "POST",
          body: JSON.stringify(transac),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("END");
            if (data == "renew posted successfully") {
              router.replace("/");
            } else {
              console.log("error");
            }
          });
      }
    }
  }, [sendForm, customerID]);

  return (
    <>
      <NavBar currentUser={currentUser}></NavBar>
      <Header currentUser={currentUser}></Header>
      {/* First Half */}
      <Modal isOpen={submitModal} ariaHideApp={false} className="modal">
        <Submit
          trigger={submitModal}
          setTrigger={setSubmitOpen}
          mode={mode}
          changeMode={changeMode}
          PTnumber={PTNumber}
          itemList={itemList}
          setSendForm={setSendForm}
          amountToPay={amountToPay}
        />
      </Modal>

      <Modal isOpen={cancelModal} ariaHideApp={false} className="modal">
        <Cancel
          trigger={cancelModal}
          setTrigger={setCancelOpen}
          content={cancelContentShow()}
        />
      </Modal>

      <div id="main-content-area" className="flex-col ">
        <p className="text-xl font-semibold text-green-500 underline font-dosis">
          Renew
        </p>
        <p className="mb-5 text-lg text-green-500 font-dosis">
          On-site Renewal
        </p>

        <div className="flex">
          <div className="flex">
            <DetailsCardClerk
              branch={branch}
              pawnTicket={ptInfo}
              user={userInfo}
              PTNumber={PTNumber}
              search={searchPawnTicket}
              mode={mode}
              customer={customerDetails}
              getNewLoan={setNewLoan}
              getAmount={setAmountToPay}
              amountToPay={amountToPay}
              button2={button2}
              setButton2={setButton2}
            />
          </div>
        </div>

        {/* Second Half */}

        <div className="flex py-10 mt-20 bg-white shadow-lg rounded-xl">
          {/* Remaining Items  */}

          <div className="px-5">
            <p className="ml-10 text-base font-bold font-nunito">
              New Pawn Details:{" "}
            </p>

            <div className="flex my-10 ml-10 mr-32 text-base font-nunito ">
              <div className="ml-5 text-right">
                <p>
                  <b>
                    <i>New </i>
                  </b>
                  Date Loan Granted:
                </p>
                <p>
                  <b>
                    <i>New </i>
                  </b>
                  Maturity Date:
                </p>
                <p>
                  <b>
                    <i>New </i>
                  </b>
                  Expiry Date of Redemption:
                </p>
              </div>
              {mode == true ? (
                <div className="ml-8 text-left">
                  <p>N/A</p>
                  <p>N/A</p>
                  <p>N/A</p>
                </div>
              ) : (
                <div className="ml-8 text-left">
                  <p>{getNewLoanDate()}</p>
                  <p>{getNewMaturityDate()}</p>
                  <p>{getNewExpiryDate()}</p>
                </div>
              )}
            </div>
          </div>

          {/*Items*/}
          <div className="flex">
            <div className="">
              <p className="ml-10 text-sm font-bold font-nunito">
                Pawned Items:{" "}
              </p>
              <div className="p-5 mx-10 w-[720px] h-96  overflow-y-scroll bg-white border-2">
                {/* plan: CheckItem & ItemCard section will be generated using .map */}

                {/* When PT isn't selected yet*/}
                {itemList.length > 0 ? (
                  <>
                    {itemList.map((item) => (
                      <div className="flex flex-row" key={item.itemID}>
                        <ItemCard
                          key={item.itemID}
                          itemDetails={item}
                        ></ItemCard>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="mt-32 ">
                    <p className="text-xl font-bold text-center text-gray-300 font-nunito">
                      {" "}
                      No items displayed.
                    </p>
                    <p className="text-sm text-center text-gray-300 font-nunito">
                      {" "}
                      Search for a Pawn Ticket to display its details and items.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-row ml-[1180px] md:ml-[800px]">
          <div>
            <button
              className="px-10 mx-2 my-5 text-sm text-white bg-red-300"
              onClick={cancelForm}
            >
              Cancel
            </button>
          </div>
          <div>
            {mode == true ? (
              <button
                className="px-10 mx-2 my-5 text-sm text-white bg-green-300 disabled:bg-gray-500 disabled:text-gray-500 "
                onClick={submitOpen}
                disabled={button}
              >
                Select
              </button>
            ) : (
              <button
                className="px-10 mx-2 my-5 text-sm text-white bg-green-300 disabled:bg-gray-500 disabled:text-gray-500 "
                onClick={submitOpen}
                disabled={button2}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default RenewClerk;
