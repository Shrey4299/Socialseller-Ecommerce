
    // src/api/post/postRoutes.js
    const router = require('express').Router();
    const return_cancelController = require('../controllers/return_cancel');
    
    // Define routes for the "Post" resource
    module.exports = (app) => {
        router.post('/', return_cancelController.create);
        router.get('/', return_cancelController.find);
        router.get('/:id', return_cancelController.findOne);
        router.put('/:id', return_cancelController.update);
        router.delete('/:id', return_cancelController.delete);
        app.use('/api/return_cancels', router)
    }
 