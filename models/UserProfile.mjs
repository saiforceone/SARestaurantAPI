/**
 * @description Defines a User profile model
 */
import mongoose from 'mongoose';
const {Schema} = mongoose;

const UserProfileSchema = new Schema({
    username: {required: true, trim: true, type: String, unique: true},
    serviceName: {default: 'local', required: true, trim: true, type: String},
    lastLogin: {type: Date}
});

export default mongoose.model('UserProfile', UserProfileSchema);