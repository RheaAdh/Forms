import mongoose, { Schema, Document } from "mongoose"

export interface FormDoc extends Document {
    title: string
    color_theme: string
    //array of question ids
    questions: [
        {
            _id: any
            question_text: string
        }
    ]
    owner: any
}
//!FORM SCHEMA EMBEDS QUESTION SCHEMA REFERENCES
const form: Schema = new Schema(
    {
        title: { type: String, required: true },
        color_theme: String,
        //array of question ids
        questions: [{ type: Schema.Types.ObjectId, ref: "question" }],
        owner: { type: Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
)

//?COMPILE FORM MODEL

export const Form = mongoose.model<FormDoc>("form", form)
