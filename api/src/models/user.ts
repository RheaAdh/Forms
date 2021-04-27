import mongoose, { Schema, Document } from 'mongoose'

//USER SCHEMA
const userSchema: Schema = new Schema(
    {
        username:{
            type:String,
            default:null,
        },
        password: {
            type: String,
            default: null,
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
        },
        token:{
            type:String,
            default:null,
        }
    },
    {
        timestamps: true,
    }
);

//COMPILE USER MODEL

export const User = mongoose.model('User', userSchema);
