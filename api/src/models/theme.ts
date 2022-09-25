import mongoose, { Schema, Document } from "mongoose"

export interface ThemeDoc extends Document {
    bgColor: string
    fontColor: string
    bgImage: string
}

//USER SCHEMA
const themeSchema: Schema = new Schema(
    {
        bgColor: {
            type: String,
            default: "black",
        },
        fontColor: {
            type: String,
            default: "white",
        },
        bgImage: {
            type: String,
            default:".../client/src/images/iecselogo"
        },
    },
    {
        timestamps: true,
    }
)

//COMPILE THEME MODEL

export const Theme = mongoose.model<ThemeDoc>("theme", themeSchema)
