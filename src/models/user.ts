import mongoose from "mongoose";

// Define the book schema
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: function (value: string) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
          },
          message: 'Invalid email address format',
        },
      },
    password: {
        type: String,
        required: true,
    },
    lateFine: {
        type: Number,
        required: false,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['admin', 'User'],
        required: true
    },
});
// Create the user model
const user = mongoose.model("user", userSchema);
export default user;
