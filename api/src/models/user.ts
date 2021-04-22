import mongoose, { Schema, Document } from 'mongoose'

//USER SCHEMA
const userSchema: Schema = new Schema(
    {
        password: {
            type: String,
            default: null,
            required:true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'superadmin'],   
            default: 'user',
            required:true
        },
        token:{
            type:String
        }
    },
    {
        timestamps: true,
    }
);

//COMPILE USER MODEL

export const User = mongoose.model('User', userSchema);
