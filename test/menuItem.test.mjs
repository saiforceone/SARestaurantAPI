import {assert} from 'chai';
import mongoose from 'mongoose';
import config from '../config/testing.mjs';
import MenuItemController from '../controllers/MenuItemController.mjs';
import MenuItem from '../models/MenuItem.mjs';
import menuItemMockData from '../mockData/menuItemMockData.mjs';

const createMenuItem = async function(customId = undefined) {

  const testData = menuItemMockData[0];
  const menuItemController = new MenuItemController();
  return await menuItemController.create(testData, customId);
};

const createMenuItems = async function() {
  const menuItemController = new MenuItemController();
  for(const data of menuItemMockData) {
    await menuItemController.create(data);
  }
};

beforeEach(async function() {
  // open connection to db
  await mongoose.connect(config.mongoURI);
});

describe('Menu Item Controller Functionality', function() {
  // Create Tests
  it('should create a menu item and use an auto _id', async function() {
    const testData = menuItemMockData[0];
    const result = await createMenuItem();
    assert.equal(testData['itemName'], result['itemName']);
  });

  it('should create a menu item with custom id', async function() {
    const customId = mongoose.Types.ObjectId();
    const result = await createMenuItem(customId);
    assert.equal(customId.str, result['_id'].str);
  });

  // Read Tests
  it('should retrieve a menu item by id', async function() {
    const customId = mongoose.Types.ObjectId();
    await createMenuItem(customId);
    const menuItemController = new MenuItemController();
    const result = await menuItemController.getItemById(customId);
    assert.equal(customId.str, result['_id'].str);
  });

  it('should retrieve a menu item using query object', async function() {
    const queryObj = {itemName: 'Item One'};
    await createMenuItem();
    const menuItemController = new MenuItemController();
    const result = await menuItemController.getItemByQuery(queryObj);
    assert.exists(result);
  });

  it('should retrieve a list of menu items', async function() {
    await createMenuItems();
    const menuItemController = new MenuItemController();
    const results = await menuItemController.getItems();
    assert.lengthOf(results, menuItemMockData.length);
  });

  // Update Test
  it('should update an existing menu item', async function() {
    const customId = mongoose.Types.ObjectId();
    await createMenuItem(customId);
    const updateData = {'itemName': 'New Item One', baseCost: 5.25};
    const menuItemController = new MenuItemController();
    const result = await menuItemController.update(customId, updateData);
    const fetched = await menuItemController.getItemById(customId);
    assert.equal(result['modifiedCount'], 1);
    assert.equal(fetched['itemName'], updateData['itemName']);
  });

  // Delete Test
  it('should delete an existing menu item by id', async function() {
    const customId = mongoose.Types.ObjectId();
    await createMenuItem(customId);
    const menuItemController = new MenuItemController();
    const delResult = await menuItemController.remove(customId);
    const items = await menuItemController.getItems();
    assert.equal(delResult, true);
    assert.equal(items.length, 0);
  });
});

afterEach(async function() {
  await MenuItem.deleteMany({});
});
