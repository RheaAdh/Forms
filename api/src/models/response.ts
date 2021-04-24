import mongoose, { Schema, Document } from "mongoose";

const response: Schema = new Schema(
    {
        // questionId:{type: Schema.Types.ObjectId, ref: "Question"},
        userId:{type: Schema.Types.ObjectId, ref: "User"},
        answerId:[{type: Schema.Types.ObjectId, ref: "Answer"}],
        formId:{type: Schema.Types.ObjectId, ref: "Form"}
    }
);

export const Response = mongoose.model("response", response);
