import path from "path";
require("dotenv").config({ path: path.join(".env") });

const cors = require("cors");

import express, { Request, Response } from "express";
import router from "./routes";
import {
  sessionDetails,
  adminRegister,
  adminLogin,
  adminLogout,
  isValidAdmin,
  isValidSuperAdmin,
} from "./routes/adminuser";
import { checkUserExists } from "./routes/adminforgotpass";
import { store } from "./config/mongo";

const port: Number = 7000;

const session = require("express-session");
const bodyParser = require("body-parser");
const app = express();

import Router from "./routes/user";
import { checkAuthentication, userLogout, getUser } from "./routes/user";
import passport from "passport";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(
  session({
    secret: "Keep it secret",
    resave: true,
    name: "uniqueSessionID",
    saveUninitialized: true,
    store: store,
    //?? Cookie part is creating problem in creating passport session
    // cookie: {
    //     maxAge: Number(process.env.SESS_EXPIRY),
    //     sameSite: true,
    // },
  })
);

app.get("/forgotPassword", (req, res) => {
  res.send("In forgotPassword page");
});
app.get("/resetPassword", (req, res) => {
  res.send("enter email page");
});
app.post("/resetPassword", checkUserExists);
// app.get("/resetpassword/:email/:token", (req, res, next) => {
//     let { email, token } = req.params;
//     res.send(req.params);
//     console.log("reset done");
// });

// PASSPORT CONFIG --> FOR USER LEVEL AUTH
app.use(passport.initialize());
app.use(passport.session());
app.use("/user", Router);
app.use("/user/logout", userLogout);
app.use("/user/getuser", getUser);

//ADMIN
app.use("/api", router);
app.get("/admin", sessionDetails);
app.post("/admin/register", adminRegister);
app.post("/admin/login", adminLogin);
app.get("/admin/logout", adminLogout);

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
app.get("/sessiondetail", sessionDetails);

app.listen(port, () => console.log(`Listening on port ${port}`));
