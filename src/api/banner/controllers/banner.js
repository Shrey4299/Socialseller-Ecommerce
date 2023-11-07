// Controller function to create a new post
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.create = async (req, res) => {
    try {
        const sequelize = req.db;
        const getBanner = await sequelize.models.Banner.findAll();
        if (getBanner.length !== 0) {
            const updateBanner = await sequelize.models.Banner.update(req.body, {
                where: {
                    id: getBanner[0].id,
                },
                returning: true,
            });
            return res.status(200).send({ message: "Banner Updated Successfully!", data: updateBanner[1][0] })
        } else {
            const banner = await sequelize.models.Banner.create(req.body);
            return res.status(200).send({ message: "Banner Created Successfully!", data: banner })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to create a banner' });
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
        const banner = await sequelize.models.Banner.findOne({ include: "thumbnail" });
        return res.status(200).send(banner)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch banners' });
    }
};
