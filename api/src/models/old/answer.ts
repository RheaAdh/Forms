import mongoose, { Schema, Document } from 'mongoose';

export interface Answer extends Document {
    optionNumber:Number,
    answerBody:String,
    isCorrectAnswer:Boolean
}

export const AnswerOptionSchema: Schema = new Schema({
    form_id: {
      type:mongoose.Schema.Types.ObjectId,
      ref:'form',
      required: true
    },
    q_id:{
      type : mongoose.Schema.Types.ObjectId,
      ref:'question',
      required: true
    },
    answer_id: {
      type:mongoose.Schema.Types.ObjectId,
      unique:true,
    },
    u_id: {
      type:mongoose.Schema.Types.ObjectId,
      required: true
    },
    optionNumber: {
      type: Number
    },
    answerBody: {
      type: String,
      minlength: 1,
      maxlength: 200,
    }
  } 
);

export default mongoose.model<Answer>('AnswerOptionSchema', AnswerOptionSchema);