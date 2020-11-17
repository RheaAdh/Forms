import mongoose, { Schema, Document } from "mongoose";

// export interface Form extends Document {
//   Form: {
//     form_id: mongoose.Schema.Types.ObjectId;
//   };
// }

//!FORM SCHEMA
const formSchema: Schema = new Schema({
  name: String,
  bg_img: String,
  file: String,
});

//?COMPILE FORM MODEL
export const Form = mongoose.model("form", formSchema);

//!BASE QUESTION SCHEMA WITH QUESTION-TYPE DISCRIMINATOR
const options = { discriminatorKey: "question-type" };
const questionSchema: Schema = new Schema(
  {
    text: String,
    description: String,
    form: { type: Schema.Types.ObjectId, ref: "Form" },
    answer: { type: Schema.Types.ObjectId, ref: "Answer" },
  },
  options
);

//?COMPILE QUESTION MODEL
export const Question = mongoose.model("question", questionSchema);

//!MCQ SCHEMA INHERITS CHILD OF BASE QUESTION SCHEMA
const mcqSchema: Schema = new Schema({
  options: [{ option_number: String, text: String }],
  correct_answer: String,
});

//?COMPILE MCQ MODEL
export const Mcq = Question.discriminator("mcq", mcqSchema);

//!LINEAR SCHEMA INHERITS CHILD OF BASE QUESTION SCHEMA
const linearScaleSchema: Schema = new Schema({
  min: Number,
  max: Number,
  min_label: String,
  max_label: String,
});

//?COMPILE LINEAR SCALE SCHEMA
export const LinearScale = Question.discriminator(
  "linearscale",
  linearScaleSchema
);

//!BASE ANSWER SCHEMA WITH THE SAME QUESTION-TYPE DISCRIMINATOR
const answerSchema: Schema = new Schema({
  question: { type: Schema.Types.ObjectId, ref: "Question" },
});

//?COMPILE ANSWER MODEL
export const Answer = mongoose.model("answer", answerSchema);

//!OOC SCHEMA
const oneOptionCorrectSchema: Schema = new Schema({ chosen_option: String });

//?COMPILE OOC MODEL
export const oneOptionCorrect = Answer.discriminator(
  "ooc",
  oneOptionCorrectSchema
);

//!LINEAR SCALE ANSWER SCHEMA
const lsAnswerSchema: Schema = new Schema({ chosen_number: Number });

//?COMPILE LINEAR SCALE ANSWER MODEL
export const lsAnswer = Answer.discriminator("lsa", lsAnswerSchema);
