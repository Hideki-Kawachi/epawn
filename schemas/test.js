import mongoose from "mongoose";

const TestSchema = new mongoose.Schema({ message: String });

// const Test = mongoose.models.test || mongoose.model("test", TestSchema);

let Test;
try {
	Test = mongoose.model("tests");
} catch (error) {
	Test = mongoose.model("tests", TestSchema);
}

export default Test;
