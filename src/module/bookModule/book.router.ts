import { Router } from "express";
import bookController from "./book.controller";
import jwtToken from "../../jwt/jwt";


const bookRouter = Router();

bookRouter.post("/addBook", bookController.addBook);

bookRouter.get("/getAllBooks", bookController.getAllBooks);

bookRouter.get("/getBook/:id", bookController.getSingleBook);

bookRouter.get("/checkOut/book/:id", jwtToken.verifyJwt ,bookController.bookIssue);

export default bookRouter;