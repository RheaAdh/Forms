import mongoose, { Schema, Document } from "mongoose"

const response: Schema = new Schema({
    username: { type: String },
    userid:{type: Schema.Types.ObjectId, ref:"User"},
    formId: { type: Schema.Types.ObjectId, ref: "Form" },
    responses: [
        {
            questionId: { type: Schema.Types.ObjectId, ref: "question" },
            answerType: String,
            shortText: { type: String, max: 100, min: 1 },
            paragraphText: { type: String, max: 500, min: 50 },
            emailText: { type: String },
            selectedOption: String,
            multipleSelected: [String],
            selectedOptionsGrid: [{ row: String, col: String }],
            selectedOptionLinScale: Number,
            selectedDate: Date,
            timeHours: { type: Number, min: 1, max: 23 },
            timeMinutes: { type: Number, min: 0, max: 59 },
            emailAnswer: String,
        },
    ],
})
const FormResponse = mongoose.model("response", response)

export default FormResponse
