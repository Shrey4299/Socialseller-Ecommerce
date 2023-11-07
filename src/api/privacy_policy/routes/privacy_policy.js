
// src/api/post/postRoutes.js
const router = require('express').Router();
const RBAC = require('../../../middlewares/RBAC');
const privacy_policyController = require('../controllers/privacy_policy');
const { validateRequest } = require('../middlewares/privacy_policy');

// Define routes for the "Post" resource
module.exports = (app) => {
    router.post('/', [RBAC, validateRequest], privacy_policyController.create);
    router.get('/', [RBAC], privacy_policyController.find);
    app.use('/api/privacy-policy', router)
}
