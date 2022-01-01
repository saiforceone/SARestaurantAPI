/**
 * @description Represents a restaurant location.
 */
import mongoose from 'mongoose';
const {Schema} = mongoose;

import Image from './Helpers/Image';

const RestaurantLocationSchema = new Schema({
    locationName: {required: true, minlength: 5, trim: true, type: String},
    address: {
        address1: {minlength: 5, trim: true, type: String},
        address2: {trim: true, type: String},
        geo: {
            maxlength: 2,
            type: [Number]
        }
    },
    seatingCapacity: {min: 0, type: Number},
    openForBusiness: {default: true, type: Boolean},
    servicesAvailable: {type: [String]},
    contactDetails: {
        primaryPhone: {trim: true, type: String},
        primaryEmail: {trim: true, type: String},
        website: {trim: true, type: String}
    },
    images: {
        type: [Image]
    }
});

export default mongoose.model('RestaurantLocation', RestaurantLocationSchema);