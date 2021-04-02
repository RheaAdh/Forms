import {Document} from "mongoose"
import { Response, Request } from "express";
import * as mongo from "../config/mongo";
import { User } from "../models/User";

const bcrypt= require("bcryptjs")

export function SessionDetails(req:Request,res:Response){
    // console.log(JSON.stringify(req.session));
    console.log('SessionID : ', req.sessionID)
    console.log('Session: ', req.session)  
}

export async function RegisterUser(req: Request, res: Response) {
    await mongo.connectMongo();
    console.log("POST REQUEST WAS MADE");
    const {username,password,email}=req.body;
    let user=await(User.findOne({email}))
    const hashpwd=await bcrypt.hash(req.body.password,10)
    if(user){
        //REDIRECT TO LOGIN IF ALREADY A REGISTERED USER
        return res.send("User already exists") 
    }
    //USER NOT CREATED
    user= new User({
        username,
        password:hashpwd,
        email
    });
    try {
        await user.save();
        console.log("New user created!");
        //REDIRECT TO ALL FORMS PAGE
        return res.send(user);
    } catch (error) {
        return res.send(error);
    }
}

export async function LoginUser(req: Request, res: Response) {
    await mongo.connectMongo();
    console.log("POST REQUEST WAS MADE");
    const {email,password}=req.body;
    let user:any;
    try {
        user = await User.findOne({email});
      } catch (error) {
        console.error("error");
      }
    if(!user){
        //REDIRECT TO REGISTER 
        return res.send("User doesnt exist") 
    }


    const validCred=await bcrypt.compare(password,user.password)
    if(!validCred){
        return res.send("INVALID CREDENTIALS")
    }
    
    
    // req.session.isValidUser=true
    // (TODO-make middleware to insert in requests)
    
    //redirect to all forms page
    return res.send("User credentials valid: "+ user) 

}