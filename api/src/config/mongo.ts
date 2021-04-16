import mongoose, { Collection } from "mongoose";
const session =require("express-session")
const MongoDBSession=require("connect-mongodb-session")(session)

export function connectMongo() {
    console.log("Haha");
    var mongouri: string = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:27017/forms`;
    console.log("haha");
    mongoose.connect(
        mongouri,
        {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex:true
        },
        (err: any) => {
        if (err) console.log(err);
        else console.log("Connected to DB!!!");
        }
    );
}

export const store=new MongoDBSession({
    uri:`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:27017/forms`,
    collection:"AllSessions"
})