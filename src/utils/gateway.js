const Rpay = require('razorpay');

const razorpay = new Rpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

module.exports = {
    razorpay
}