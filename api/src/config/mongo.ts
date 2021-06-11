import mongoose, { Collection } from "mongoose"
const session = require("express-session")
const MongoDBSession = require("connect-mongodb-session")(session)

export const connectMongo = async () => {
    console.log("Haha")
    var mongouri: string = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1zzhu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    console.log("haha")
    const con = await mongoose.connect(
        mongouri,
        {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
        },
        (err: any) => {
            if (err) console.log(err)
            else console.log(`Connected to DB ! `)
        }
    )
}

export const store = new MongoDBSession({
    uri: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1zzhu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    collection: "AllSessions",
})
