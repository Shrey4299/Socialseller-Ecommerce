
// src/api/post/postRoutes.js
const router = require('express').Router();
const RBAC = require('../../../middlewares/RBAC');
const store_infoController = require('../controllers/store_info');
const { validateRequest, validateUpdateRequest } = require('../middlewares/store_info');

// Define routes for the "Post" resource
module.exports = (app) => {
    router.post('/', [validateRequest], store_infoController.create);
    router.get('/', [RBAC], store_infoController.find);
    app.use('/api/store-info', router)
}
