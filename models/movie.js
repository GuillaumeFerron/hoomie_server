/**
 Created by Guillaume Ferron on the 10/4/2017
 **/

import mongoose, { Schema } from 'mongoose';

// Define movie schema
var movieSchema = new Schema({
    title: {
        type: String,
        unique: true,
    },
    poster: String,
    genre: String,
    days: Array,
    times: Array,
});

// Export Mongoose model
export default mongoose.model('movie', movieSchema);