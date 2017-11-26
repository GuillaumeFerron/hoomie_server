/**
 Created by Lisa Martini on the 11/18/2017
 **/

import mongoose, { Schema } from 'mongoose';
import User from './User';

// Define credential schema
const credentialSchema = new Schema({
    user_id : {type: Schema.Types.ObjectId, ref: 'User'},
    login:{type:String,required:true},
    password: {type:String,required:true},
    //allows to know if it's the administrator or not
    admin :{type:Boolean,default:false,required:true}
});

// Export Mongoose model
export default mongoose.model('Credential', credentialSchema);