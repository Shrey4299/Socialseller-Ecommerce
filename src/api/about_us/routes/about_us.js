
// src/api/post/postRoutes.js
const router = require('express').Router();
const RBAC = require('../../../middlewares/RBAC');
const about_usController = require('../controllers/about_us');
const { validateRequest } = require('../middlewares/about_us');

// Define routes for the "Post" resource
module.exports = (app) => {
    router.post('/', [RBAC, validateRequest], about_usController.create);
    router.get('/', [RBAC], about_usController.find);
    app.use('/api/about-us', router)
}
