const express = require("express");
const db = require('../../modules/connectDb');
const router = express.Router();

router.get('/', async (request, response) => {
    const categories = await db('CategoriesRestaurant').select('*')
    response.status(200).json(categories);
});

module.exports = router;