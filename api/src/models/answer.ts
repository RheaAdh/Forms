import mongoose, { Schema, Document } from 'mongoose';

export interface Answer extends Document {
    optionNumber:Number,
    answerBody:String,
    isCorrectAnswer:Boolean
}


export const AnswerOptionSchema: Schema = new Schema({
  optionNumber: {
    type: Number
  },
  answerBody: {
    type: String,
    minlength: 1,
    maxlength: 200,
  },
  isCorrectAnswer: { // you can store the correct answer with question id in another model.
    type: Boolean,
    default: false
  }
}, {
  _id: false
});

export default mongoose.model<Answer>('AnswerOptionSchema', AnswerOptionSchema);