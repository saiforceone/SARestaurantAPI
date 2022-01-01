/**
 * @description Defines an Order model
 */
import mongoose from 'mongoose';
const {Schema} = mongoose;
import OrderItem from './Helpers/OrderItem.mjs';
import { ORDER_STATUSES } from './constants';

const OrderSchema = new Schema({
    relatedLocation: {ref: 'RestaurantLocation', required: true, type: Schema.Types.ObjectId},
    relatedUser: {ref: 'UserProfile', required: true, type: Schema.Types.ObjectId},
    orderTotal: {default: 0, type: Number},
    orderDate: {default: Date.now, required: true, type: Schema.Types.ObjectId},
    orderItems: {
        type: [OrderItem]
    },
    deliveryNotes: {trim: true, type: String},
    orderNotes: {trim: true, type: String},
    orderStatus: {default: 'received', enum: ORDER_STATUSES, required: true, trim: true, type: String},
});

export default mongoose.model('Order', OrderSchema);