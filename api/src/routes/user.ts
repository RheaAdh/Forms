import express from "express"
const Router = express.Router()
import passport from "passport"
import { User } from "../models/user"
import { Form } from "../models/form"

const GoogleStrategy = require("passport-google-oauth20").Strategy

Router.use(express.json())

import { fid } from "./form"

passport.use(
    new GoogleStrategy(
        {
            clientID: `${process.env.GOOGLE_CLIENT_ID}`,
            clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
            callbackURL: "http://localhost:7000/api/user/auth/google/callback",
        },
        function (accessToken: any, refreshToken: any, profile: any, cb: any) {
            //Called on Succcessful Auth!

            User.findOne(
                { email: profile.emails[0].value },
                async (err: Error, doc: any) => {
                    if (err) {
                        //Error
                        return cb(err, null)
                    }
                    if (!doc) {
                        //Inserting New User to DB
                        const newUser = new User({
                            username: profile.displayName,
                            email: profile.emails[0].value,
                            role: "user",
                            isVerified: true,
                        })
                        await newUser.save()
                        cb(null, newUser)
                    } else {
                        //User Already exists
                        console.log("User is already registered")
                        //check
                        cb(null, doc)
                    }
                }
            )
        }
    )
)

passport.serializeUser((user: any, done: any) => {
    // console.log("serialize")
    return done(null, user._id)
})

passport.deserializeUser((id: string, done: any) => {
    User.findById(id, (err: Error, doc: any) => {
        // console.log("de-serialize")
        return done(null, doc)
    })
})

Router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
)

Router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        //!!Needs a frontend route on failure
        failureRedirect: "http://localhost:7000/",
    }),
    function (req, res) {
        // Successful authentication, redirect home.
        console.log("inside call back")
        req.session.role = "user"
        let user = req?.user
        req.session.email = (user as any).email
        req.session.username = (user as any).username
        req.session.userId = (user as any)._id
        req.session.isAuth = true
        console.log("calling finally")
        if (fid !== undefined) res.redirect(`http://localhost:3000/form/${fid}`)
        else res.redirect("http://localhost:3000/login")
    }
)

//USER LOGOUT
export async function userLogout(req: any, res: any) {
    // console.log("Inside logout")
    if (req.user) {
        req.logOut()
        req.session.destroy(function (err: Error) {
            if (err) {
                console.log(err)
            } else {
                //session deleted
                return res.status(200).send({
                    success: true,
                    data: "Successfully Logged out",
                })
            }
        })
    } else {
        return res.status(400).send({ success: false, data: "Login Required" })
    }
}

//TO VIEW LOGGED-IN USER
export async function getUser(req: any, res: any) {
    // console.log(req.user)
    return res.send(req.user)
}

export async function isAnonymous(req: any, res: any) {
    const form = await Form.findById(req.params.formId)
    if (!form) {
        return res.status(404).send({ success: false, msg: "Form not found" })
    }
    return res.send({ success: true, data: form.anonymous })
}

//MIDDLEWARE FOR CHECKING USER LOGIN
export async function checkAuthentication(req: any, res: any, next: any) {
    try {
        let form = await Form.findById(fid)
        if (form) {
            
            if (form.anonymous) {
                //no need authentication
                next()
            } else {
                //isAuth for admins
                console.log("Auth : "+req.isAuthenticated())
                console.log(req.session)
                // console.log(req)
                if (req.isAuthenticated() || req.session.isAuth) {
                    // console.log("Allowed to access")
                    next()
                } else {
                    // console.log("Login to access")
                    res.status(401).send({
                        success: false,
                        data: "Please Login to view",
                    })
                }
            }
        }
    } catch {
        console.log("Server Error")
        res.status(500).send({ success: false, msg: "Server Error" })
    }
}

export default Router
