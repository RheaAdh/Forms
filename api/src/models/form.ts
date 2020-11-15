import mongoose, { Schema, Document } from "mongoose";

// export interface Form extends Document {
//   Form: {
//     form_id: mongoose.Schema.Types.ObjectId;
//   };
// }

//!BASE QUESTION SCHEMA
const options = { discriminatorKey: "question-type" };
const questionSchema: Schema = new Schema(
  {
    text: String,
    description: String,
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

//?COMPILE MCQ SCEMA
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

//!FORM SCHEMA EMBEDS QUESTION SCHEMA REFERENCES
const form: Schema = new Schema({
  name: String,
  bg_img: String,
  file: String,
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
});

//?COMPILE FORM MODEL
export const Form = mongoose.model("form", form);
