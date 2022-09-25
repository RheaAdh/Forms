import path from "path"
require("dotenv").config({ path: path.join(".env") })
const cors = require("cors")
import express, { Request, response, Response } from "express"
import router from "./routes"
import {
    sessionDetails,
    adminRegister,
    adminLogin,
    adminLogout,
    isValidAdmin,
    isValidSuperAdmin,
    adminForgotPassword,
    adminResetPassword,
} from "./routes/adminuser"

//connect DB
import { store, connectMongo } from "./config/mongo"
connectMongo()

const port: Number = 7000
const session = require("express-session")
const bodyParser = require("body-parser")
const app = express()

import Router from "./routes/user"
import { checkAuthentication, userLogout, getUser } from "./routes/user"
import passport from "passport"

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use(
    session({
        secret: "Keep it secret",
        resave: false,
        name: "uniqueSessionID",
        saveUninitialized: false,
        store: store,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            secure: false,
        },
    })
)

//ADMIN
app.use("/api", router)

// FORGOT AND RESET PASSWORD
app.post("/forgotpassword", adminForgotPassword)
app.post("/resetpassword/:token", adminResetPassword)

// PASSPORT CONFIG --> FOR USER LEVEL AUTH
app.use(passport.initialize())
app.use(passport.session())

//ADMIN LOGIN,REGISTER,LOGOUT ROUTES
app.get("/api/admin", sessionDetails)
app.post("/api/admin/register", adminRegister)
app.post("/api/admin/login", adminLogin)
app.get("/api/admin/logout", adminLogout)

//USER ROUTES
app.use("/api/user", Router)
app.use("/api/user/logout", userLogout)
app.use("/api/user/getuser", getUser)

//Logged in user session details
app.get("/sessiondetail", sessionDetails)
app.get("/admin", sessionDetails)

// BELOW ROUTES FOR TESTING

//TEST WELCOME PAGE
app.get("/", (req, res) => {
    res.send("Welcome to home page")
})

//TEST USER LEVEL PROTECTION ROUTE
app.get("/test", checkAuthentication, (req, res) => {
    return res.send("Inside Protected Route")
})

app.get("/api/admin/dashboard", isValidAdmin, (req, res) => {
    res.send("Inside Admin dashboard")
})
app.get("/api/superadmin/dashboard", isValidSuperAdmin, (req, res) => {
    res.send("Inside super-admin dashboard")
})

app.get("/api/sessiondetail", sessionDetails)

app.listen(port, () => console.log(`Listening on port ${port}`))
