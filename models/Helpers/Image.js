/**
 * @description Defines a helper schema for an image. This will not have its own collection
 */
const mongoose = require('mongoose');
const {Schema} = mongoose;

const ImageSchema = new Schema({
    caption: {required: true, trim: true, type: String},
    description: {trim: true, type: String},
    url: {required: true, trim: true, type: String},
});

module.exports = ImageSchema;