import mongoose, { Schema, Document } from 'mongoose';
import { AnswerOptionSchema } from './answer';

const question: Schema = new Schema({
    form_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'form'
    },
    q_id: {
        type: mongoose.Schema.Types.ObjectId,
        unique:true,
        required: true
    },
    q_type: {
        type: String,
        required: true
    },
    answerOptions: {
        type: [AnswerOptionSchema],
        default: undefined,
    },  
    answerColumns: {
        type: [String]
    }
})

export default mongoose.model('question', question);