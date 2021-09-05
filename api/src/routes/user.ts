import express, { Request, Response } from "express"
const Router = express.Router()
import { User } from "../models/user"
import { Form } from "../models/form"
import { OAuth2Client, TokenPayload } from "google-auth-library"
import { fid } from "./form"
import { store } from "../config/mongo"

const client = new OAuth2Client(process.env.CLIENT_ID)

Router.use(express.json())

Router.post("/auth/google", async (req: Request, res: Response) => {
    const { token } = req.body
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    })
    const { name, email, picture }: any = ticket.getPayload()
    let user = await User.findOne({ email })
    if (!user) {
        // Register user into db
        user = new User({
            username: name,
            email: email,
            role: "user",
            isVerified: true,
        })
        await user.save()
    }
    req.session.email = user.email
    req.session.username = user.username
    req.session.userId = user._id
    req.session.isAuth = true
    req.session.role = "user"
    console.log(req.session)
    res.send({ name, email })
})

export async function userLogout(req: Request, res: Response) {
    if (req.user) {
        req.logOut()
        req.session.destroy(function (err: Error) {
            if (err) {
                console.log(err)
            } else {
                //session deleted
                return res.send({
                    success: true,
                    data: "Successfully Logged out",
                })
            }
        })
    } else {
        return res.status(400).send({ success: false, data: "Login Required" })
    }
}

export async function getUser(req: any, res: any) {
    return res.send(req.user)
}

export async function checkAuthentication(req: any, res: any, next: any) {
    try {
        let form = await Form.findOne({ linkId: req.params.formId })
        if (!form) {
            form = await Form.findOne({ _id: req.params.formId })
        }
        if (form) {
            if (form.anonymous) {
                //no need authentication
                next()
            } else {
                //isAuth for admins
                let isAuthenticated = req.session.isAuthenticated
                if (isAuthenticated || req.session.isAuth) {
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
    } catch (e) {
        console.log(e)
        console.log("Server Error")
        res.status(500).send({ success: false, msg: "Server Error" })
    }
}

export async function isAnonymous(req: any, res: any) {
    let form = await Form.findOne({ linkId: req.params.formId })
    if (!form) {
        form = await Form.findOne({ _id: req.params.formId })
    }
    if (!form) {
        return res.status(404).send({ success: false, msg: "Form not found" })
    }
    return res.send({ success: true, data: form.anonymous })
}

export default Router
