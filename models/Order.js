/**
 * @description Defines an Order model
 */
const mongoose = require('mongoose');
const {Schema} = mongoose;
const OrderItem = require('./Helpers/OrderItem');
const {ORDER_STATUSES} = require('./constants');

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

module.exports = mongoose.model('Order', OrderSchema);