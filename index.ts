import express from "express";
import mongoose from "mongoose";
import  cors from "cors";
import authRouter from "./src/module/userModule/user.router";
import bookRouter from "./src/module/bookModule/book.router";


export const app = express();

// parsing the request data
app.use(express.json());
app.use(cors());

const PORT = 5000;
const MONGO_URL = "mongodb://0.0.0.0:27017/LibrartManagementSystem"
                
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// connection to DataBase
mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URL).then(()=>{
  console.log("\n*************MONGODB connected**************\n");
}).catch(error =>{
  console.log("unable to connect with database:", error);
});
 
// App testing
app.get('/ping', (req: any,res: any)=>{
  res.status(200).json({
      status: true,
      message : "App is working",
  })
});

// router
app.use("/library/auth", authRouter);

 app.use("/library/book", bookRouter);


