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
