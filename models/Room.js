/**
 Created by Lisa Martini on the 11/19/2017
 **/

import mongoose, { Schema } from 'mongoose';
import Temperature from './temperature';

// Define room schema
const roomSchema = new Schema({
    _id : Schema.Types.ObjectId,
    number:{type:Number,required:true},
    temperature: [{type:Schema.Types.ObjectId,ref:'Temperature'}]
    //sound :[{type:Schema.Types.ObjectId,ref:'sound'}],
    //light :[{type:Schema.Types.ObjectId,ref:'light'}],
    //solar_light:[{type:Schema.Types.ObjectId,ref:'solar_light'}],
    //pollution :[{type:Schema.Types.ObjectId,ref:'pollution'}],
});

// Export Mongoose model
export default mongoose.model('room', roomSchema);