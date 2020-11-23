import mongoose, { Schema, Document } from "mongoose";
import { Question } from "./question";

//!BASE ANSWER SCHEMA WITH THE SAME QUESTION-TYPE DISCRIMINATOR
const options = { discriminatorKey: "answer-type" };

const answerSchema: Schema = new Schema({
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  options,
});

//?COMPILE ANSWER MODEL
export const Answer = mongoose.model("answer", answerSchema);

// SHORT ANSWER:short-answer is a answer-type
const shortAnswerSchema: Schema = new Schema({
  shortans_text: { type: String, max: 100, min: 1 },
});
export const shortAnswer = Answer.discriminator(
  "short-answer",
  shortAnswerSchema
);

// PARAGRAPH:paragraph-answer is answer-type
const paragraphAnswerSchema: Schema = new Schema({
  paragraphans_text: { type: String, max: 500, min: 50 },
});
export const paragraphAnswer = Answer.discriminator(
  "paragraph-answer",
  shortAnswerSchema
);

// MULTIPLE CHOICE:mcq-answer is answer-type
const mcqAnswerSchema: Schema = new Schema({ selected_option: String });
export const mcqAnswer = Answer.discriminator("mcq-answer", mcqAnswerSchema);

// CHECKBOXES:checkbox-answer is answer type
//!other_selected:String {have to add this as well not sure how}

const checkboxAnswerSchema: Schema = new Schema({
  multipleans_selected: [String],
});
export const checkboxAnswer = Answer.discriminator(
  "checkbox-answer",
  checkboxAnswerSchema
);

// DROPDOWN:dropdown-answer is answer type
const dropdownAnswerSchema: Schema = new Schema({ selected_option: String });
export const dropdownAnswer = Answer.discriminator(
  "dropdown-answer",
  dropdownAnswerSchema
);


//LINEAR SCALE: linearscale-answer is answer type
const linearscaleAnswerSchema: Schema = new Schema({ selected_option: Number });
export const linearscaleAnswer = Answer.discriminator(
  "linearscale-answer",
  linearscaleAnswerSchema
)
//MULTIPLE CHOICE GRID: multiplechoicegrid-answer is answer type 
const multiplechoicegridAnswerSchema: Schema = new Schema({ selected_option: [String] })
export const multiplechoicegridAnswer = Answer.discriminator(
  "multiplechoicegrid-answer",
  multiplechoicegridAnswerSchema
)
//CHECKBOXES GRID: checkboxgrid-answer is answer type
const checkboxgridAnswerSchema: Schema = new Schema({  selected_option: [[String]]  })
export const checkboxgridAnswer = Answer.discriminator(
  "checkboxgrid-answer",
  checkboxgridAnswerSchema
)
//DATE: date-answer is answer type
const dateAnswerSchema : Schema = new Schema ({ selected_date: Date })
export const dateAnswer = Answer.discriminator(
  "date-answer",
  dateAnswerSchema
)
//TIME: time-answer is answer type
const timeAnswerSchema : Schema = new Schema ({
      time_hour: {type:Number,min : 1, max : 23 },     // Time is in 24 hrs Clock format
      time_min: {type:Number, min : 0 , max : 59}
})
export const timeAnswer = Answer.discriminator(
  "time-answer",
  timeAnswerSchema
)