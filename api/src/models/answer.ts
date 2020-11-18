import mongoose, { Schema, Document } from "mongoose";
import {Question} from './question';
//!BASE ANSWER SCHEMA WITH THE SAME QUESTION-TYPE DISCRIMINATOR
const options = { discriminatorKey: "answer-type" };

const answerSchema: Schema = new Schema({
  question: { type: Schema.Types.ObjectId, ref: 'Question' },
  options,
});

//?COMPILE ANSWER MODEL
export const Answer = mongoose.model("answer", answerSchema);

// SHORT ANSWER:short-answer is a answer-type
const shortAnswerSchema: Schema = new Schema({ shortans_text: {type: String, max:100,min:1} });
export const shortAnswer = Answer.discriminator("short-answer", shortAnswerSchema);

// PARAGRAPH:paragraph-answer is answer-type
const paragraphAnswerSchema: Schema = new Schema({ paragraphans_text: {type:String,max:500,min:50} });
export const paragraphAnswer = Answer.discriminator("paragraph-answer", shortAnswerSchema);

// MULTIPLE CHOICE:mcq-answer is answer-type
const mcqAnswerSchema: Schema = new Schema({selected_option:String});
export const mcqAnswer = Answer.discriminator("mcq-answer", mcqAnswerSchema);

// CHECKBOXES:checkbox-answer is answer type
//!other_selected:String {have to add this as well not sure how}

const checkboxAnswerSchema: Schema = new Schema({ multipleans_selected:[String]});
export const checkboxAnswer = Answer.discriminator("checkbox-answer", checkboxAnswerSchema);

// DROPDOWN:dropdown-answer is answer type
const dropdownAnswerSchema: Schema = new Schema({ selected_option:String });
export const dropdownAnswer = Answer.discriminator("dropdown-answer", dropdownAnswerSchema);