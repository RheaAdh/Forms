import mongoose from "mongoose";

export function connectMongo() {
    console.log("Haha");
    //var mongouri: string = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}:${process.env.DB_PORT}`;
    var mongouri: string = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:27017/forms`;
    console.log("haha");
    mongoose.connect(
        mongouri,
        {
        useNewUrlParser: true,
        useUnifiedTopology: true
        },
        (err: any) => {
        if (err) console.log(err);
        else console.log("Connected to DB");
        }
    );
}
