
// src/api/post/postRoutes.js
const router = require('express').Router();
const RBAC = require('../../../middlewares/RBAC');
const permissionController = require('../controllers/permission');
const { validateRequest } = require('../middlewares/permission');

// Define routes for the "Post" resource
module.exports = (app) => {
    router.post('/', [validateRequest], permissionController.create);
    router.get('/', permissionController.find);
    router.get('/:id', permissionController.findOne);
    router.put('/:id', permissionController.update);
    router.delete('/:id', permissionController.delete);
    router.get('/bulk/generate', permissionController.generateLists);
    app.use('/api/permissions', router)
}
