
// src/api/post/postRoutes.js
const router = require('express').Router();
const payment_logController = require('../controllers/payment_log');

// Define routes for the "Post" resource
module.exports = (app) => {
    router.post('/', payment_logController.create);
    router.get('/', payment_logController.find);
    router.get('/:id', payment_logController.findOne);
    router.put('/:id', payment_logController.update);
    router.delete('/:id', payment_logController.delete);
    app.use('/api/payment_logs', router)
}
