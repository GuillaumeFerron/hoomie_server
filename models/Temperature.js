/**
 Created by Guillaume Ferron on the 10/4/2017
 **/

import mongoose, { Schema } from 'mongoose';
import Room from './Room';

// Define temperature schema
const temperatureSchema = new Schema({
    date: String,
    value: Number,
    room : {type: Schema.Types.ObjectId, ref: 'Room'}
});

// Export Mongoose model
export default mongoose.model('Temperature', temperatureSchema);