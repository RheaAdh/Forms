import mongoose, { Schema, Document } from "mongoose";
import {Answer} from './answer';
const options = { discriminatorKey: "question-type" };

//!BASE QUESTION SCHEMA

const questionSchema: Schema = new Schema(
  {
    question_text: { type: String, required: true },
    description: { type: String },
    //question_type: String This is  made by default by the discriminator key
    answer: { type: Schema.Types.ObjectId, ref: 'Answer' },
    required: Boolean,
  },
  options
);

//?COMPILE QUESTION MODEL
export const Question = mongoose.model("question", questionSchema);

// SHORT ANSWER:
const shortSchema:Schema=new Schema({
  options:{text:String}
})
export const shortQuestion=Question.discriminator(
  "short-answer",
  shortSchema
) 
// PARAGRAPH:
const paragraphSchema:Schema=new Schema({
  options:{text:String}
})
export const paragraphQuestion=Question.discriminator(
  "paragraph-answer",
  paragraphSchema
) 
// MULTIPLE CHOICE:
const mcqSchema:Schema=new Schema({
  //array of text
  options:[{text:String}]
})
export const mcqQuestion=Question.discriminator(
  "mcq-answer",
  mcqSchema
) 
// CHECKBOXES:
const checkboxSchema:Schema=new Schema({
  options:[{text:String}]
})
export const checkboxQuestion=Question.discriminator(
  "checkbox-answer",
  checkboxSchema
) 
// DROPDOWN:
const dropdownSchema:Schema=new Schema({
  options:[{text:String}]
})
export const dropdownQuestion=Question.discriminator(
  "dropdown-answer",
  dropdownSchema
) 

