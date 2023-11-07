
// src/api/post/postRoutes.js
const router = require('express').Router();
const RBAC = require('../../../middlewares/RBAC');
const term_conditionController = require('../controllers/term_condition');
const { validateRequest } = require('../middlewares/term_condition');

// Define routes for the "Post" resource
module.exports = (app) => {
    router.post('/', [RBAC, validateRequest], term_conditionController.create);
    router.get('/', [RBAC], term_conditionController.find);
    app.use('/api/terms', router)
}
