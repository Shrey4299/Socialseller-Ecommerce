
// src/api/post/postRoutes.js
const router = require('express').Router();
const bannerController = require('../controllers/banner');

// Define routes for the "Post" resource
module.exports = (app) => {
    router.post('/', bannerController.create);
    router.get('/', bannerController.find);
    app.use('/api/banner', router)
}
