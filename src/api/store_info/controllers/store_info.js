/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.create = async (req, res) => {
    try {
        const sequelize = req.db;
        const getStoreInfo = await sequelize.models.Store_info.findAll();
        if (getStoreInfo.length !== 0) {
            const updateStore = await sequelize.models.Store_info.update(req.body, {
                where: { id: getStoreInfo[0].id },
                returning: true
            })
            return res.status(200).send({ message: "Store info updated successfully!", data: updateStore[1][0] })
        } else {
            const createStore = await sequelize.models.Store_info.create(req.body)
            return res.status(200).send({ message: "Store info created successfully!", data: createStore })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to create a store_info' });
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
        const store_infos = await sequelize.models.Store_info.findOne({ include: ["logo", "banner"] });
        return res.status(200).send(store_infos)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch store_infos' });
    }
};


