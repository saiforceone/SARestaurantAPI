/**
 * @class BaseController
 * @description Defines a controller that abstracts database interactions
 */
class BaseController {
  /**
   * @constructor
   * @param {*} model
   */
  constructor(model) {
    this.model = model;
    console.log(`${this.constructor.name}: controller initialized`)
  }

  // Helpers

  /**
   * @method getValidFields
   * @returns [String]
   * @description Helper function that removes default fields so that the create method will work correctly
   */
  getValidFields() {
    if (!this.model) return [];

    let fields = Object.assign({}, this.model.schema.paths);

    delete fields._id;
    delete fields.__v;

    return Object.keys(fields);
  }

  // Create

  /**
   * @method create
   * @param {Object} data 
   * @param {String} id - override mongo's default id
   * @returns Object | undefined
   * @description base functionality to create a resource
   */
  async create(data, id = undefined) {
    try {
      const modelData = {};

      this.getValidFields().forEach((k) => {
        if (k.split(".").length === 2) {
          const keyParts = k.split(".");

          if (!modelData[keyParts[0]]) {
            modelData[keyParts[0]] = {};
          }

          const subDocument = {};
          Object.defineProperty(subDocument, keyParts[1], {
            value: data[k],
          });

          modelData[keyParts[0]][keyParts[1]] = data[k];
        } else {
          modelData[k] = data[k];
        }
      });
      
      delete modelData._id;
      delete modelData.__v;

      if (id) modelData['_id'] = id;

      return await this.model.create(modelData);
    } catch (e) {
      console.log(`create error: ${e.toString()}`);
      return;
    }
  }

  // Read

  /**
   * @method getItemById
   * @param {String} resourceId 
   * @returns Object | undefined
   * @description Gets a resource given a resource id / object id
   */
  async getItemById(resourceId) {
    try {
      return await this.model.findById(resourceId).exec();
    } catch (e) {
      console.log(`getItemById error: ${e.toString()}`);
      return undefined;
    }
  }


  /**
   * @method getItemByQuery
   * @param {Object} queryObject 
   * @returns Object | undefined
   * @description Gets a resource given a query object
   */
  async getItemByQuery(queryObject) {
    try {
      return await this.model.findOne(queryObject);
    } catch (e) {
      console.log(`getItemByQuery error: ${e.toString()}`);
      return undefined;
    }
  }

  /**
   * @method getItems
   * @param {Object} queryObject 
   * @param {Number} page 
   * @param {Number} limit 
   * @param {Boolean} ignorePagination 
   * @param {[String]} sortOptions 
   * @returns [Objects]
   * @description gets a list of resources that match the given query
   */
  async getItems(queryObject = {}, page = 0, limit = 10, ignorePagination = false, sortOptions = []) {
    try {
      return ignorePagination ? await this.model.find(queryObject) : await this.model.find(queryObject).sort(sortOptions).skip(page * limit);
    } catch (e) {
      console.log(`getItems error: ${e.toString()}`);
      return [];
    }
  }

  // Update

  /**
   * @method update
   * @param {String} resourceId 
   * @param {Object} data 
   * @description Updates a resource given a resource id and a data object and returns the result of the update, not the updated document
   */
  async update(resourceId, data) {
    try {
      return await this.model.updateOne({_id: resourceId}, data);
    } catch (e) {
      console.log(`update error: ${e.toString()}`);
      return;
    }
  }

  // Delete

  /**
   * @method remove
   * @param {String} resourceId 
   * @returns Boolean
   * @description Remove a resource given a resource id
   */
  async remove(resourceId) {
    try {
      await this.model.deleteOne({_id: resourceId});
      return true;
    } catch (e) {
      console.log(`remove error: ${e.toString()}`);
      return false;
    }
  }
}

export default BaseController;
