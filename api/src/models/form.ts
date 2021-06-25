import mongoose, { Schema, Document } from "mongoose"

export interface FormDoc extends Document {
    title: string
    color_theme: string
    //array of question ids
    questions: [
        {
            _id: any
            questionText: string
        }
    ]
    description: string
    owner: any
    closes: Date
    isEditable: boolean
    isActive: boolean
    isTemplate: boolean
    role: string
    editors: [Schema.Types.ObjectId]
}
//!FORM SCHEMA EMBEDS QUESTION SCHEMA REFERENCES
const form: Schema = new Schema(
    {
        title: { type: String, required: true },
        color_theme: String,
        //array of question ids
        questions: [{ type: Schema.Types.ObjectId, ref: "question" }],
        owner: { type: Schema.Types.ObjectId, ref: "User" },
        description: { type: String },
        closes: Date,
        isEditable: { type: Boolean, default: true },
        isActive: { type: Boolean, default: true },
        multipleResponses: { type: Boolean, default: false },
        isTemplate: { type: Boolean, default: false },
        role: { type: String },
        editors: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    {
        timestamps: true,
    }
)

//?COMPILE FORM MODEL

export const Form = mongoose.model<FormDoc>("form", form)
