import React, { useState, useEffect } from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";
import Modal from "react-modal";
import Submit from "../../../components/modals/submitRedeem";
import Cancel from "../../../components/modals/cancel";
import ItemCard from "../../../components/itemcard";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../utilities/config";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import printPawnTicket from "../../../utilities/printPawnTicket";
import printReceipt from "../../../utilities/printReceipt";
import dbConnect from "../../../utilities/dbConnect";
import Transaction from "../../../schemas/transaction";
import mongoose from "mongoose";
import PawnTicket from "../../../schemas/pawnTicket";
import Branch from "../../../schemas/branch";
import DetailsCardClerkReject from "../../../components/redeem/detailsClerkReject";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req, query }) {
    if (!req.session.userData) {
      return {
        redirect: { destination: "/signIn", permanent: true },
        props: {},
      };
    } else if (req.session.userData.role == "clerk" && query.rejectTransID) {
      if (query.rejectTransID.length >= 24) {
        await dbConnect();
        let transactionInfo = await Transaction.findById(
          new mongoose.Types.ObjectId(query.rejectTransID.toString())
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

function RejectClerk({
  currentUser,
  transactionData,
  pawnHistory,
  branchData,
}) {
  //Item List Backend States
  const [partialPayment, setPartialPayment] = useState(0);
  const [itemList, setitemList] = useState([]);
  const [remainList, setRemainList] = useState([]);
  const [redeemList, setRedeemList] = useState([]);

  //Item List Array
  const [itemListID, setItemListID] = useState("N/A");
  const [sendForm, setSendForm] = useState(false);

  //Pawn Ticket Details
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
  const router = useRouter();
  const [transactionID, setTransactionID] = useState(
    router.query.rejectTransID
  );
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
            console.log("Redeem is " + JSON.stringify(redeem))
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
            console.log("Pawn data is" + JSON.stringify(data))
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
              .then((oldpt) => {
                //   console.log("Old PT is: " + JSON.stringify(oldpt));
                if (oldpt != null) {
                  setPartialPayment(Number(oldpt.loanAmount - data.loanAmount));
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
              setOriginal(false)
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
                  }
                });
              //	console.log("Redeemer is original");
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

  
	//REJECT
	function rejectDone(){
    fetch("/api/redeem/rejectClerk", {
      method: "POST",
      body: JSON.stringify({
        transactionID: transactionID,
        itemList: itemList,
        redeemID: redeemID,
        isOriginal: isOriginal,
        redeemerID: redeemerID
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("reject data is:", data);
        if (data == "success"){
          router.replace("/");
        }
        else {
          console.log("Error in rejecting");
        }
      });
  }
	return (
    <>
      <NavBar currentUser={currentUser}></NavBar>
      <Header currentUser={currentUser}></Header>
      {/* First Half */}

      <div id="main-content-area" className="flex-col">
        <p className="mb-5 text-xl font-semibold text-green-500 underline font-dosis">
          Redeem
        </p>
        <div className="flex">
          <DetailsCardClerkReject
            pawnTicket={ptInfo}
            pawnHistory={pawnHistory}
            branch={branchData.branchName}
            PTNumber={PTNumber}
            user={userInfo}
            customer={customerDetails}
            redeemer={redeemerInfo}
            amountToPay={amountToPay}
            setAmountToPay={setAmountToPay}
            cashTendered={cashTendered}
            setCashTendered={setCashTendered}
            getNewLoan={setNewLoan}
            isOriginal={isOriginal}
            partialPayment={partialPayment}
            redeem = {redeemList}
            transaction = {transactionData}
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
              onClick={null}
            >
              Cancel
            </button>
          </div>
          <div>
            <button
              className="px-10 mx-2 my-5 text-base text-white bg-green-300"
              onClick={rejectDone}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RejectClerk;