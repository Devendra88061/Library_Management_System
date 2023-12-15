import jwt from "jsonwebtoken"
import book from "../../schema/book";
import { JWT_SECRET } from "../userController";
import user from "../../schema/user";
import checkOut from "../../schema/checkout";

class bookController {

    // Add book
    public static async addBook(request: any, response: any) {
        const { title, author, genre, publishDate, availableCopies, totalCopies } = request.body;
        const userId = request.user._id;
        console.log("user id---", userId);
        const userData = await user.findById({ _id: userId });
        const role = userData?.role;
        if (role == "admin") {
            try {
                // Check if the book already exists
                const existingBook = await book.findOne({ title });
                if (existingBook) {
                    return response.status(400).json({
                        message: "Book already exists"
                    });
                }
                else {
                    // required fields check
                    if (!request.body.title || !request.body.author || !request.body.availableCopies || !request.body.totalCopies) {
                        return response.status(400).send({
                            message: "Required fields are missing",
                        });
                    }
                    const newBook = new book({
                        title, author, genre, publishDate, availableCopies, totalCopies
                    });
                    const result = await newBook.save();
                    response.status(201).json({
                        message: "Book added successfully!",
                        data: result,
                    });
                }
            } catch (error) {
                response.status(500).json({
                    message: "Internal server error"
                });
            }
        } else {
            response.static(400).json({
                message: "You are not admin"
            })
        }

    };

    // Get all books
    public static async getAllBooks(request: any, response: any) {
        const bookCount = await book.countDocuments();
        const booksData = await book.find();
        if (booksData) {
            response.status(200).json({
                count: bookCount,
                data: booksData
            })
        }
        else {
            response.status(404).json({
                message: "No Books Found!"
            })
        }
    };

    // Get Book By Id
    public static async getSingleBook(request: any, response: any) {
        const bookId = request.params.id;
        const booksData = await book.findById({ _id: bookId });
        if (booksData) {
            response.status(200).json({
                message: "Book Data received successfully!",
                data: booksData
            })
        }
        else {
            response.status(404).json({
                message: "This book is not available in library"
            })
        }
    };


    // Book issue
    public static async bookIssue(request: any, response: any) {
        try {
            const _bookId = request.params.id;
            console.log("bookId--", _bookId);
            const bookData = await book.findById({ _id: _bookId });
            const availableCount: any = bookData?.availableCopies
            if (availableCount > 0) {
                const _userId = request.user._id;
                const currentDate = new Date();
                const futureDate = new Date(currentDate.getTime() + (5 * 24 * 60 * 60 * 1000));
                const latestCount = availableCount - 1;
                const newCheckout = new checkOut({
                    bookId: _bookId,
                    userId: _userId,
                    checkOutDate: currentDate,
                    returnDate: futureDate,
                    availableCount: latestCount,
                    status: false,
                })
                const result = await newCheckout.save();
                response.status(200).json({
                    message: "Book issue successfully!",
                    data: result,
                });
            } else {
                response.status(400).json({
                    message: "Book not availabe to issue!",
                });
            }
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    };

    // Book return to library
    public static async bookReturn(request: any, response: any) {
        try {
            const _bookId = request.params.id;
            console.log("bookId--", _bookId);
            const updatedBookData = await book.findByIdAndUpdate(
                { _id: _bookId },
                { $inc: { availableCount: 1 } },
                { new: true }
            );
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    };

    // update book

    public static async updateBook(request: any, response: any) {
        try {
            const userId = request.user._id;
            console.log("user id---", userId);
            const userData = await user.findById({ _id: userId });
            const role = userData?.role;
            if (role == "admin") {
                const bookId = request.params.id;
                const updatedBookData = request.body;
                const updatedBook = await book.findByIdAndUpdate(bookId, updatedBookData, { new: true });
                if (!updatedBook) {
                    return response.status(404).json({ message: 'Book not found' });
                }
                return response.status(201).json({
                    message: 'Book Updated successfully',
                    data: updatedBook,
                });
            } else {
                return response.status(404).json({ message: "you are not admin user" });
            }

        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    }

    // update book using patch method
    public static async update(request: any, response: any) {
        try {
            const userId = request.user._id;
            console.log("user id---", userId);
            const userData = await user.findById({ _id: userId });
            const role = userData?.role;
            if (role == "admin") {
                const bookId = request.params.id;
                const updatedBookData = request.body;
                const updatedBook = await book.findByIdAndUpdate(bookId, updatedBookData, { new: true });
                if (!updatedBook) {
                    return response.status(404).json({ message: 'Book not found' });
                }
                response.json(updatedBook);
            } else {
                return response.status(404).json({ message: "you are not admin user" });
            }
        } catch (error) {
            console.error(error);
            response.status(500).json({ message: 'Internal Server Error' });
        }
    }

};
export default bookController;
