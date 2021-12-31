/**
 * @description Defines a User profile model
 */
const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserProfileSchema = new Schema({
    username: {required: true, trim: true, type: String},
    serviceName: {default: 'local', required: true, trim: true, type: String},
    lastLogin: {type: Date}
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);