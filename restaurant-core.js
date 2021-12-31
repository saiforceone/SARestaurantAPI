const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.json({
        message: 'default route',
        status: 'Ok'
    });
});

app.listen(4001, () => {
    console.log('API running on port: 4001');
});