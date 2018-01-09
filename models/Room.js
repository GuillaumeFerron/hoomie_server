/**
 Created by Lisa Martini on the 11/19/2017
 **/

import mongoose, { Schema } from 'mongoose';
import Temperature from './Temperature';
import Atmosphere from './Atmosphere';
import User from './User';

// Define room schema
const roomSchema = new Schema({
    inhabitants : [{type: Schema.Types.ObjectId, ref:'User'}],
    number:{type:Number,required:true},
    temperatures: [{type:Schema.Types.ObjectId,ref:'Temperature'}],
    atmospheres :[{type:Schema.Types.ObjectId,ref:'Atmosphere'}],
    //sound :[{type:Schema.Types.ObjectId,ref:'sound'}],
    //light :[{type:Schema.Types.ObjectId,ref:'light'}],
    //solar_light:[{type:Schema.Types.ObjectId,ref:'solar_light'}],

});

// Export Mongoose model
export default mongoose.model('Room', roomSchema);