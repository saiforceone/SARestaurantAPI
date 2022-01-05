import {assert} from 'chai';
import mongoose from 'mongoose';
import config from '../config/testing.mjs';
import UserProfileController from '../controllers/UserProfileController.mjs';
import UserProfile from '../models/UserProfile.mjs';
import userProfileMockData from '../mockData/userProfileMockData.mjs';

const createUserProfile = async function(customId = undefined) {

  const testData = userProfileMockData[0];
  const userProfileController = new UserProfileController();
  return await userProfileController.create(testData, customId);
};

const createUserProfiles = async function() {
  const userProfileController = new UserProfileController();
  for(const data of userProfileMockData) {
    await userProfileController.create(data);
  }
};

beforeEach(async function() {
  await mongoose.connect(config.mongoURI);
});

describe('User Profile tests', function() {
  it('should create a user profile using an auto _id', async function() {
    const testData = userProfileMockData[0];
    const result = await createUserProfile();
    assert.equal(testData['serviceName'], result['serviceName']);
  });

  it('should create a user profile using custom id', async function() {
    const customId = mongoose.Types.ObjectId();
    const result = await createUserProfile(customId);
    assert.equal(customId.str, result['_id'].str);
  });

  // Read Tests
  it('should retrieve a user profile by id', async function() {
    const customId = mongoose.Types.ObjectId();
    await createUserProfile(customId);
    const userProfileController = new UserProfileController();
    const result = await userProfileController.getItemById(customId);
    assert.equal(customId.str, result['_id'].str);
  });

  it('should retrieve a user profile using query object', async function() {
    const queryObj = {serviceName: 'local-test'};
    await createUserProfile();
    const userProfileController = new UserProfileController();
    const result = await userProfileController.getItemByQuery(queryObj);
    assert.exists(result);
  });

  it('should retrieve a list of user profiles', async function() {
    await createUserProfiles();
    const userProfileController = new UserProfileController();
    const results = await userProfileController.getItems();
    assert.lengthOf(results, userProfileMockData.length);
  });

  // Update Test
  it('should update an existing user profile', async function() {
    const customId = mongoose.Types.ObjectId();
    await createUserProfile(customId);
    const updateData = {serviceName: 'auth-facebook'};
    const userProfileController = new UserProfileController();
    const result = await userProfileController.update(customId, updateData);
    const fetched = await userProfileController.getItemById(customId);
    assert.equal(result['modifiedCount'], 1);
    assert.equal(fetched['serviceName'], updateData['serviceName']);
  });

  // Delete Test
  it('should delete an existing user profile by id', async function() {
    const customId = mongoose.Types.ObjectId();
    await createUserProfile(customId);
    const userProfileController = new UserProfileController();
    const delResult = await userProfileController.remove(customId);
    const items = await userProfileController.getItems();
    assert.equal(delResult, true);
    assert.equal(items.length, 0);
  });
});

afterEach(async function() {
  await UserProfile.deleteMany({});
});