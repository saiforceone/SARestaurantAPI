import express from 'express';
import mongoose from 'mongoose';
import config from './config/index.mjs';

import MenuItemController from './controllers/MenuItemController.mjs';

const app = express();

app.get('/', (req, res) => {
    res.json({
        message: 'default route',
        status: 'Ok'
    });
});

app.listen(config.serverPort, async () => {
    console.log(`API running on port: ${config.serverPort}`);
    try {
        await mongoose.connect(config.mongoURI);
        console.log(`Connected to database: ${config.mongoURI}`);
        // todo: remove test code
        const menuItemController = new MenuItemController();

        // const itemData = {
        //     itemName: 'Super Awesome Waffles',
        //     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
        //     baseCost: 3.50,
        //     mainImage: 'https://unsplash.com/photos/q4dawnCZJqs',
        //     averageRating: 4.5,
        // };

        // const savedItem = await menuItemController.create(itemData);

        const items = await menuItemController.getItems();
        console.log(items)
    } catch (e) {
        console.log('Restaurant core encountered an error: ', e.toString());
    }
});