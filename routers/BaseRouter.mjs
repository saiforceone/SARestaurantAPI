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
  }

  constructResponse() {
    return {
      data: undefined,
      error: undefined,
      httpCode: 400,
      sucess: false,
    }
  }

  /**
   * @method getResource
   * @param {[function]} middleware 
   * @returns [function]
   * @description Retrieves a single resource based on the id given
   */
  getResource(middleware = []) {
    return [async (req, res) => {
      const response = this.constructResponse();
      try {
        const resourceId = req.params.id;
        
        if (!resourceId) {
          response.error = 'Invalid or no resource id';
          return res.status(response.httpCode).json(response);
        }

        response.data = await this.controller.getItemById(resourceId);
        response.httpCode = response.data ? 200 : 400;
        response.sucess = !!response.data;
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
    return [async (req, res) => {
      const response = this.constructResponse();
      try {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let ignorePaginationStr = req.query.ignorePagiation ? String(req.query.ignorePagiation).trim() : undefined;
        let query = req.query.filter ? String(req.query.filter).trim() : '';
        // todo: catch error and return appropriate error details when query fails to be parsed.
        query = JSON.parse(query);

        response.data = await this.controller.getItems(query);
        response.httpCode = response.data.length ? 200 : 404;
        response.sucess = response.data.length > 0;
        return res.status(response.httpCode).json(response);

      } catch (e) {
        response.error = e.toString();
        res.status(response.httpCode).json(response);
      }
    }];
  }



  getRoutes() {

    this.router.route(`${this.basePath}/:id`).get(this.getResource([]));
    this.router.route(`${this.basePath}`).get(this.getResources([]));
    return this.router;
  }
}

export default BaseRouter;