import { Document, Schema } from "mongoose";
import { Response, Request, NextFunction } from "express";
import * as mongo from "../config/mongo";
import { User } from "../models/user";
import { v4 as uuidv4 } from "uuid";
import { hash } from "bcryptjs";
uuidv4();

declare module "express-session" {
    interface Session {
        isAuth: boolean;
        userId: Schema.Types.ObjectId;
        role: String;
        email: String;
        username: String;
    }
}
const bcrypt = require("bcryptjs");

//FOR ADMINS

export async function adminRegister(req: Request, res: Response) {
    await mongo.connectMongo();
    console.log("POST REQUEST WAS MADE");
    const { username, password, confirmPassword, email } = req.body;

    //CHECKING FOR CORRECT EMAIL TYPE
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
        return res.send({
            success: false,
            data: "Please enter a valid email type",
        });
    }

    //CHECKING FOR EXISTING USER
    let user = await User.findOne({ email });
    if (user) {
        return res.send({
            success: false,
            data:
                "User exists with same details,try again with a new password if not registered",
        });
    }
    let usernameExists = await User.findOne({ username });
    if (usernameExists) {
        return res.send({
            success: false,
            data: "Username already exists",
        });
    }
    //USER NOT CREATED
    if (password.length < 8) {
        return res.send({
            success: false,
            data: "Password must be atleast 8 characters long",
        });
    }

    //MATCHING CONFIRM PASSWORD AND PASSWORD
    if (confirmPassword != password) {
        return res.send({
            success: false,
            data: "Password and Confirm Password does not match",
        });
    }

    //STORING USER IN DB
    const hashpwd = await bcrypt.hash(req.body.password, 10);
    user = new User({
        username,
        password: hashpwd,
        email,
        role: "admin",
        token: uuidv4(),
    });

    try {
        await user.save();
        console.log("New admin created!");
        return res.send({
            success: true,
            data: "Successfully registered a new admin",
        });
    } catch (error) {
        return res.send({ success: false, data: error });
    }
}

export async function adminLogin(req: Request, res: Response) {
    await mongo.connectMongo();
    console.log(" adminLogin POST REQUEST WAS MADE");
    const { email, password } = req.body;
    let user: any;
    try {
        user = await User.findOne({ email });
    } catch (error) {
        console.error("error");
    }
    if (!user) {
        return res.send({
            success: false,
            data: "User doesnt exist, Please register to Login",
        });
    }

    const validCred = await bcrypt.compare(password, user.password);
    if (!validCred) {
        return res.send({
            success: false,
            data: "Invalid Credentials, Please try again",
        });
    }
    req.session.isAuth = true;
    req.session.userId = user._id;
    req.session.role = user.role;
    req.session.email = email;
    req.session.username = user.username;

    if (user.role == "superadmin") {
        return res.send({
            success: true,
            data: "Successfully LoggedIn, Redirect SuperAdmin Dashboard",
            user: user,
        });
    } else if (user.role == "admin") {
        return res.send({
            success: true,
            data: "Successfully LoggedIn, Redirect Admin Dashboard",
            user: { role: user.role, email: user.email },
        });
    }
}

//MIDDLEWARE TO CHECK ADMIN
export async function isValidAdmin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    await mongo.connectMongo();
    if (req.session.isAuth) {
        next();
    } else {
        return res.send({
            success: false,
            data: "You are not LoggedIn, Please Login to view",
        });
    }
}

//NOTE: Superadmin can access both admin and superadmin routes

//MIDDLEWARE TO CHECK SUPERADMIN
export async function isValidSuperAdmin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    await mongo.connectMongo();
    if (req.session.isAuth) {
        if (req.session.role == "superadmin") {
            next();
        } else {
            return res.send({
                success: false,
                data: "Superadmin access required",
            });
        }
    } else {
        return res.send({ success: false, data: "Please Login to view" });
    }
}

export async function adminLogout(
    req: Request,
    res: Response,
    next: NextFunction
) {
    await mongo.connectMongo();
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            //session deleted
            return res.send({ success: true, data: "Successfully LoggedOut" });
        }
    });
}

export async function adminForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
) {
    await mongo.connectMongo();
    console.log("adminForgotPassword POST REQUEST WAS MADE");
    let { email } = req.body;
    let user: any;
    try {
        user = await User.findOne({ email });
    } catch (error) {
        console.error("error");
    }

    if (!user) {
        return res.send({
            success: false,
            data: "User doesnt exist",
        });
    }

    let usertoken = user.token;
    let link = `http://localhost:7000/resetpassword/${usertoken}`;

    //send email with this link
    return res.send({
        success: true,
        data: link,
    });
}

export async function adminResetPassword(
    req: Request,
    res: Response,
    next: NextFunction
) {
    await mongo.connectMongo();
    console.log("adminResetPassword POST REQUEST WAS MADE");
    const compareToken = req.params.token;
    console.log(compareToken);

    let { newPassword, newConfirmPassword } = req.body;

    let user: any;
    try {
        user = await User.findOne({ token: compareToken });
    } catch (error) {
        console.error("error");
    }

    if (newPassword === newConfirmPassword) {
        const hashpwd = await bcrypt.hash(newPassword, 10);
        //updating newpassword by using old token
        user = await User.updateOne(
            { token: compareToken },
            { $set: { password: hashpwd } }
        );
        //generate new token
        user = await User.updateOne(
            { token: compareToken },
            { $set: { token: uuidv4() } }
        );
        return res.send({
            success: true,
            data: "Successfully created new password",
        });
    }
}

export function sessionDetails(req: Request, res: Response) {
    console.log("SessionID : ", req.sessionID);
    console.log("Session: ", req.session);
    res.send(req.session);
}
