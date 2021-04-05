import path from "path";
require("dotenv").config({ path: path.join(".env") });
const cors = require("cors");
import express, { Request, Response } from "express";
import router from "./routes";
import { SessionDetails,RegisterUser,LoginUser,LogoutUser } from "./routes/user";
import {store} from "./config/mongo"
const port: Number = 7000;
const session =require("express-session")
const bodyParser=require("body-parser")
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
    secret:'Keep it secret',
    resave: true,
    name:'uniqueSessionID',
    saveUninitialized:true,
    store:store
}))

//ONLY ADMIN USERS CAN ACCESS
app.use("/api", router);

app.get('/',SessionDetails)
app.post("/register",RegisterUser)
app.post("/login",LoginUser)
app.get("/logout",LogoutUser)

app.listen(port, () => console.log(`Listening on port ${port}`));
