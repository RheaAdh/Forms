import mongoose, { Schema, Document } from 'mongoose';
import { AnswerOptionSchema } from './answer';

export enum Gender {
    male = 'male',
    female = 'female',
    undisclosed = 'undisclosed'
}

export interface Name extends Document{
    Name:{
        first: string;
        last: string;
        }
}

export interface Form extends Document{
   Form:{
        question: [string];
        }
}

export interface Heading extends Document{
   Heading:{
       choice1:String, 
       choice2:String, 
       choice3:String, 
       choice4:String, 
       choice5:String,
    }
}

export interface Queries extends Document{
    Heading:{
        query1:String, 
        query2:String, 
        query3:String, 
        query4:String, 
        query5:String,
     }
 }

export interface IUser extends Document {
    Name?:Name,
    PhoneNumber:Number,
    Email: string;
    RegNo:Number,
    gender?: Gender;
    Paragraph:String,
    Short:String,
    img:Object,
    file:Object,
    Form?:Form,
    Heading?: Heading,
    Queries?: Queries
}

  
const main: Schema = new Schema({
    Name:{
        first:{
        type:String,
        require:true
        },
        last:{
        type:String,
        require:true   
        }
    },
    PhoneNumber:{
        type:Number,
        require:true
    },
    Email:{
        type:String,
        require:true,
        unique:true
    },
    RegNo:{
        type:Number,
        require:true,
    },
    gender: { type: String, enum: Object.values(Gender) },
    Paragraph:String,
    Short:String,
    img: 
    { 
        type:Object,
        contentType: String,
        allowedFormats: ["jpg", "png","jpeg"]
    },
    file:
    {
        type:Object,
        contentType: String,
        allowedFormats: ["pdf", "txt","html"]
    },
   
    Form:{
        question: {
            type: [String],
            minlength: 10,
            maxlength: 1000,
          },
          answerOptions: {
            type: [AnswerOptionSchema],
            default: undefined,
            validate: {
              validator: function(value: any) {
                return value && value.length === 4;
              },
              message: 'Answer options should be 4.'
            }, 
        },
    },
    Heading: [{choice1:String, choice2:String, choice3:String, choice4:String, choice5:String,}],
    Queries: [{query1:String, query2:String, query3:String, query4:String, query5:String,}]
})

export default mongoose.model<IUser>('main', main);