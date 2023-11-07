module.exports = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        // Handle JSON parsing error
        console.error(err.stack);
        return res.status(400).json({
            error: {
                status: 400,
                message: "Invalid JSON",
                details: "Invalid JSON data sent on request BODY!"
            }
        });
    }
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
}
