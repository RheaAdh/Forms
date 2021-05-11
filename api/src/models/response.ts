import mongoose, { Schema, Document } from "mongoose"
export interface ResponseDoc extends Document {
    username: string
    userid: any
    formId: any
    responses: [
        {
            questionId: string
            answerType: string
            shortText: string
            paragraphText: string
            emailText: string
            selectedOption: string
            multipleSelected: [string]
            selectedOptionsGrid: [{ row: string; col: string }]
            selectedOptionLinScale: Number
            selectedDate: Date
            timeHours: Number
            timeMinutes: Number
            emailAnswer: string
        }
    ]
}

const response: Schema = new Schema({
    username: { type: String },
    userid: { type: Schema.Types.ObjectId, ref: "User" },
    formId: { type: Schema.Types.ObjectId, ref: "Form" },
    responses: [
        {
            questionId: { type: Schema.Types.ObjectId, ref: "question" },
            answerType: { type: String, required: true },
            shortText: { type: String, max: 100, min: 1 },
            paragraphText: { type: String, max: 500, min: 50 },
            emailText: { type: String },
            selectedOption: { type: String },
            multipleSelected: { type: [String], default: undefined },
            selectedOptionsGrid: {
                type: [{ row: String, col: String }],
                default: undefined,
            },
            selectedDate: { type: Date },
            timeHours: { type: Number, min: 1, max: 23 },
            timeMinutes: { type: Number, min: 0, max: 59 },
            emailAnswer: { type: String },
        },
    ],
})
const FormResponse = mongoose.model<ResponseDoc>("response", response)

export default FormResponse
