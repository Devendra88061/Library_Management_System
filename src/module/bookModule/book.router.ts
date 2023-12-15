import { Router } from "express";
import bookController from "./bookController";
import jwtToken from "../../jwt/jwt";


const bookRouter = Router();

bookRouter.post("/getBook/:id", bookController.getSingleBook);

bookRouter.get("/getAllBooks",jwtToken.verifyJwt, bookController.getAllBooks);

// book received
bookRouter.get("/checkOut/book/:id", jwtToken.verifyJwt ,bookController.bookIssue);

// book return
bookRouter.get("/checkOut/return-book/:id", jwtToken.verifyJwt ,bookController.bookReturn);


// Only Admin 
// Add Book
bookRouter.post("/addBook",jwtToken.verifyJwt, bookController.addBook);

// Update book
bookRouter.put("/updateBook/:id", bookController.updateBook);

// update partially
bookRouter.patch("/update/:id", bookController.updateBook);


export default bookRouter;