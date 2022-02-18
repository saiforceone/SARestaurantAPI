/**
 * @description Represents a restaurant location.
 */
import mongoose from 'mongoose';
const {Schema} = mongoose;

import Image from './Helpers/Image.mjs';

const RestaurantLocationSchema = new Schema({
    locationName: {required: true, minlength: 5, trim: true, type: String},
    address: {
        address1: {trim: true, type: String, default: ''},
        address2: {trim: true, type: String, default: ''},
        geo: {
            maxlength: 2,
            type: [Number]
        }
    },
    seatingCapacity: {min: 0, type: Number},
    openForBusiness: {default: true, type: Boolean},
    servicesAvailable: {type: [String]},
    contactDetails: {
        primaryPhone: {trim: true, type: String, default: ''},
        primaryEmail: {trim: true, type: String, default: ''},
        website: {trim: true, type: String, default: ''},
    },
    images: {
        type: [Image]
    }
});

export default mongoose.model('RestaurantLocation', RestaurantLocationSchema);  