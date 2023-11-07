const path = require('path')
const sharp = require('sharp');
const { getPagination, getMeta } = require('../../../services/pagination');

// Controller function to create a new post
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.create = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(500).send({ error: "Invalid File" })
        } else {
            const sequelize = req.db;
            // getting image info using sharp
            console.log(req.file.mimetype)
            // return res.status(200).send(req.file.mimetype)


            console.log("image case")
            const imageInfo = await sharp(req.file.path).metadata();
            const formatTypes = [
                {
                    name: "small",
                    width: 500,
                    height: 500,
                },
                {
                    name: "thumbnail",
                    width: 200,
                    height: 200,
                },
            ]
            // uploading main image 
            let formats = {}
            for (let index = 0; index < formatTypes.length; index++) {
                const element = formatTypes[index];
                const fileName = `${element.name}_${req.file.filename}`;
                const filePath = path.join('public/uploads', fileName);
                const file = await sharp(req.file.path).resize(element.width, element.height).toFile(filePath);
                const frmtsObject = {
                    name: element.name + "_" + req.file.filename,
                    url: filePath.split("\\").join("/"),
                    size: file.size / 1024,
                    width: element.width,
                    height: element.height,
                    type: element.name,
                }
                formats[element.name] = frmtsObject
            }
            mediaObject = {
                name: req.file.filename,
                path: "",
                url: req.file.path.split("\\").join('/'),
                size: req.file.size,
                width: imageInfo.width,
                height: imageInfo.height,
                formats: formats
            }


            const mediaEntity = await sequelize.models.Media.create(mediaObject);
            return res.status(200).send(mediaEntity)
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to create a upload' });
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
        const pagination = await getPagination(req.query.pagination)
        const files = await sequelize.models.Media.findAndCountAll({
            offset: pagination.offset,
            limit: pagination.limit,
        });
        const meta = await getMeta(pagination, files.count)
        return res.status(200).send({ data: files.rows, meta })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch uploads' });
    }
};
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
exports.findOne = async (req, res) => {
    try {
        const sequelize = req.db;
        const { id } = req.params
        const upload = await sequelize.models.Media.findByPk(id)
        if (upload) {
            return res.status(200).send(upload)
        } else {
            return res.status(400).send({ error: "Invalid Id" })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch upload' });
    }
};
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

exports.update = async (req, res) => {
    try {
        const sequelize = req.db;
        const { id } = req.params
        const upload = await sequelize.models.Media.findByPk(id)
        if (upload) {
            const update = await sequelize.models.Media.update(req.body)
            return res.status(200).send(update)
        } else {
            return res.status(400).send({ error: "Invalid User Id" })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: 'Failed to fetch upload' });
    }
};
/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */

exports.delete = async (req, res) => {
    try {
        const sequelize = req.db;
        const { id } = req.params
        const upload = await sequelize.models.Media.findByPk(id)
        if (upload) {
            const destroy = await sequelize.models.Media.destroy({ where: { id: id } })
            return res.status(200).send({ message: "File Deleted Successfully" })
        } else {
            return res.status(400).send({ error: "Invalid User Id" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to fetch upload' });
    }
};

