/**
 * @description Defines a User profile model
 */
import mongoose, { model } from 'mongoose';
const {Schema} = mongoose;

const UserProfileSchema = new Schema({
    username: {required: true, trim: true, type: String},
    serviceName: {default: 'local', required: true, trim: true, type: String},
    lastLogin: {type: Date}
});

export default model('UserProfile', UserProfileSchema);