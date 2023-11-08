const Joi = require('joi');
const { requestError } = require('../../../services/errors');
module.exports = {
    async createBody(req, res, next) {
        try {
            function validate(body) {
                const JoiSchema = Joi.object({
                    "username": Joi.string().required(),
                    "password": Joi.string().optional(),
                    "email": Joi.string().optional(),
                    "subdomain": Joi.string().required(),
                });
                return JoiSchema.validate(body);
            }
            let result = validate(req.body);
            if (result.error) {
                return res.status(400).send(requestError({ message: result.error.message, details: result.error.details }));
            } else {
                await next(); // Corrected the square brackets to curly braces
            }

        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    },

    // function to validate body for admin registration
    async createAdminBody(req, res, next) {
        try {
            function validate(body) {
                const JoiSchema = Joi.object({
                    "username": Joi.string().required(),
                    "password": Joi.string().required(),
                    "email": Joi.string().required(),

                });

                return JoiSchema.validate(body);
            }

            let result = validate(req.body);
            if (result.error) {
                return res.status(400).send(requestError({ message: result.error.message, details: result.error.details }));
            } else {
                await next(); // Corrected the square brackets to curly braces
            }

        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    },

    // function to update user

    async updateBody(req, res, next) {
        try {
            function validate(body) {
                const JoiSchema = Joi.object({
                    "password": Joi.string().optional(),
                    "email": Joi.string().optional(),
                });

                return JoiSchema.validate(body);
            }

            let result = validate(req.body);
            if (result.error) {
                return res.status(400).send(requestError({ message: result.error.message, details: result.error.details }));
            } else {
                await next(); // Corrected the square brackets to curly braces
            }

        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    },

    //  function to validate user & admin login 
    async validateLoginBody(req, res, next) {
        try {
            const validateBody = (body) => {
                const JoiSchema = Joi.object({
                    "email": Joi.string().required().min(4),
                    "password": Joi.string().required().min(5)
                })
                return JoiSchema.validate(body)
            }
            let result = validateBody(req.body)
            if (result.error) {
                return res.status(400).send(requestError({ message: result.error.message, details: result.error.details }));
            }
            return await next()
        } catch (error) {
            console.log(error)
            return res.status(500).send(error)
        }
    }
}