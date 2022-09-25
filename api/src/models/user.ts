import mongoose, { Schema, Document } from "mongoose"

export interface UserDoc extends Document {
    username: string
    password: string
    email: string
    role: string
    token: string
    isVerified: boolean
}

//USER SCHEMA
const userSchema: Schema = new Schema(
    {
        username: {
            type: String,
            default: null,
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
            enum: ["user", "admin", "superadmin"],
            default: "user",
        },
        token: {
            type: String,
            default: null,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
)

//COMPILE USER MODEL

export const User = mongoose.model<UserDoc>("user", userSchema)

// export default FormResponse
// export const User = mongoose.model('User', userSchema);
