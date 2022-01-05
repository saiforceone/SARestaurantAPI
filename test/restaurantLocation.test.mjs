import {assert} from 'chai';
import mongoose from 'mongoose';
import config from '../config/testing.mjs';
import RestaurantLocationController from '../controllers/RestaurantLocationController.mjs';
import RestaurantLocation from '../models/RestaurantLocation.mjs';
import restaurantLocationMockData from '../mockData/restaurantLocationMock.mjs'

const createRestaurantLocation = async function(customId = undefined) {

  const testData = restaurantLocationMockData[0];
  const restaurantLocationController = new RestaurantLocationController();
  return await restaurantLocationController.create(testData, customId);
};

const createRestaurantLocations = async function() {
  const restaurantLocationController = new RestaurantLocationController();
  for(const data of restaurantLocationMockData) {
    await restaurantLocationController.create(data);
  }
};

beforeEach(async function() {
  await mongoose.connect(config.mongoURI);
});

describe('Restaurant Location Tests', function() {
  it('should create a restaurant location using an auto _id', async function() {
    const testData = restaurantLocationMockData[0];
    const result = await createRestaurantLocation();
    assert.equal(testData['locationName'], result['locationName']);
  });

  it('should create a restaurant location using custom id', async function() {
    const customId = mongoose.Types.ObjectId();
    const result = await createRestaurantLocation(customId);
    assert.equal(customId.str, result['_id'].str);
  });

  // Read Tests
  it('should retrieve a menu item by id', async function() {
    const customId = mongoose.Types.ObjectId();
    await createRestaurantLocation(customId);
    const restaurantLocationController = new RestaurantLocationController();
    const result = await restaurantLocationController.getItemById(customId);
    assert.equal(customId.str, result['_id'].str);
  });

  it('should retrieve a menu item using query object', async function() {
    const queryObj = {locationName: 'Restaurant One'};
    await createRestaurantLocation();
    const restaurantLocationController = new RestaurantLocationController();
    const result = await restaurantLocationController.getItemByQuery(queryObj);
    assert.exists(result);
  });

  it('should retrieve a list of menu items', async function() {
    await createRestaurantLocations();
    const restaurantLocationController = new RestaurantLocationController();
    const results = await restaurantLocationController.getItems();
    assert.lengthOf(results, restaurantLocationMockData.length);
  });

  // Update Test
  it('should update an existing menu item', async function() {
    const customId = mongoose.Types.ObjectId();
    await createRestaurantLocation(customId);
    const updateData = {locationName: 'New Restaurant One', servicesAvailable: ['Free Wifi', 'Happy Hour']};
    const restaurantLocationController = new RestaurantLocationController();
    const result = await restaurantLocationController.update(customId, updateData);
    const fetched = await restaurantLocationController.getItemById(customId);
    assert.equal(result['modifiedCount'], 1);
    assert.equal(fetched['locationName'], updateData['locationName']);
  });

  // Delete Test
  it('should delete an existing menu item by id', async function() {
    const customId = mongoose.Types.ObjectId();
    await createRestaurantLocation(customId);
    const restaurantLocationController = new RestaurantLocationController();
    const delResult = await restaurantLocationController.remove(customId);
    const items = await restaurantLocationController.getItems();
    assert.equal(delResult, true);
    assert.equal(items.length, 0);
  });
});

afterEach(async function() {
  await RestaurantLocation.deleteMany({});
  // await mongoose.connection.close();
});