/**
 Created by Lisa Martini on the 01/09/2018
 **/

import mongoose, { Schema } from 'mongoose';
import Room from './Room';

// Define temperature schema
const atmosphereSchema = new Schema({
    date: String,
    co: Number,
    no2: Number,
    room : {type: Schema.Types.ObjectId, ref: 'Room'}
});

// Export Mongoose model
export default mongoose.model('Atmosphere', atmosphereSchema);