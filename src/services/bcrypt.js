const bcrypt = require("bcrypt")
const SALT_ROUNDS = process.env.SALT_ROUNDS
module.exports = {
    async hash(data) {
        try {
            const hash = bcrypt.hash(data, Number(SALT_ROUNDS))
            return hash
        } catch (error) {
            console.log(error)
            return { error }
        }
    },
    async compare(string, hashString) {
        try {
            const isMatched = await bcrypt.compare(string, hashString)
            console.log(isMatched)
            return isMatched

        } catch (error) {
            console.log(error)
            return { error }

        }
    }
}