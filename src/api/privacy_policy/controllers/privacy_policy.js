/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.create = async (req, res) => {
    try {

        const sequelize = req.db;
        const getRows = await sequelize.models.Privacy_policy.findAll();
        if (getRows.length !== 0) {
            const updatePP = await sequelize.models.Privacy_policy.update(req.body, { where: { id: getRows[0].id }, returning: true });
            return res.status(200).send({ message: "Privay Policy Updated!", data: updatePP[1][0] })
        }
        const createPP = await sequelize.models.Privacy_policy.create(req.body);
        return res.status(200).send({ message: "Privacy Policy Created !", data: createPP })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to create a privacy_policy' });
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
        const getPP = await sequelize.models.Privacy_policy.findOne();
        return res.status(200).send(getPP)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch privacy_policys' });
    }
};


