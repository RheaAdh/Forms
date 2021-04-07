import mongoose, { Schema, Document } from "mongoose";
import { Question } from "./question";
import { Answer } from "./answer";

const response: Schema = new Schema({
    userid:{type: String, required: true},
    answers:[{type: Schema.Types.ObjectId,ref: "Answer"}],
    questions:[{type: Schema.Types.ObjectId,ref: "Questions"}]
  }, 
    {
      timestamps:true,
    }
);

export const Response = mongoose.model("response", response);