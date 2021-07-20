import mongoose, { Schema, Document, Mongoose } from "mongoose"
const options = { discriminatorKey: "questionType" }

export interface QuesDoc extends Document {
    formid: { type: Schema.Types.ObjectId; ref: "Form" }
    quesIndex: number
}

//!BASE QUESTION SCHEMA

const questionSchema: Schema = new Schema(
    {
        formid: { type: Schema.Types.ObjectId, ref: "Form" },
        quesIndex: { type: Number, default: 0 },
        questionText: { type: String, required: true },
        required: { type: Boolean, default: false },
        //questionType: String This is  made by default by the discriminator key
        userId: { type: Schema.Types.ObjectId, ref: "user" },
        pageNo: { type: Number, default: 1 },
    },
    options
)

//?COMPILE QUESTION MODEL
// export const Question = mongoose.model("question", questionSchema)
export const Question = mongoose.model<QuesDoc>("question", questionSchema)

// SHORT ANSWER:
const shortSchema: Schema = new Schema({})
export const shortQuestion = Question.discriminator("short-answer", shortSchema)

// PARAGRAPH:
const paragraphSchema: Schema = new Schema({})
export const paragraphQuestion = Question.discriminator(
    "paragraph-answer",
    paragraphSchema
)

// PAGE TITLE and DESCRIPTION
// questiontext is title
const pageHeaderSchema: Schema = new Schema({
    description: { type: String },
})
export const pageHeaderQuestion = Question.discriminator(
    "page-header",
    pageHeaderSchema
)

// EMAIL
// const emailSchema: Schema = new Schema({});
// export const emailQuestion = Question.discriminator(
//     'email-answer',
//     emailSchema
// );
// EMAIL
const emailSchema: Schema = new Schema({})
export const emailQuestion = Question.discriminator("email-answer", emailSchema)
// MULTIPLE CHOICE:
const mcqSchema: Schema = new Schema({
    //array of text
    options: [{ type: String }],
})
export const mcqQuestion = Question.discriminator("mcq-answer", mcqSchema)

// CHECKBOXES:
const checkboxSchema: Schema = new Schema({
    options: [{ type: String }],
})
export const checkboxQuestion = Question.discriminator(
    "checkbox-answer",
    checkboxSchema
)

// DROPDOWN:
const dropdownSchema: Schema = new Schema({
    options: [{ type: String }],
})
export const dropdownQuestion = Question.discriminator(
    "dropdown-answer",
    dropdownSchema
)

//LINEAR SCALE:
const linearscaleSchema: Schema = new Schema({
    lowRating: { type: Number, min: 0, max: 1 },
    highRating: { type: Number, min: 2, max: 10 },
    lowRatingLabel: { type: String, default: "Low" },
    highRatingLabel: { type: String, default: "High" },
})
export const linearscaleQuestion = Question.discriminator(
    "linearscale-answer",
    linearscaleSchema
)

//MULTIPLE CHOICE GRID:
const multiplechoicegridSchema: Schema = new Schema({
    rowLabel: [String],
    colLabel: [String],
})
export const multiplechoicegridQuestion = Question.discriminator(
    "multiplechoicegrid-answer",
    multiplechoicegridSchema
)

//CHECKBOXES GRID:
const checkboxgridSchema: Schema = new Schema({
    rowLabel: [String],
    colLabel: [String],
})
export const checkboxgridQuestion = Question.discriminator(
    "checkboxgrid-answer",
    checkboxgridSchema
)

//DATE:
const dateSchema: Schema = new Schema({})
export const dateQuestion = Question.discriminator("date-answer", dateSchema)

//TIME:
const timeSchema: Schema = new Schema({})
export const timeQuestion = Question.discriminator("time-answer", timeSchema)
