
// src/api/post/postRoutes.js
const router = require('express').Router();
const support_ticketController = require('../controllers/support_ticket');
const { validateRequest, validateUpdateRequest } = require('../middlewares/support_ticket');

// Define routes for the "Post" resource
module.exports = (app) => {
    router.post('/', [validateRequest], support_ticketController.create);
    router.get('/', [validateUpdateRequest], support_ticketController.find);
    router.get('/:id', support_ticketController.findOne);
    router.put('/:id', [validateUpdateRequest], support_ticketController.update);
    router.put('/:id/:status', support_ticketController.changeStatus);
    router.delete('/:id', support_ticketController.delete);
    app.use('/api/support-tickets', router)
}
