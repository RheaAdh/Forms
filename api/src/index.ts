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
    adminForgotPassword,
    adminResetPassword,
} from "./routes/adminuser";
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
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

// FORGOT AND RESET PASSWORD
app.post("/forgotPassword", adminForgotPassword);
app.get("/resetpassword/:token", (req, res) => {
    return res.send({
        success: true,
        data: "Password and Confirm Password needs to be filled here",
    });
});
app.post("/resetpassword/:token", adminResetPassword);


// PASSPORT CONFIG --> FOR USER LEVEL AUTH
app.use(passport.initialize());
app.use(passport.session());
app.use("/user", Router);
app.use("/user/logout", userLogout);
app.use("/user/getuser", getUser);


//ADMIN
app.use("/api", router);


//ADMIN LOGIN,REGISTER,LOGOUT ROUTES
app.get("/admin", sessionDetails);
app.post("/admin/register", adminRegister);
app.post("/admin/login", adminLogin);
app.get("/admin/logout", adminLogout);


//USER ROUTES
app.use("/user", Router);
app.use("/user/logout", userLogout);
app.use("/user/getuser", getUser);


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

app.get("/sessiondetail", sessionDetails);
app.get("/admin", sessionDetails);


app.listen(port, () => console.log(`Listening on port ${port}`));
