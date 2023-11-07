const { requestError, tokenError } = require("../../../services/errors")
const jwt = require("../../../services/jwt")

module.exports = async (req, res, next) => {
    try {
        const token = jwt.verify(req)
        const tokenId = token.id
        const paramsId = req.params.id
        if (token.error) return tokenError(token)
        if (tokenId !== paramsId) {
            return res.status(404).send(requestError({ message: "Token ID and params ID did not matched!" }))
        }
        await next()
    } catch (error) {
        console.log(error)
        return res.status(500).send(error)
    }
}