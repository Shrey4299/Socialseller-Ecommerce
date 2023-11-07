module.exports = async (req) => {
  const sequelize = req.db;
  const body = req.body;
  const cashfreeWebhook = {
    upi: {
      data: body.data,
      event_time: body.event_time,
      type: body.type,
    },
    card: {
      data: body.data,
      event_time: body.event_time,
      type: body.type,
    },
    netbanking: {
      data: body.data,
      event_time: body.event_time,
      type: body.type,
    },
    wallet: {
      data: body.data,
      event_time: body.event_time,
      type: body.type,
    },
  };

  const { upi, netbanking, card, wallet } = cashfreeWebhook;

  const global = await sequelize.models.Global.findOne();
  const gateway = global.PAYMENT_GATEWAY;
  console.log(gateway + " this is the gateway");
  let payObject;

  switch (gateway) {
    case "CASHFREE":
      const paymentMethod = Object.keys(
        req.body.data.payment.payment_method
      )[0];
      console.log(paymentMethod + " this is the payment method");

      switch (paymentMethod) {
        case "upi":
          payObject = {
            order_id: upi.data.order.order_id,
            payment_id: upi.data.payment.cf_payment_id,
            amount: upi.data.payment.payment_amount,
            currency: upi.data.order.order_currency,
            status: upi.data.payment.payment_status,
            method: "upi",
            card_id: null,
            card: null,
            bank: null,
            wallet: null,
            vpa: upi.data.payment.payment_method.upi.upi_id,
            email: upi.data.customer_details.customer_email, // Add customer email if available
            contact: upi.data.customer_details.customer_phone,
            notes: "upi details",
            captured: "true",
          };
          break;

        case "card":
          payObject = {
            order_id: card.data.order.order_id,
            payment_id: card.data.payment.cf_payment_id,
            amount: card.data.payment.payment_amount,
            currency: card.data.order.order_currency,
            status: card.data.payment.payment_status,
            method: "card",
            card_id: null, // Add card ID if available
            card: card.data.payment.payment_method.card.card_type,
            last4: card.data.payment.payment_method.card.card_number.slice(-4),
            network: card.data.payment.payment_method.card.card_network,
            bank: card.data.payment.payment_method.card.card_bank_name,
            wallet: null,
            vpa: null,
            email: card.data.customer_details.customer_email, // Add customer email if available
            contact: card.data.customer_details.customer_phone,
            notes: "card details",
            captured: "true",
          };
          break;

        case "netbanking":
          payObject = {
            order_id: netbanking.data.order.order_id,
            payment_id: netbanking.data.payment.cf_payment_id,
            amount: netbanking.data.payment.payment_amount,
            currency: netbanking.data.order.order_currency,
            status: netbanking.data.payment.payment_status,
            method: "netbanking",
            card_id: null,
            card: null,
            last4: null,
            network: null,
            bank: netbanking.data.payment.payment_method.netbanking
              .netbanking_bank_name,
            wallet: null,
            vpa: null,
            email: netbanking.data.customer_details.customer_email, // Add customer email if available
            contact: netbanking.data.customer_details.customer_phone,
            notes: "netbaking details",
            captured: "true",
          };
          break;

        case "app":
          payObject = {
            order_id: wallet.data.order.order_id,
            payment_id: wallet.data.payment.cf_payment_id,
            amount: wallet.data.payment.payment_amount,
            currency: wallet.data.order.order_currency,
            status: wallet.data.payment.payment_status,
            method: "wallet",
            card_id: null,
            card: null,
            last4: null,
            network: null,
            bank: null,
            wallet: wallet.data.payment.payment_method.app.provider,
            vpa: null,
            email: wallet.data.customer_details.customer_email,
            contact: wallet.data.customer_details.customer_phone,
            notes: "wallet details",
            captured: "true",
          };
          break;

        default:
          break;
      }

      return payObject;
  }
};
