module.exports = async (req) => {
  const sequelize = req.db;
  // const body = req.body;
  const webhook = {
    upi: {
      entity: "event",
      account_id: "acc_EqZnZU1YDmNcj0",
      event: "payment.authorized",
      contains: ["payment"],
      payload: {
        payment: {
          entity: {
            id: "pay_MnfA52qn6Od4xV",
            entity: "payment",
            amount: 20298,
            currency: "INR",
            status: "authorized",
            order_id: "order_Mnf9sW41LCjkKz",
            invoice_id: null,
            international: false,
            method: "upi",
            amount_refunded: 0,
            refund_status: null,
            captured: false,
            description: "This is test Transactions",
            card_id: null,
            bank: null,
            wallet: null,
            vpa: "success@razorpay",
            email: "void@razorpay.com",
            contact: "+918349988146",
            notes: [],
            fee: null,
            tax: null,
            error_code: null,
            error_description: null,
            error_source: null,
            error_step: null,
            error_reason: null,
            acquirer_data: {
              rrn: "246341892219",
              upi_transaction_id: "A3DC7F90964B956988F5D13E94B20365",
            },
            created_at: 1697193928,
            upi: {
              vpa: "success@razorpay",
            },
          },
        },
      },
      created_at: 1697193928,
    },
    card: {
      entity: "event",
      account_id: "acc_EqZnZU1YDmNcj0",
      event: "payment.captured",
      contains: ["payment"],
      payload: {
        payment: {
          entity: {
            id: "pay_MnfXoaGGnc5yaJ",
            entity: "payment",
            amount: 20298,
            currency: "INR",
            status: "captured",
            order_id: "order_MnfXBGBARtaJMU",
            invoice_id: null,
            international: false,
            method: "card",
            amount_refunded: 0,
            refund_status: null,
            captured: true,
            description: "This is test Transactions",
            card_id: "card_MnfXodJe5Q2MIY",
            card: {
              id: "card_MnfXodJe5Q2MIY",
              entity: "card",
              name: "",
              last4: "1111",
              network: "Visa",
              type: "debit",
              issuer: null,
              international: false,
              emi: false,
              sub_type: "consumer",
              token_iin: null,
            },
            bank: null,
            wallet: null,
            vpa: null,
            email: "void@razorpay.com",
            contact: "+918349988146",
            notes: [],
            fee: 406,
            tax: 0,
            error_code: null,
            error_description: null,
            error_source: null,
            error_step: null,
            error_reason: null,
            acquirer_data: {
              auth_code: "340454",
            },
            created_at: 1697195276,
            base_amount: 20298,
          },
        },
      },
      created_at: 1697195298,
    },
    netbanking: {
      entity: "event",
      account_id: "acc_EqZnZU1YDmNcj0",
      event: "payment.captured",
      contains: ["payment"],
      payload: {
        payment: {
          entity: {
            id: "pay_Mng0jNmJjug68T",
            entity: "payment",
            amount: 20298,
            currency: "INR",
            status: "captured",
            order_id: "order_Mng0TPspPLJ9Lt",
            invoice_id: null,
            international: false,
            method: "netbanking",
            amount_refunded: 0,
            refund_status: null,
            captured: true,
            description: "This is test Transactions",
            card_id: null,
            bank: "HDFC",
            wallet: null,
            vpa: null,
            email: "void@razorpay.com",
            contact: "+918349988146",
            notes: [],
            fee: 480,
            tax: 74,
            error_code: null,
            error_description: null,
            error_source: null,
            error_step: null,
            error_reason: null,
            acquirer_data: {
              bank_transaction_id: "5064956",
            },
            created_at: 1697196918,
            base_amount: 20298,
          },
        },
      },
      created_at: 1697196922,
    },
    wallet: {
      entity: "event",
      account_id: "acc_EqZnZU1YDmNcj0",
      event: "payment.captured",
      contains: ["payment"],
      payload: {
        payment: {
          entity: {
            id: "pay_Mng2IqTQuvgIZ8",
            entity: "payment",
            amount: 20298,
            currency: "INR",
            status: "captured",
            order_id: "order_Mng23S5rfeQvfT",
            invoice_id: null,
            international: false,
            method: "wallet",
            amount_refunded: 0,
            refund_status: null,
            captured: true,
            description: "This is test Transactions",
            card_id: null,
            bank: null,
            wallet: "airtelmoney",
            vpa: null,
            email: "void@razorpay.com",
            contact: "+918349988146",
            notes: [],
            fee: 480,
            tax: 74,
            error_code: null,
            error_description: null,
            error_source: null,
            error_step: null,
            error_reason: null,
            acquirer_data: {
              transaction_id: null,
            },
            created_at: 1697197008,
            base_amount: 20298,
          },
        },
      },
      created_at: 1697197010,
    },
  };

  const { upi, netbanking, card, wallet } = webhook;

  const global = await sequelize.models.Global.findOne();
  const gateway = "RAZORPAY";
  let payObject;

  switch (gateway) {
    case "RAZORPAY":
      let method = req.body.payload.payment.entity.method;
      const payload = req.body.payload;
      switch (method) {
        case "upi":
          payObject = {
            order_id: payload.payment.entity.order_id,
            payment_id: payload.payment.entity.id,
            amount: payload.payment.entity.amount,
            amount_refunded: payload.payment.entity.amount_refunded,
            currency: payload.payment.entity.currency,
            status: payload.payment.entity.status,
            method: payload.payment.entity.method,
            card_id: payload.payment.entity.card_id,
            card: null,
            bank: null,
            wallet: null,
            vpa: payload.payment.entity.vpa,
            email: payload.payment.entity.email,
            contact: payload.payment.entity.contact,
            notes: payload.payment.entity.contact,
          };
          break;
        case "card":
          payObject = {
            order_id: payload.payment.entity.order_id,
            payment_id: payload.payment.entity.id,
            amount: payload.payment.entity.amount,
            amount_refunded: payload.payment.entity.amount_refunded,
            currency: payload.payment.entity.currency,
            status: payload.payment.entity.status,
            method: payload.payment.entity.method,
            card_id: payload.payment.entity.card_id,
            card: payload.payment.entity.card.type,
            last4: payload.payment.entity.card.last4,
            network: payload.payment.entity.card.network,
            bank: null,
            wallet: null,
            vpa: payload.payment.entity.vpa,
            email: payload.payment.entity.email,
            contact: payload.payment.entity.contact,
            notes: payload.payment.entity.contact,
          };
          break;
        case "netbanking":
          payObject = {
            order_id: payload.payment.entity.order_id,
            payment_id: payload.payment.entity.id,
            amount: payload.payment.entity.amount,
            amount_refunded: payload.payment.entity.amount_refunded,
            currency: payload.payment.entity.currency,
            status: payload.payment.entity.status,
            method: payload.payment.entity.method,
            card_id: payload.payment.entity.card_id,
            card: null,
            last4: null,
            network: null,
            bank: payload.payment.entity.bank,
            wallet: null,
            vpa: payload.payment.entity.vpa,
            email: payload.payment.entity.email,
            contact: payload.payment.entity.contact,
            notes: payload.payment.entity.contact,
          };
          break;
        case "wallet":
          payObject = {
            order_id: payload.payment.entity.order_id,
            payment_id: payload.payment.entity.id,
            amount: payload.payment.entity.amount,
            amount_refunded: payload.payment.entity.amount_refunded,
            currency: payload.payment.entity.currency,
            status: payload.payment.entity.status,
            method: payload.payment.entity.method,
            card_id: payload.payment.entity.card_id,
            card: null,
            last4: null,
            network: null,
            bank: null,
            wallet: null,
            vpa: payload.payment.entity.vpa,
            email: payload.payment.entity.email,
            contact: payload.payment.entity.contact,
            notes: payload.payment.entity.contact,
          };
          break;

        default:
          break;
      }

      break;

    case "PHONEPE":
      break;

    case "CASH_FREE":
      break;

    default:
      break;
  }
  return payObject;
};
