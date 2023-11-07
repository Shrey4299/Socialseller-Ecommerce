

// Controller function to create a new post
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.create = async (req, res) => {
    try {

        const sequelize = req.db;
        const getEntries = await sequelize.models.Return_cancel.findAll();
        if (getEntries.length !== 0) {
            const updateRC = await sequelize.models.Return_cancel.update(req.body, {
                where: { id: getEntries[0].id },
                returning: true
            });
            return res.status(200).send({ message: "Return and Cancel Updated!", data: updateRC })
        }
        const createRC = await sequelize.models.createRC.create(req.body);
        return res.status(200).send({ message: "Return and cancel created!", data: createRC })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to create a return_cancel' });
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
        const return_cancel = await sequelize.models.Return_cancel.findOne();
        return res.status(200).send(return_cancel)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch return_cancels' });
    }
};
