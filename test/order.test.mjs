import {assert} from 'chai';
import mongoose from 'mongoose';
import config from '../config/testing.mjs';
import OrderController from '../controllers/OrderController.mjs';
import Order from '../models/Order.mjs';
import orderMockData from '../mockData/orderMockData.mjs';

const createOrder = async function(
  customId, 
  relatedLocation, 
  relatedUser, itemRef, itemRef2
) {
  const testData = orderMockData({relatedLocation, relatedUser, itemRef, itemRef2})[0];
  const orderController = new OrderController();
  return await orderController.create(testData, customId);
};

const createOrders = async function(
  relatedLocation, 
  relatedUser, itemRef, itemRef2
) {
  const orderController = new OrderController();
  for(const data of orderMockData({relatedLocation, relatedUser, itemRef, itemRef2})) {
    await orderController.create(data);
  }
};

const generateRefs = () => ({
  relatedLocation: mongoose.Types.ObjectId(),
  relatedUser: mongoose.Types.ObjectId(),
  itemRef: mongoose.Types.ObjectId(),
  itemRef2: mongoose.Types.ObjectId(),
})

beforeEach(async function() {
  await mongoose.connect(config.mongoURI);
});

describe('Order tests', function() {
  it('should create an order using an auto _id', async function() {
    const {relatedLocation, relatedUser, itemRef, itemRef2} = generateRefs();
    const testData = orderMockData({relatedLocation, relatedUser, itemRef, itemRef2})[0];
    const result = await createOrder(undefined, relatedLocation, relatedUser, itemRef, itemRef2);
    console.log('create error: ', result);
    assert.equal(testData['relatedLocation'].str, result['relatedLocation'].str);
  });

  it('should create an order using custom id', async function() {
    const {relatedLocation, relatedUser, itemRef, itemRef2} = generateRefs();
    const customId = mongoose.Types.ObjectId();
    const result = await createOrder(customId, relatedLocation, relatedUser, itemRef, itemRef2);
    assert.equal(customId.str, result['_id'].str);
  });

  // Read Tests
  it('should retrieve an order by id', async function() {
    const {relatedLocation, relatedUser, itemRef, itemRef2} = generateRefs();
    const customId = mongoose.Types.ObjectId();
    await createOrder(customId, relatedLocation, relatedUser, itemRef, itemRef2);
    const orderController = new OrderController();
    const result = await orderController.getItemById(customId);
    assert.equal(customId.str, result['_id'].str);
  });

  it('should retrieve an order using query object', async function() {
    const {relatedLocation, relatedUser, itemRef, itemRef2} = generateRefs();
    const queryObj = {relatedUser};
    await createOrder(undefined, relatedLocation, relatedUser, itemRef, itemRef2);
    const orderController = new OrderController();
    const result = await orderController.getItemByQuery(queryObj);
    assert.exists(result);
  });

  it('should retrieve a list of orders', async function() {
    const {relatedLocation, relatedUser, itemRef, itemRef2} = generateRefs();
    await createOrders(relatedLocation, relatedUser, itemRef, itemRef2);
    const orderController = new OrderController();
    const results = await orderController.getItems();
    assert.lengthOf(results, orderMockData({relatedLocation, relatedUser, itemRef, itemRef2}).length);
  });

  // Update Test
  it('should update an existing order', async function() {
    const customId = mongoose.Types.ObjectId();
    const {relatedLocation, relatedUser, itemRef, itemRef2} = generateRefs();
    await createOrder(customId, relatedLocation, relatedUser, itemRef, itemRef2);
    const updateData = {orderStatus: 'ready'};
    const orderController = new OrderController();
    const result = await orderController.update(customId, updateData);
    const fetched = await orderController.getItemById(customId);
    assert.equal(result['modifiedCount'], 1);
    assert.equal(fetched['orderStatus'], updateData['orderStatus']);
  });

  // Delete Test
  it('should delete an existing order by id', async function() {
    const customId = mongoose.Types.ObjectId();
    const {relatedLocation, relatedUser, itemRef, itemRef2} = generateRefs();
    await createOrder(customId, relatedLocation, relatedUser, itemRef, itemRef2);
    const orderController = new OrderController();
    const delResult = await orderController.remove(customId);
    const items = await orderController.getItems();
    assert.equal(delResult, true);
    assert.equal(items.length, 0);
  });
});

afterEach(async function() {
  await Order.deleteMany({});
});