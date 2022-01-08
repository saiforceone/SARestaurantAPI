import {
  MenuItemRouter,
  OrderRouter,
  RestaurantLocationRouter,
  UserProfileRouter,
} from '../routers/index.mjs';

export default (app) => {
  console.log('Init api routes...');
  app.get('/', (req, res) => {
    res.json({
        message: 'default route',
        status: 'Ok'
    });
  });
  app.use('', new MenuItemRouter().getRoutes());
  app.use('', new OrderRouter().getRoutes());
  app.use('', new RestaurantLocationRouter().getRoutes()),
  app.use('', new UserProfileRouter().getRoutes());
  app.get('*', (req, res) => {
    res.json({
      message: 'Invalid route',
      status: 'ok'
    });
  });
};