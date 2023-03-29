import dbConnect from "../../../utilities/dbConnect";
import Transaction from "../../../schemas/transaction";
import User from "../../../schemas/user";
import EmployeeInfo from "../../../schemas/employeeInfo";
import Renew from "../../../schemas/renew";
import generateRenewalID from "../../../utilities/generateRenewalID";
import PawnTicket from "../../../schemas/pawnTicket";
import generatePawnTicketID from "../../../utilities/generatePawnTicketID";
import Branch from "../../../schemas/branch";
import CustomerInfo from "../../../schemas/customerInfo";
import dayjs from "dayjs";
import { ToWords } from "to-words";
import Item from "../../../schemas/item";

export default async function newManagerRenewal(req, res) {
    dbConnect();
}