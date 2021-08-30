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
    multipleResponses: boolean
    isActive: boolean
    isTemplate: boolean
    role: string
    editors: [Schema.Types.ObjectId]
    dontdelete: boolean
    anonymous: boolean
    theme: any
    sheetId: string
    customLink: String
}
//!FORM SCHEMA EMBEDS QUESTION SCHEMA REFERENCES
const form: Schema = new Schema(
    {
        title: { type: String, required: true },
        color_theme: String,
        questions: [{ type: Schema.Types.ObjectId, ref: "question" }],
        owner: { type: Schema.Types.ObjectId, ref: "user" },
        description: { type: String },
        closes: Date,
        isEditable: { type: Boolean, default: true },
        isActive: { type: Boolean, default: true },
        multipleResponses: { type: Boolean, default: false },
        isTemplate: { type: Boolean, default: false },
        role: { type: String },
        editors: [{ type: Schema.Types.ObjectId, ref: "user" }],
        dontdelete: { type: Boolean, default: false }, //To be used only with default Templates
        anonymous: { type: Boolean, default: false },
        theme: { type: Schema.Types.ObjectId, ref: "theme" },
        sheetId: { type: String },
        pages: { type: Number, default: 1 },
        customLink: { type: String },
    },
    {
        timestamps: true,
    }
)

//?COMPILE FORM MODEL

export const Form = mongoose.model<FormDoc>("Form", form)
