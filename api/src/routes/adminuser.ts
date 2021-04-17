import { Document, Schema } from "mongoose";
import { Response, Request, NextFunction } from "express";
import * as mongo from "../config/mongo";
import { User } from "../models/user";
declare module "express-session" {
  interface Session {
    isAuth: boolean;
    userId: Schema.Types.ObjectId;
    role: String;
    makeForm: Boolean;
  }
}
const bcrypt = require("bcryptjs");

export function SessionDetails(req: Request, res: Response) {
  // console.log(JSON.stringify(req.session));
  console.log("SessionID : ", req.sessionID);
  console.log("Session: ", req.session);
  res.send(req.session);
}

//FOR ADMINS

export async function RegisterUser(req: Request, res: Response) {
  await mongo.connectMongo();
  console.log("POST REQUEST WAS MADE");
  const { username, password, email } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    //REDIRECT TO LOGIN IF ALREADY A REGISTERED USER
    return res.send(
      "User exists with same details,try again with a new password if not registered"
    );
  }
  //USER NOT CREATED
  if (password.length < 7) {
    //REDIRECT TO LOGIN WHEN PASSWORD IS LESS THAN 6 CHARS
    return res.send("Password must be atleast 6 characters long");
  }
  const hashpwd = await bcrypt.hash(req.body.password, 10);
  user = new User({
    username,
    password: hashpwd,
    email,
    role: "admin",
  });

  try {
    await user.save();
    console.log("New admin created!");
    //REDIRECT TO LOGIN PAGE
    return res.send(user);
  } catch (error) {
    return res.send(error);
  }
}

export async function LoginUser(req: Request, res: Response) {
  await mongo.connectMongo();
  console.log("POST REQUEST WAS MADE");
  const { email, password } = req.body;
  let user: any;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    console.error("error");
  }
  if (!user) {
    //REDIRECT TO REGISTER
    return res.send("User doesnt exist");
  }

  const validCred = await bcrypt.compare(password, user.password);
  if (!validCred) {
    return res.send("INVALID CREDENTIALS");
  }
  req.session.isAuth = true;
  req.session.userId = user._id;
  req.session.role = user.role;
  req.session.makeForm = user.makeForm;
  //redirect to all forms page
  if (user.role == "superadmin") {
    //redirect to superadmin-dashborad
    //  return res.send("Access:Superadmin Dashboard")
    return res.redirect("http://localhost:7000/superadmin/dashboard");
  } else if (user.role == "admin") {
    //redirect to admin dashboard
    // return res.send("Access: Admin Dashboard")
    // return res.redirect("http://localhost:7000/admin/dashboard");
    console.log("DO I REACH HERE?");
    console.log(req.session);
    return res.json({ Success: "true" });
  }
  // return res.send("User credentials valid: "+ user)
}

//Middleware to check admin
export async function isValidAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  await mongo.connectMongo();
  console.log(req.session.isAuth);
  console.log("PRINTING SESSION COOKIE");
  console.log(req.session);
  if (req.session.isAuth) {
    next();
  } else {
    //redirect to login
    return res.send({ success: "false", message: "You are not logged in" });
  }
}

//NOTE: For Now Superadmin can access both admin and superadmin routes

//Middleware to check superadmin
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
      //redirect to login page
      return res.send("Superadmin access required");
    }
  } else {
    //redirect to login page
    return res.send("Login Required");
  }
}

export async function LogoutUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  await mongo.connectMongo();
  //redirect to signup
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      //session deleted
      return res.send("LOGGED OUT USER");
    }
  });
}
