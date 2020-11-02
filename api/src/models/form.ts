import mongoose, { Schema, Document } from 'mongoose';

export interface Form extends Document{
   Form:{
        form_id: mongoose.Schema.Types.ObjectId
    }
}

const form: Schema = new Schema({
    form_id:{
         type: mongoose.Schema.Types.ObjectId,
         unique: true,
         required: true,
    },
    bg_img: { 
        type: Object,
        contentType: String,
        allowedFormats: ["jpg", "png","jpeg"]
    },
    file: {
        type: Object,
        contentType: String,
        allowedFormats: ["pdf", "txt","html"]
    },
})

export default mongoose.model<Form>('form', form);
