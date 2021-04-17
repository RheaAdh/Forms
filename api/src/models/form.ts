import mongoose, { Schema, Document } from 'mongoose';
import { Question } from './question';
import { Answer } from './answer';

//!FORM SCHEMA EMBEDS QUESTION SCHEMA REFERENCES
const form: Schema = new Schema(
    {
        title: { type: String, required: true },
        color_theme: String,
        //array of question ids
        questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
        answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    },
    {
        timestamps: true,
    }
);

//?COMPILE FORM MODEL

export const Form = mongoose.model('form', form);
