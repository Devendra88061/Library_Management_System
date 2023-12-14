import book from "../../models/book";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../userModule/user.controller";


class bookController {

    // Add book
    public static async addBook(request: any, response: any) {
        const { title, author, genre, publishDate, availableCopies, totalCopies } = request.body;
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


    // give book to user
    public static async bookIssue(request: any, response: any) {
        const bookId = request.params.id
        console.log("bookId--", bookId);
        // get userInfo from token
        let userInfo = jwt.verify(request.token, JWT_SECRET!);
        console.log("userInfo----", userInfo);

    //     try {
    //         const userAlreadyHaveTheBook = await userHasBook.findOne({
    //             userId: userInfo._id, bookId: bookId
    //         });
    //         if (!userAlreadyHaveTheBook) {
    //             const newUserHasBook = new userHasBook({
    //                 userId: userInfo._id,
    //                 bookId: bookId
    //             })
    //             const result = await newUserHasBook.save()
    //                 .then((result) => {
    //                     response.status(201).send("book added to the user's collection")
    //                 }).catch((err) => {
    //                     console.log(err);
    //                     response.status(500).send("Internal Server Error");
    //                 });
    //         }
    //         else {
    //             response.status(409).send('You already have this book')
    //         }
    //     } catch (error) {
    //         response.status(400).send(`Invalid ID or something went wrong ${error}`)
    //         response.status(400).send(`Invalid ID or operation failed ${error}`)
    //     }
    };

};
export default bookController;

// export const extractUserIdMiddleware = (req, res, next) => {
//     // Get the authorization header
//     const authHeader = req.headers['authorization'];

//     // Check if the authorization header is present
//     if (authHeader) {
//         // Extract the token from the authorization header
//         const token = authHeader.split(' ')[1];

//         // Verify the token and extract the user ID
//         jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
//             if (err) {
//                 return res.status(401).json({ error: 'Unauthorized' });
//             }
//             req.userId = decodedToken.sub;
//             next();
//         });
//     } else {
//         return res.status(401).json({ error: 'Unauthorized' });
//     }
// };