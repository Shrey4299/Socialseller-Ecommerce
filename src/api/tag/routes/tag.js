
// src/api/post/postRoutes.js
const router = require('express').Router();
const RBAC = require('../../../middlewares/RBAC');
const tagController = require('../controllers/tag');

// Define routes for the "Post" resource
module.exports = (app) => {
    router.post('/', tagController.create);
    router.get('/', tagController.find);
    router.get('/search', tagController.search);
    router.get('/:id', [RBAC], tagController.findOne);
    router.put('/:id', tagController.update);
    router.delete('/:id', tagController.delete);
    app.use('/api/tags', router)
}
