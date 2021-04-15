import mongoose, { Schema, Document } from "mongoose";
import { Question } from "./question";
import { Answer } from "./answer";

const response: Schema = new Schema(
    {
        questionId:{type: Schema.Types.ObjectId, ref: "Question"},
        userId:{type: Schema.Types.ObjectId, ref: "User"},
        answerId:{type: Schema.Types.ObjectId, ref: "Answer"},
        formId:{type: Schema.Types.ObjectId, ref: "Form"}
        
    }
);

export const Response = mongoose.model("response", response);
