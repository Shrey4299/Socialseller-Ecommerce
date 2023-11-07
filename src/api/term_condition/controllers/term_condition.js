

// Controller function to create a new post
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.create = async (req, res) => {
    try {
        const sequelize = req.db;
        const getEntries = await sequelize.models.Term_condition.findAll();
        if (getEntries.length !== 0) {
            const updateTerm = await sequelize.models.Term_condition.update(req.body, {
                where: { id: getEntries[0].id },
                returning: true
            });
            return res.status(200).send({ message: "Terms and conditions updated", data: updateTerm[1][0] })
        }
        const createTerm = await sequelize.models.Term_condition.create(req.body);
        return res.status(200).send({ message: "Terms and Conditions created!", data: createTerm })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to create a term_condition' });
    }
};
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
// Controller function to get all posts
exports.find = async (req, res) => {
    try {
        const sequelize = req.db;
        const term_condition = await sequelize.models.Term_condition.findOne();
        return res.status(200).send(term_condition)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch term_conditions' });
    }
};
