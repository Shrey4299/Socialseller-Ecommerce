
// src/api/post/postRoutes.js
const router = require('express').Router();
const contact_usController = require('../controllers/contact_us');

// Define routes for the "Post" resource
module.exports = (app) => {
    router.post('/', contact_usController.create);
    router.get('/', contact_usController.find);
    router.get('/:id', contact_usController.findOne);
    router.put('/:id', contact_usController.update);
    router.delete('/:id', contact_usController.delete);
    app.use('/api/contact-us', router)
}
