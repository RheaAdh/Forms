import { Document, Schema } from "mongoose"
import { Response, Request, NextFunction } from "express"
import * as mongo from "../config/mongo"
import { User } from "../models/user"
import { v4 as uuidv4 } from "uuid"
import { hash } from "bcryptjs"
const nodemailer = require("nodemailer")
uuidv4()

declare module "express-session" {
    interface Session {
        isAuth: boolean
        userId: Schema.Types.ObjectId
        role: String
        email: String
        username: String
    }
}
const bcrypt = require("bcryptjs")

//FOR ADMINS
export async function adminRegister(req: Request, res: Response) {
    console.log("Registration Status " + process.env.REGISTERATION_OPEN)
    //ISSUES
    if (process.env.REGISTERATION_OPEN == "1") {
        const { username, password, confirmPassword, email } = req.body

        //CHECKING FOR CORRECT EMAIL TYPE
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
            return res.status(400).send({
                success: false,
                data: "Please enter a valid email type",
            })
        }

        //CHECKING FOR EXISTING USER
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).send({
                success: false,
                data:
                    "User exists with same details,try again with a new password if not registered",
            })
        }
        let usernameExists = await User.findOne({ username })
        if (usernameExists) {
            return res.status(400).send({
                success: false,
                data: "Username already exists",
            })
        }
        //USER NOT CREATED
        if (password.length < 8) {
            return res.status(400).send({
                success: false,
                data: "Password must be atleast 8 characters long",
            })
        }

        //MATCHING CONFIRM PASSWORD AND PASSWORD
        if (confirmPassword != password) {
            return res.status(400).send({
                success: false,
                data: "Password and Confirm Password does not match",
            })
        }

        //STORING USER IN DB
        const hashpwd = await bcrypt.hash(req.body.password, 10)
        user = new User({
            username,
            password: hashpwd,
            email,
            role: "admin",
            token: uuidv4(),
        })

        try {
            await user.save()
            console.log("New admin created!")
            return res.status(200).send({
                success: true,
                data: "Successfully registered a new admin",
            })
        } catch (error) {
            console.log(error)
            return res
                .status(500)
                .send({ success: false, data: "Server Error" })
        }
    } else {
        console.log("Registration closed")
        return res.status(400).send({
            success: false,
            msg: "Everyone seems to have registered who are you??",
        })
    }
}

export async function adminLogin(req: Request, res: Response) {
    console.log(" adminLogin POST REQUEST WAS MADE")
    const { email, password } = req.body
    let user: any
    try {
        user = await User.findOne({ email })
    } catch (error) {
        console.error("error")
        res.status(500).send({ success: false, msg: "Server Error" })
    }
    if (!user) {
        return res.status(400).send({
            success: false,
            data: "User doesnt exist, Please register to Login",
        })
    }

    const validCred = await bcrypt.compare(password, user.password)
    if (!validCred) {
        return res.status(400).send({
            success: false,
            data: "Invalid Credentials, Please try again",
        })
    }
    req.session.isAuth = true
    req.session.userId = user._id
    req.session.role = user.role
    req.session.email = email
    req.session.username = user.username

    if (user.role == "superadmin") {
        return res.status(200).send({
            success: true,
            data: "Successfully LoggedIn, Redirect SuperAdmin Dashboard",
            user: {
                role: user.role,
                email: user.email,
                id: user._id,
                username: user.username,
            },
        })
    } else if (user.role == "admin") {
        return res.status(200).send({
            success: true,
            data: "Successfully LoggedIn, Redirect Admin Dashboard",
            user: {
                role: user.role,
                email: user.email,
                id: user._id,
                username: user.username,
            },
        })
    }
}

//MIDDLEWARE TO CHECK ADMIN
export async function isValidAdmin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.session.isAuth) {
        next()
    } else {
        return res.status(401).send({
            success: false,
            data: "You are not LoggedIn, Please Login to view",
        })
    }
}

//NOTE: Superadmin can access both admin and superadmin routes

//MIDDLEWARE TO CHECK SUPERADMIN
export async function isValidSuperAdmin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    //
    if (req.session.isAuth) {
        if (req.session.role == "superadmin") {
            next()
        } else {
            return res.status(403).send({
                success: false,
                data: "Superadmin access required",
            })
        }
    } else {
        return res
            .status(401)
            .send({ success: false, data: "Please Login to view" })
    }
}

export async function adminLogout(
    req: Request,
    res: Response,
    next: NextFunction
) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err)
        } else {
            //session deleted
            return res
                .status(200)
                .send({ success: true, data: "Successfully LoggedOut" })
        }
    })
}

async function emailResponse(token: any, receiver: any) {
    try {
        console.log("inside forgot mailer")
        console.log(receiver.username)

        const output = `<p>Hello ${receiver.username}</p>Link for reset password: <a href ="http://localhost:3000/resetpassword/${token}">http://localhost:3000/resetpassword/${token}</a><p>Regards,<br>IECSE</p>`
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "iecseforms@gmail.com", // generated ethereal user
                pass: "iecse2021", // generated ethereal password
            },
            tls: {
                rejectUnathorized: false,
            },
        })

        // send mail with defined transport object
        try {
            let info = await transporter.sendMail({
                from: '"Admin" <iecseforms@gmail.com>', // sender address
                to: `${receiver.email}`, // list of receivers
                subject: "Reset Password", // Subject line
                text: "Reset Password Link", // plain text body
                html: output, // html body
            })
            console.log("info is " + info)
            console.log("Message sent: %s", info.messageId)
        } catch (err) {
            console.log(err)
        }
    } catch (err) {
        console.log(err)
    }
}
export async function adminForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log("adminForgotPassword POST REQUEST WAS MADE")
    let { email } = req.body
    let user: any
    try {
        user = await User.findOne({ email: email })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ success: false, msg: "Server Error" })
    }

    if (!user) {
        return res.status(400).send({
            success: false,
            data: "User doesnt exist",
        })
    }

    let token = user.token
    // let link = `http://localhost:7000/resetpassword/${token}`
    console.log(user)

    emailResponse(token, user)

    //send email with this link
    return res.status(200).send({
        success: true,
        data: token,
    })
}

export async function adminResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log("adminResetPassword POST REQUEST WAS MADE")
    const compareToken = req.params.token
    console.log(compareToken)

    let { newPassword, newConfirmPassword } = req.body

    let user: any
    try {
        user = await User.findOne({ token: compareToken })
    } catch (error) {
        console.error("error")
    }
    if (newPassword.length >= 8) {
        if (newPassword === newConfirmPassword) {
            const hashpwd = await bcrypt.hash(newPassword, 10)
            //updating newpassword by using old token
            user = await User.updateOne(
                { token: compareToken },
                { $set: { password: hashpwd } }
            )
            //generate new token
            user = await User.updateOne(
                { token: compareToken },
                { $set: { token: uuidv4() } }
            )
            return res.status(200).send({
                success: true,
                data: "Successfully created new password",
            })
        } else {
            return res.status(400).send({
                success: false,
                msg: "confirm and new pass not matching",
            })
        }
    } else {
        return res.status(400).send({ success: false, msg: "min len 8" })
    }
}

export function sessionDetails(req: Request, res: Response) {
    res.status(200).send(req.session)
}

export async function getAllAdmins(req: Request, res: Response) {
    try {
        let admins = await User.find({ role: "admin" }).select("username")
        console.log(admins)
        return res
            .status(200)
            .send({ success: true, msg: "All Admins", data: admins })
    } catch (err) {
        console.log(err)
        return res.status(400).send({ success: false, msg: "Server Error" })
    }
}
