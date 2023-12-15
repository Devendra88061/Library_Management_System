import mongoose from "mongoose";

// Define the checkOut Schema
const checkOutSchema = new mongoose.Schema({
    bookId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    checkOutDate: {
        type: Date,
        default: Date.now
    },
    returnDate: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Boolean,
        default: false  //false means it is not returned yet
    }
});
// Create the checkOut model
const checkOut = mongoose.model("checkOut", checkOutSchema);
export default checkOut;
