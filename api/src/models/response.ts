import mongoose, { Schema, Document } from "mongoose"
export interface ResponseDoc extends Document {
    username: string
    userid: any
    formId: String
    submitted: boolean
    responses: [
        {
            questionId: string
            answerType: string
            shortText: string
            paragraphText: string
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
    submitTime: String
}

const response: Schema = new Schema(
    {
        username: { type: String },
        userid: { type: Schema.Types.ObjectId, ref: "user", required: true },
        formId: { type: String, ref: "Form", required: true },
        submitted: { type: Boolean, default: false },
        responses: [
            {
                questionId: { type: Schema.Types.ObjectId, ref: "question" },
                answerType: { type: String, required: true },
                shortText: { type: String, max: 100, min: 1 },
                paragraphText: { type: String, max: 500, min: 50 },
                selectedOption: { type: String },
                multipleSelected: { type: [String], default: undefined },
                selectedOptionsGrid: {
                    type: [{ row: String, col: String }],
                    default: undefined,
                },
                selectedDate: { type: Date },
                selectedTime: { type: Date },
                emailAnswer: { type: String },
            },
        ],
        submitTime: { type: String },
    },
    {
        timestamps: true,
    }
)
const FormResponse = mongoose.model<ResponseDoc>("response", response)

export default FormResponse
