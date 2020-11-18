import mongoose, { Schema, Document } from "mongoose";

//todo:
//Make form schema
//Make example question base schema and two children
//Make example answer base schema and two children
//Make example routes (switch case)

// export interface Form extends Document {
//   Form: {
//     form_id: mongoose.Schema.Types.ObjectId;
//   };
// }

//!FORM SCHEMA EMBEDS QUESTION SCHEMA REFERENCES
const form: Schema = new Schema({
  title: { type: String, required: true },
  description: String,
  bg_img: String, //NOT SURE
  file: String, //NOT SURE
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  color_theme: String,
});

//?COMPILE FORM MODEL
export const Form = mongoose.model("form", form);

//!BASE QUESTION SCHEMA
const options = { discriminatorKey: "question-type" };
const questionSchema: Schema = new Schema(
  {
    question_text: { type: String, required: true },
    description: { type: String },
    //question_type: String This is  made by default by the discriminator key
    answer: { type: Schema.Types.ObjectId, ref: "Answer" },
    required: Boolean,
  },
  options
);

//?COMPILE QUESTION MODEL
export const Question = mongoose.model("question", questionSchema);

//!MCQ SCHEMA INHERITS CHILD OF BASE QUESTION SCHEMA
const oocQuestionSchema: Schema = new Schema({
  //ooc: one option correct
  options: [{ option_number: String, text: String }],
});

//?COMPILE MCQ SCEMA
export const oocQuestion = Question.discriminator(
  "ooc-question",
  oocQuestionSchema
);

//!LINEAR SCHEMA INHERITS CHILD OF BASE QUESTION SCHEMA
const lsQuestionSchema: Schema = new Schema({
  //ls: linear scale
  min: Number,
  max: Number,
  min_label: String,
  max_label: String,
});

//?COMPILE LINEAR SCALE SCHEMA
export const lsQuestion = Question.discriminator(
  "ls-question",
  lsQuestionSchema
);

//!BASE ANSWER SCHEMA WITH THE SAME QUESTION-TYPE DISCRIMINATOR
const options2 = { discriminatorKey: "answer-type" };
const answerSchema: Schema = new Schema({
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  options2,
});

//?COMPILE ANSWER MODEL
export const Answer = mongoose.model("answer", answerSchema);

//!OOC SCHEMA
const oocAnswerSchema: Schema = new Schema({ chosen_option: String });

//?COMPILE OOC MODEL
export const oocAnswer = Answer.discriminator("ooc-answer", oocAnswerSchema);

//!LINEAR SCALE ANSWER SCHEMA
const lsAnswerSchema: Schema = new Schema({ chosen_number: Number });

//?COMPILE LINEAR SCALE ANSWER MODEL
export const lsAnswer = Answer.discriminator("ls-answer", lsAnswerSchema);
