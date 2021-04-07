import express from 'express';
const Router = express.Router();
import mongoose from 'mongoose';
// import cors from 'cors';
import session from 'express-session'
import passport from 'passport'
import { User } from "../models/user";


const GoogleStrategy = require('passport-google-oauth20').Strategy;

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:27017/forms`,{useNewUrlParser: true,useUnifiedTopology: true},async ()=>{
   await  console.log("Connected to DB")
})

Router.use(express.json());
// app.use(cors({ origin: "https://localhost:3000", credentials: true }))
// app.set("trust proxy", 1);


//Using GoogleStrategy for Authentication 
passport.use(new GoogleStrategy({
    clientID: `${process.env.GOOGLE_CLIENT_ID}`,
    clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    callbackURL:"http://localhost:7000/user/auth/google/callback"    
  },

function(accessToken:any, refreshToken:any, profile:any, cb:any) {

        //Called on Succcessful Auth!
        console.log("Inside function")
        
        User.findOne({email:profile.emails[0].value},async (err:Error,doc:any) => {
          if(err)
          {
              //Error
            return cb(err,null)
          }
          if(!doc)
          {
            //Inserting New User to DB
            console.log("Inserting new user")
            const newUser= new User({
              username:profile.displayName,
              email:profile.emails[0].value,
            //   password:"",
              role:'user',
            })
            await newUser.save()
            console.log("New User saved in database")
            cb(null,newUser)
          }
          else
          {
              //User Already exists
            console.log("User is already registered")
            cb(null,doc)
          }
        })
}));

passport.serializeUser((user:any,done:any)=>{
    return done(null,user._id)
  })

passport.deserializeUser((id: string, done: any) => {
    User.findById(id, (err: Error, doc: any) => {
      // Whatever we return goes to the client and binds to the req.user property
      return done(null, doc);
    })
})

Router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] }));

Router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:7000/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("inside call back")

    //Redirect to Homepage
    res.redirect('http://localhost:7000/');
  });


//Logout
export async function userLogout(req: any, res: any){
  console.log("Inside logout")
  if(req.user)
  {
    req.logOut()
    req.session.destroy(function(err:Error){
      if(err){
         console.log(err);
      }else{
        //session deleted
        return res.send("Logout Successful")
      }
   });
  }
  else
  {
      return res.send("Login Required")
  }
}

 
//To view Logged in User   
export async function getUser(req: any, res: any){
      console.log(req.user)  
      return res.send(req.user)
}

  
//checkAuthentication  middleware
export async function checkAuthentication(req:any,res:any,next:any){
    if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        console.log('Allowed to access')
        next();
    } else{
        console.log("Login to access")
        res.redirect('http://localhost:7000/');
    }
  }

export default Router;
