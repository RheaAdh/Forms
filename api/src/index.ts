import path from "path";
require("dotenv").config({ path: path.join(".env") });
const cors = require("cors");
import express, { Request, Response } from "express";
import router from "./routes";
import {
    SessionDetails,
    RegisterUser,
    LoginUser,
    LogoutUser,
    isValidAdmin,
    isValidSuperAdmin,
} from "./routes/adminuser";
// import {store} from "./config/mongo"
const port: Number = 7000;
const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();

import Router from "./routes/user";
import { checkAuthentication, userLogout, getUser } from "./routes/user";
import passport from "passport";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// app.use(session({
//     secret:'Keep it secret',
//     resave: true,
//     name:'uniqueSessionID',
//     saveUninitialized:true,
//     store:store,
//     cookie: {
//         maxAge: Number(process.env.SESS_EXPIRY),
//         sameSite: true
//     }
// }))

// PASSPORT CONFIG --> FOR USER LEVEL AUTH
app.use(passport.initialize());
app.use(passport.session());

//ONLY ADMIN CAN ACCESS
app.use("/api", router);

//ADMIN LOGIN,REGISTER,LOGOUT ROUTES
app.get("/admin", SessionDetails);
app.post("/admin/register", RegisterUser);
app.post("/admin/login", LoginUser);
app.get("/admin/logout", LogoutUser);

//USER ROUTES
app.use("/user", Router);
app.use("/user/logout", userLogout);
app.use("/user/getuser", getUser);

//ROUTES BELOW ARE FOR TESTING PURPOSE

//TEST WELCOME PAGE
app.get("/", (req, res) => {
    res.send("Welcome to home page");
});

//TEST USER LEVEL PROTECTION ROUTE
app.get("/test", checkAuthentication, (req, res) => {
    res.send("Inside Protected Route");
});

app.get("/admin/dashboard", isValidAdmin, (req, res) => {
    res.send("Inside Admin dashboard");
});
app.get("/superadmin/dashboard", isValidSuperAdmin, (req, res) => {
    res.send("Inside super-admin dashboard");
});
app.get("/sessiondetail", SessionDetails);

app.listen(port, () => console.log(`Listening on port ${port}`));
