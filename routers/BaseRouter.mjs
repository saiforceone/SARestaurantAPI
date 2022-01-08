import express, {Router} from 'express';

/**
 * @class BaseRouter
 * @description Defines a base router that can be extended
 */
class BaseRouter {

  constructor(basePath = '/', controller) {
    this.basePath = basePath;
    this.controller = this.controller;
    this.router = Router();
    console.log(`${this.constructor.name}: router intialized`);
  }

  constructResponse() {
    return {
      data: undefined,
      error: undefined,
      httpCode: 400,
      success: false,
    }
  }

  /**
   * @method createResource
   * @param {[function]} middleware 
   * @returns [function]
   * @description Creates a resource based on data supplied via the request body
   */
  createResource(middleware = []) {
    return [async (req, res) => {
      const response = this.constructResponse();
      try {
        const {data} = req.body;

        response.data = await this.controller.create(data);
        response.httpCode = response.data ? 201 : 400;
        response.success = !!response.data;
        return res.status(response.httpCode).json(response);
      }catch(e) {
        response.error = e.toString();
        return res.status(response.httpCode).json(response);
      }
    }];
  }

  /**
   * @method getResource
   * @param {[function]} middleware 
   * @returns [function]
   * @description Retrieves a single resource based on the id given
   */
  getResource(middleware = []) {
    return [...middleware, async (req, res) => {
      const response = this.constructResponse();
      try {
        const resourceId = req.params.id;
        
        if (!resourceId) {
          response.error = 'Invalid or no resource id';
          return res.status(response.httpCode).json(response);
        }

        response.data = await this.controller.getItemById(resourceId);
        response.httpCode = response.data ? 200 : 400;
        response.success = !!response.data;
        return res.status(response.httpCode).json(response);
      } catch (e) {
        response.error = e.toString();
        res.status(response.httpCode).json(response);
      }
    }];
  }

  /**
   * @method getResources
   * @param {[function]} middleware 
   * @returns [function]
   * @description Retrieves a list of resources based on query params
   */
  getResources(middleware = []) {
    return [...middleware, async (req, res) => {
      const response = this.constructResponse();
      try {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let ignorePaginationStr = req.query.ignorePagiation ? String(req.query.ignorePagiation).trim() : undefined;
        let query = req.query.filter ? String(req.query.filter).trim() : '{}';
        // todo: catch error and return appropriate error details when query fails to be parsed.
        query = JSON.parse(query);

        response.data = await this.controller.getItems(query);
        response.httpCode = response.data.length ? 200 : 404;
        response.success = response.data.length > 0;
        return res.status(response.httpCode).json(response);

      } catch (e) {
        response.error = e.toString();
        res.status(response.httpCode).json(response);
      }
    }];
  }

  /**
   * @method updateResource
   * @param {[function]} middleware 
   * @returns 
   * @description Performs an update to an existing resource given an id and data
   */
  updateResource(middleware = []) {
    return [async (req, res) => {
      const response = this.constructResponse();
      try {

        const {data} = req.body;
        const resourceId = req.params.id;

        const result = await this.controller.update(resourceId, data);
        response.success = result['modifiedCount'] > 0;
        response.httpCode = response.success ? 200 : 400;
        return res.status(response.httpCode).json(response);
      } catch (e) {
        response.error = e.toString();
        response.httpCode = 500;
        res.status(response.httpCode).json(response);
      }
    }];
  }

  /**
   * @method deleteResource
   * @param {[function]} middleware 
   * @returns [function]
   * @description Deletes a resource given a resource id
   */
  deleteResource(middleware = []) {
    return [async (req, res) => {
      const response = this.constructResponse();
      try {
        const resourceId = req.params.id;
        response.success = await this.controller.remove(resourceId);
        response.httpCode = response.success ? 200 : 400;
        return res.status(response.httpCode).json(response);
      } catch (e) {
        response.error = e.toString();
        response.httpCode = 500;
        res.status(response.httpCode).json(response);
      }
    }];
  }

  getRoutes() {

    this.router.route(`${this.basePath}/:id`)
      .get(this.getResource([]))
      .put(this.updateResource([]))
      .delete(this.deleteResource([]));
    
    this.router.route(`${this.basePath}`)
      .get(this.getResources([]))
      .post(this.createResource([]));
    return this.router;
  }
}

export default BaseRouter;