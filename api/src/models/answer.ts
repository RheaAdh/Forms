import mongoose, { Schema, Document } from 'mongoose';
import { Question } from './question';

//!BASE ANSWER SCHEMA WITH THE SAME ANSWER-TYPE DISCRIMINATOR
const options = { discriminatorKey: 'answer-type' };

const answerSchema: Schema = new Schema(
    {
        // userId: { type: Schema.Types.ObjectId, ref: "User" },
        formId: { type: Schema.Types.ObjectId, ref: 'Form' },
        questionId: { type: Schema.Types.ObjectId, ref: 'Question' },
    },
    options
);

//?COMPILE ANSWER MODEL
export const Answer = mongoose.model('answer', answerSchema);

//SHORT ANSWER:shortanswer is a answer-type
const shortAnswerSchema: Schema = new Schema({
    shortText: { type: String, max: 100, min: 1 },
});
export const shortAnswer = Answer.discriminator(
    'shortanswer',
    shortAnswerSchema
);

// PARAGRAPH:paragraphanswer is answer-type
const paragraphAnswerSchema: Schema = new Schema({
    paragraphText: { type: String, max: 500, min: 50 },
});
export const paragraphAnswer = Answer.discriminator(
    'paragraphanswer',
    paragraphAnswerSchema
);

//Email
const emailAnswerSchema: Schema = new Schema({
    emailText: { type: String },
});
export const emailAnswer = Answer.discriminator(
    'emailanswer',
    emailAnswerSchema
);

// MULTIPLE CHOICE:mcqanswer is answer-type
const mcqAnswerSchema: Schema = new Schema({
    selectedOption: String,
});
export const mcqAnswer = Answer.discriminator('mcqanswer', mcqAnswerSchema);

// CHECKBOXES:checkboxanswer is answer type
//!other_selected:String {have to add this as well not sure how}

const checkboxAnswerSchema: Schema = new Schema({
    multipleSelected: [String],
});
export const checkboxAnswer = Answer.discriminator(
    'checkboxanswer',
    checkboxAnswerSchema
);

// DROPDOWN:dropdownanswer is answer type
const dropdownAnswerSchema: Schema = new Schema({
    selectedOption: String,
});
export const dropdownAnswer = Answer.discriminator(
    'dropdownanswer',
    dropdownAnswerSchema
);

//LINEAR SCALE: linearscaleanswer is answer type
const linearscaleAnswerSchema: Schema = new Schema({
    selectedOption: Number,
});
export const linearscaleAnswer = Answer.discriminator(
    'linearscaleanswer',
    linearscaleAnswerSchema
);

//MULTIPLE CHOICE GRID: multiplechoicegridanswer is answer type
const multiplechoicegridAnswerSchema: Schema = new Schema({
    multipleSelected: [String],
});
export const multiplechoicegridAnswer = Answer.discriminator(
    'multiplechoicegridanswer',
    multiplechoicegridAnswerSchema
);

//CHECKBOXES GRID: checkboxgridanswer is answer type
const checkboxgridAnswerSchema: Schema = new Schema({
    multipleSelected: [[String]],
});
export const checkboxgridAnswer = Answer.discriminator(
    'checkboxgridanswer',
    checkboxgridAnswerSchema
);

//DATE: dateanswer is answer type
const dateAnswerSchema: Schema = new Schema({
    selectedDate: Date,
});
export const dateAnswer = Answer.discriminator('dateanswer', dateAnswerSchema);

//TIME: timeanswer is answer type
const timeAnswerSchema: Schema = new Schema({
    timeHours: { type: Number, min: 1, max: 23 }, // Time is in 24 hrs Clock format
    timeMinutes: { type: Number, min: 0, max: 59 },
});
export const timeAnswer = Answer.discriminator('timeanswer', timeAnswerSchema);
