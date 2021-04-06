import mongoose, { Schema, Document } from "mongoose";
import { Question } from "./question";
import { Answer } from "./answer";


const responses: Schema = new Schema({
//     //array of users
//   users:[{ type: Schema.Types.ObjectId, ref: "User" }],
//   //array of question,answer 
//   questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
//   answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
}
);

// //?COMPILE Responses MODEL

export const Responses = mongoose.model("responses", responses);
