import mongoose, { Schema, Document } from "mongoose"

export interface FormDoc extends Document {
    _id: string
    title: string
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
    theme: [Schema.Types.ObjectId]
    sheetId: string
    pages: number
}
//!FORM SCHEMA EMBEDS QUESTION SCHEMA REFERENCES
const form: Schema = new Schema(
    {
        _id: { type: String, required: true, length: 6 }, // nanoid of length 6
        linkId: { type: String, unique: true, sparse: true, min: 5, max: 25 }, //optional, set by user
        title: { type: String, required: true },
        theme: [{ type: Schema.Types.ObjectId, ref: "theme" }],
        questions: [{ type: Schema.Types.ObjectId, ref: "question" }],
        owner: { type: Schema.Types.ObjectId, ref: "user" },
        description: { type: String },
        closes: { type: Date },
        isEditable: { type: Boolean, default: true },
        isActive: { type: Boolean, default: true },
        multipleResponses: { type: Boolean, default: false },
        isTemplate: { type: Boolean, default: false },
        role: { type: String },
        editors: [{ type: Schema.Types.ObjectId, ref: "user" }],
        dontdelete: { type: Boolean, default: false }, //To be used only with default Templates
        anonymous: { type: Boolean, default: false },
        sheetId: { type: String },
        pages: { type: Number, default: 1 },
    },
    {
        timestamps: true,
    }
)

//?COMPILE FORM MODEL

export const Form = mongoose.model<FormDoc>("Form", form)
