import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

// console.log("mongo is:", MONGO_URI);

// if (!MONGO_URI) {
// 	throw new Error(
// 		"Please define the MONGODB_URI environment variable inside .env.local"
// 	);
// }

// mongoose.set("strictQuery", false);
const dbConnect = async () => mongoose.connect(MONGO_URI);
console.log("HELLO FROM DB CONNECT", dbConnect);

export default dbConnect;
