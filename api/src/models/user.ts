import mongoose, { Schema, Document } from "mongoose";

//USER SCHEMA
const userSchema: Schema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            // required:true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ["user", "admin", "superadmin"],
            default: "user",
        },
        makeForm: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

//COMPILE USER MODEL

export const User = mongoose.model("User", userSchema);
