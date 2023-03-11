import React, { useState, useEffect} from "react";
import Header from "../../../components/header";
import NavBar from "../../../components/navigation/navBar";
import DetailsCardClerk from "../../../components/redeem/detailsClerk";
import Modal from "react-modal";
import Submit from "../../../components/modals/submitRedeem";
import Cancel from "../../../components/modals/cancel";
import PawnDetails from "../../../components/modals/pawnDetails";
import ItemMockData from "./ITEMS_MOCK_DATA";
import ItemCard from "../../../components/itemcard";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "../../../utilities/config";
import Delete from "../../../components/modals/delWarning";
import dbConnect from "../../../utilities/dbConnect";
import PawnTicket from "../../../schemas/pawnTicket";
import { useRouter } from "next/router";

export const getServerSideProps = withIronSessionSsr(
	async function getServerSideProps({ req }) {
		if (!req.session.userData) {
			return {
				redirect: { destination: "/signIn", permanent: true },
				props: {},
			};
		} else if (req.session.userData.role == "clerk") {
            await dbConnect();
			return {
				props: { currentUser: req.session.userData,},
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

function RedeemClerkSelect({ currentUser}) {

  //Retrieve PT Number
  const router = useRouter();


	// Modals
	const [submitModal, setSubmitOpen] = useState(false); //Submit
	const [cancelModal, setCancelOpen] = useState(false); //Cancel
	const [checkedBoxes, setCheckedBoxes] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false)
  let data = JSON.stringify(ItemMockData);
  
  
  const [itemList, setitemList] = useState([]) //Items Mock Data

  //Array for Redeem
  const [redeem, setRedeem] = useState([]);
  const [redeemArray, setRedeemArray] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState();
  const [deleteName, setDeleteName]= useState();
  const [deleteID, setDeleteId] = useState();
  const [deleteType, setDeleteType] = useState();
  const [deletePrice, setDeletePrice] = useState();
  
  //Pawn Ticket Details
  const [PTNumber, setPTNumber] = useState(router.query.pawnTicketID); //test A-123456
  const [name, setName] = useState("N/A");
  const [contactno, setContactNo] = useState("N/A");
  const [address, setAddress] = useState("N/A");
  const [loanDate, setLoanDate] = useState("N/A");
  const [matDate, setMatDate] = useState("N/A");  
  const [expDate, setExpDate] = useState("N/A");
  const [branch, setBranch] = useState("N/A");

    //Item List Backend States
  const [itemListID, setItemListID] = useState("")
  const [transactionID, setTransactionID] = useState("")
  const [dataRetrieved, setDataRetrieved] = useState(false)
  const [button, setButton] = useState(true)
 // const 
//manage modals
	function submitForm() {
		setSubmitOpen(true);
	}

	function cancelForm() {
		setCancelOpen(true);
	}

  function removeModal(index, id, name, type, price){
    setDeleteIndex(index)
    setDeleteModal(true)
    setDeleteName(name)
    setDeleteId(id) 
    setDeleteType(type)
    setDeletePrice(price)
  }
//Manages Add to Redeem Cart
  function removeItem(){
    redeemArray.splice(deleteIndex, 1);
    itemList.splice(0, 0, {
      itemID: deleteID,
      itemName: deleteName,
      itemType: deleteType,
      price: deletePrice,
    });
  }
  const handleCheckboxChange = (event, id, name, type, price) => {
    const checked = event.target.checked;
    const newCheckedBoxes = [...checkedBoxes];

    if (checked) {
      newCheckedBoxes.push({
        itemID: id,
        itemName: name,
        itemType: type,
        price: price,
      });
    } else {
      const itemIndex = newCheckedBoxes.findIndex((item) => item.itemID === id);
      if (itemIndex >= 0) {
        newCheckedBoxes.splice(itemIndex, 1);
      }
    }

    setCheckedBoxes(newCheckedBoxes);
  };

function addToRedeem() {
  if (checkedBoxes.length > 0) {
    if (redeemArray.length > 0) {
      setRedeem(redeem.concat(checkedBoxes));
    }
    else
      setRedeem(checkedBoxes);

  }
  
  checkedBoxes.forEach((check, index) => {
    const redeemedIndex = itemList.findIndex((item) => item.itemID === check.itemID);
    if (redeemedIndex >= 0){
      itemList.splice(redeemedIndex, 1)
    }
  });
      setDataRetrieved(true);
      setCheckedBoxes([]);
    
}

    useEffect(() => {
      setRedeemArray(redeem);
    }, [redeem]);

    useEffect(() => {      
      if(redeemArray.length > 0)
        setButton(false)
      else  
        setButton(true)
      }, [redeemArray]
    );
//manage cancel modal
	function cancelContentShow() {
		return (
			<>
				Are you sure you want to cancel <b> Redemption</b> of <br />
				<b>{PTNumber}</b>? <br />
				All unsubmitted data will be lost.
			</>
		);
	}
  // BACKEND TO RETRIEVE PAWN TICKET
  	useEffect(() => {
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
          if(data != null){
            setName(data.customerID); //temporary
            setContactNo("0917 327 5891"); //temporary
            setTransactionID(data.transactionID)
            setAddress("196 P. Zamora St. Caloocan City"); //temporary
            setLoanDate(data.loanDate);
            setMatDate(data.maturityDate);
            setExpDate(data.expiryDate);
            setBranch("R Raymundo Branch"); //temporary
          }
          else {
            setName("N/A"); //temporary
            setContactNo("N/A"); //temporary
            setAddress("N/A"); //temporary
            setLoanDate("N/A");
            setMatDate("N/A");
            setExpDate("N/A");
            setBranch("N/A"); //temporary
          }
        });
    }, [PTNumber]);

     // BACKEND TO RETRIEVE ItemListID using TransactionID
     useEffect(() => {
      if(transactionID != "N/A"){
      fetch("/api/redeem/" + transactionID, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((transaction) => {
      //    console.log(data)
          if(transaction != null){
            setItemListID(transaction.itemListID); //temporary
          //  console.log("Item List is " + itemListID);
          }
        });
    }}, [transactionID]);

  // BACKEND TO RETRIEVE ItemListID using TransactionID
  useEffect(() => {
    if(itemListID != "N/A"){
    fetch("/api/redeem/itemList/" + itemListID, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((info) => {
        if(info!= null){
          // console.log(JSON.stringify(info))
          const list = JSON.parse(JSON.stringify(info))
          setitemList(list);
          setDataRetrieved(true)
        }
      });
  }}, [itemListID]);

	return (
    <>
      <NavBar currentUser={currentUser}></NavBar>
      <Header currentUser={currentUser}></Header>
      {/* First Half */}

      <Modal isOpen={submitModal} ariaHideApp={false} className="modal">
        <Submit trigger={submitModal} setTrigger={setSubmitOpen} itemList={redeemArray} />
      </Modal>
      <Modal isOpen={deleteModal} ariaHideApp={false} className="modal">
        <Delete
          trigger={deleteModal}
          setTrigger={setDeleteModal}
          content={deleteName + " (" + deleteID + ") "}
          trigger2={removeItem}
        />
      </Modal>
      <Modal isOpen={cancelModal} ariaHideApp={false} className="modal">
        <Cancel
          trigger={cancelModal}
          setTrigger={setCancelOpen}
          content={cancelContentShow()}
        />
      </Modal>

      <div id="main-content-area" className="flex-col">
        <p className="mb-5 text-xl font-semibold text-green-500 underline font-dosis">
          Redeem
        </p>
        <p className="mb-5 text-xl font-bold text-green-500 underline font-dosis">
          {/* <a href="/redeem/manager">Temporary button to Manager Redeem</a> */}
        </p>
        <div className="flex">
          <DetailsCardClerk
            redeem={redeemArray}
            customerName={name}
            contactNumber={contactno}
            address={address}
            loanDate={loanDate}
            maturityDate={matDate}
            expiryDate={expDate}
            branch={branch}
            data = {data}
            PTNumber = {PTNumber}
            mode = "select"
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
            <div className="p-5 mx-10 w-[720px] h-96  overflow-y-scroll bg-white border-2">
              {/* plan: CheckItem & ItemCard section will be generated using .map */}
              {dataRetrieved && itemList.length > 0 ? (
                <>
              {itemList.map((items) => (
                <div className="flex flex-row" key={items.itemID}>
                  <ItemCard
                    key={items.itemID}
                    itemID={items.itemID}
                    itemName={items.itemName}
                    itemType={items.itemType}
                    itemPrice={items.price}
                  ></ItemCard>
                  <div className="mt-10">
                    <input
                      type="checkbox"
                      id={items.itemID}
                      name="selected"
                      value={items.itemID}
                      onChange={(e) =>
                        handleCheckboxChange(
                          e,
                          items.itemID,
                          items.itemName,
                          items.itemType,
                          items.price
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              </>
              ): (
                <div className=" mt-32">
                <p className="text-xl font-bold text-center text-gray-300 font-nunito">
                  No items displayed.
                </p>
                <p className="text-sm text-center text-gray-300 font-nunito">
                  All items will be redeemed.
                </p>
              </div>
              )}
            </div>
            <div className="mx-10 bg-gray-200 rounded-b-xl">
              <div className="py-3">
                <section className="ml-80">
                  <span className="ml-20 mr-10 font-bold font-nunito">
                    Selected ({checkedBoxes.length}){" "}
                  </span>
                  <button className="text-white bg-green-300"
                    onClick={addToRedeem}>
                    Add to Redeem
                  </button>
                </section>
              </div>
            </div>
          </div>

          {/*Items for Redemption */}
          <div className="mt-20 ">
            <p className="ml-10 text-base font-bold font-nunito">
              Items for Redemption:{" "}
            </p>
            <div
              className="bg-white p-5 mx-10 w-[720px] h-[450px] overflow-y-scroll border-2"
              key="0"
            >
              {redeemArray.length == 0 ? (
                <div className=" mt-44">
                  <p className="text-xl font-bold text-center text-gray-300 font-nunito">
                    {" "}
                    No items selected.
                  </p>
                  <p className="text-sm text-center text-gray-300 font-nunito">
                    {" "}
                    Select the items and click <i>Add to Redeem</i> to add the
                    items for redemption.
                  </p>
                </div>
              ) : (
                <>
                  {redeemArray.map((items, index) => (
                    <div className="flex flex-row" key={index}>
                      <ItemCard
                        key={items.itemID}
                        itemID={items.itemID}
                        itemName={items.itemName}
                        itemType={items.itemType}
                        itemPrice={items.price}
                      ></ItemCard>
                      <div className="mt-10">
                        <button
                          className="x-button"
                          onClick={() =>
                            removeModal(
                              index,
                              items.itemID,
                              items.itemName,
                              items.itemType,
                              items.price
                            )
                          }
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.16711 6.29289C8.77658 6.68342 8.77658 7.31658 9.16711 7.70711L13.7071 12.2471C13.8946 12.4346 14 12.689 14 12.9542V13C14 13.5523 13.5523 14 13 14H12.9542C12.689 14 12.4346 13.8946 12.2471 13.7071L7.70711 9.16711C7.31658 8.77658 6.68342 8.77658 6.29289 9.16711L1.75289 13.7071C1.56536 13.8946 1.311 14 1.04579 14H1C0.447716 14 0 13.5523 0 13V12.9542C0 12.689 0.105357 12.4346 0.292893 12.2471L4.83289 7.70711C5.22342 7.31658 5.22342 6.68342 4.83289 6.29289L0.292893 1.75289C0.105357 1.56536 0 1.311 0 1.04579V1C0 0.447716 0.447716 0 1 0H1.04579C1.311 0 1.56536 0.105357 1.75289 0.292893L6.29289 4.83289C6.68342 5.22342 7.31658 5.22342 7.70711 4.83289L12.2471 0.292893C12.4346 0.105357 12.689 0 12.9542 0H13C13.5523 0 14 0.447716 14 1V1.04579C14 1.311 13.8946 1.56536 13.7071 1.75289L9.16711 6.29289Z"
                              fill="red"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
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
              className="px-10 mx-2 my-5 text-base text-white bg-green-300"
              onClick={submitForm} disabled={button}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RedeemClerkSelect;
