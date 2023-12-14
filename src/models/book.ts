import mongoose from "mongoose";

// Define the book schema
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: false,
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    availableCopies: { 
        type: Number,
        required: true
    },
    totalCopies: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});
// Create the user model
const book = mongoose.model("book", bookSchema);
export default book;
