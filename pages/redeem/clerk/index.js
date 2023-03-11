import React, { useState, useEffect, useRef } from "react";
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
				props: { currentUser: req.session.userData},
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

function RedeemClerk({ currentUser}) {
	// Modals
	const [submitModal, setSubmitOpen] = useState(false); //Submit
	const [cancelModal, setCancelOpen] = useState(false); //Cancel
	const [checkedBoxes, setCheckedBoxes] = useState([]);
  const [deleteModal, setDeleteModal] = useState(false)
  let data = JSON.stringify(ItemMockData); //Items Mock Data

  //Array for Redeem
  const [redeem, setRedeem] = useState([]);
  const [redeemArray, setRedeemArray] = useState([]);
  const [deleteIndex, setDeleteIndex] = useState();
  const [deleteName, setDeleteName]= useState();
  const [deleteID, setDeleteId] = useState();
  const [deleteType, setDeleteType] = useState();
  const [deletePrice, setDeletePrice] = useState();
  
  //Item List Array
  const [itemList, setitemList] = useState([])
  //Pawn Ticket Details
  const [PTNumber, setPTNumber] = useState(""); //test A-123456
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


 // const 
//manage modals
	function submitForm() {
		setSubmitOpen(true);
	}

	function cancelForm() {
		setCancelOpen(true);
	}

  function searchPawnTicket(ptnumber){
    setPTNumber(ptnumber)
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
      ID: deleteID,
      Name: deleteName,
      Type: deleteType,
      Price: deletePrice,
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
        itemPrice: price,
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
    const redeemedIndex = itemList.findIndex((item) => item.ItemID === check.itemID);
    if (redeemedIndex >= 0){
      itemList.splice(redeemedIndex, 1)
    }
  });
  
      setCheckedBoxes([]);
}

    useEffect(() => {
      setRedeemArray(redeem);
    }, [redeem]);

//manage cancel modal
	function cancelContentShow() {
		return (
			<>
				Are you sure you want to cancel <b> Redemption</b> of <br />
				<b>{PTNumber}</b>? <br /> <br />
				All unsubmitted data will be lost.
			</>
		);
	}
  // BACKEND TO RETRIEVE PAWN TICKET
  	useEffect(() => {
      if(PTNumber != ""){
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
            setTransactionID(data.transactionID)
            setContactNo("0917 327 5891"); //temporary
            setAddress("196 P. Zamora St. Caloocan City"); //temporary
            setLoanDate(data.loanDate);
            setMatDate(data.maturityDate);
            setExpDate(data.expiryDate);
            setBranch("R Raymundo Branch"); //temporary
          }
          else {
            setName("N/A");
            setContactNo("N/A"); 
            setTransactionID("N/A")
            setAddress("N/A"); 
            setLoanDate("N/A");
            setMatDate("N/A");
            setExpDate("N/A");
            setBranch("N/A"); 
          }
        });
    }}, [PTNumber]);

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
          // console.log(data)
          if(transaction != null){
            setItemListID(transaction.itemListID); //temporary
          }
          else {
            setItemListID("N/A");
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
          // console.log(data)
          if(info!= null){
            // console.log(JSON.stringify(info))
          let list = JSON.stringify(info)
         setitemList(JSON.parse(list)); //temporary
          }
          else {
         // setitemList(JSON.parse(data));
          }
        });
    }}, [itemListID]);

	return (
    <>
      <NavBar currentUser={currentUser}></NavBar>
      <Header currentUser={currentUser}></Header>
      {/* First Half */}

      <Modal isOpen={submitModal} ariaHideApp={false} className="modal">
        <Submit trigger={submitModal} setTrigger={setSubmitOpen} mode="search" PTnumber={PTNumber} itemList={itemList} />
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
            search={searchPawnTicket}
            data = {data}
            mode = {"search"}
          />
        </div>

        {/* Second Half */}

        <div className="flex">
          {/* Remaining Items  */}

          <div className="mt-20">
            <p className="ml-10 text-sm font-bold font-nunito">
              Pawned Items:{" "}
            </p>
            {/* plan: CheckItem is ItemCard w/ Check*/}
            <div className="p-5 mx-10 w-[720px] h-96  overflow-y-scroll bg-white border-2">
              {/* plan: CheckItem & ItemCard section will be generated using .map */}
              {itemList.length > 0 ? (
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
                </div>
              ))}
              </>
              ):(                
              <div className=" mt-32">
              <p className="text-xl font-bold text-center text-gray-300 font-nunito">
                {" "}
                No items displayed.
              </p>
              <p className="text-sm text-center text-gray-300 font-nunito">
                {" "}
                Search for a Pawn Ticket to display its details and items.
              </p>
            </div>)}
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
            <button
              className="px-10 mx-2 my-5 text-sm text-white bg-green-300"
              onClick={submitForm}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RedeemClerk;
