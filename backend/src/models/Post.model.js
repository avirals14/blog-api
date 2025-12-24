import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    title:{
        type:String,
        trim:true,
        required:true,
        minlength:3,
    },
    content:{
        type:String,
        required:true,
        minlength:10,
    },
    author:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    isPublished:{
        type:Boolean,
        default:true,
    },
}, {timestamps:true});

export default mongoose.model("Post", postSchema);