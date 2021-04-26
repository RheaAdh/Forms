import mongoose, { Schema, Document } from "mongoose"

//!FORM SCHEMA EMBEDS QUESTION SCHEMA REFERENCES
const form: Schema = new Schema(
    {
        title: { type: String, required: true },
        color_theme: String,
        //array of question ids
        questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
        owner: { type: Schema.Types.ObjectId, ref: "User" },
    },
    {
        timestamps: true,
    }
)

//?COMPILE FORM MODEL

export const Form = mongoose.model("form", form)
