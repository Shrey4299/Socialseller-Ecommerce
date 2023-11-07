module.exports = {
    tokenError(token) {
        return {
            error: {
                status: 401,
                name: "Unauthorized!",
                message: token.error.message,
                details: token.error.name
            }
        }
    },
    requestError({ status = 400, name = "Bad Request!", message = "Invalid Data", details = "" }) {
        return {
            error: {
                status: status,
                name: name,
                message: message,
                details: details
            }
        }
    }
}