import { Document, Schema } from "mongoose";
import { Response, Request, NextFunction } from "express";
import * as mongo from "../config/mongo";
import { User } from "../models/user";
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

export async function checkUserExists(req: Request, res: Response) {
    await mongo.connectMongo();
    console.log(" checkUserExists POST REQUEST WAS MADE");
    const { email } = req.body;

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
    } else {
        //ONE TIME LINK FOR 10MINS
        const secret = JWT_SECRET + user.password;
        const token = jwt.sign({ email: email }, secret, { expiresIn: "10m" });
        const link = `https://localhost:7000/resetpassword/${email}/${token}`;
        // "link" HAS TO BE SENT TO EMAIL
        res.send(link);
    }
}
