// Import necessary dependencies
import React, { useState } from "react";
import axios from "axios";

// Define the Subscription component
const Subscription = () => {
  const [payment, setPayment] = useState("prepaid");
  const [variantId, setVariantId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [userStoreId, setUserStoreId] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://narayan.localhost:4500/api/order/checkout", {
        payment: payment,
        VariantId: variantId,
        quantity: quantity,
        UserStoreId: userStoreId,
      })
      .then((response) => {
        const order = response.data;
        console.log(JSON.stringify(response));

        const options = {
          key: "rzp_test_pqY2CKDdQMYzP5",
          amount: order.id,
          currency: "INR",
          name: "Your Company Name",
          description: "Product Purchase",
          image: "https://dummyimage.com/600x400/000/fff",
          order_id: order.id,
          client: order.client,
          handler: function (response) {
            // console.log(JSON.stringify(response) + "this is response");
            console.log(order.id);
            console.log(order.client + " this is client ");
            console.log(response.razorpay_payment_id);
            console.log(response.razorpay_signature);

            axios
              .post("http://localhost:4500/api/subscriptions/order/verify", {
                razorpay_order_id: order.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                client: order.client,
              })
              .then(function (response) {
                console.log(response);
                alert("Payment Succeeded");
              })
              .catch(function (error) {
                console.log(error);
                alert("Payment Verification Failed");
              });
          },
          prefill: {
            contact: "CUSTOMER_PHONE_NUMBER",
            name: "CUSTOMER_NAME",
            email: "CUSTOMER_EMAIL",
          },
          notes: {
            description: "Additional notes",
          },
          theme: {
            color: "#045B62",
          },
        };

        const razorpayObject = new window.Razorpay(options);
        razorpayObject.on("payment.failed", function (response) {
          alert("Payment Failed");
        });

        razorpayObject.open();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Make a Payment</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="payment" className="block text-gray-700 font-bold">
              Payment Method:
            </label>
            <select
              id="payment"
              name="payment"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            >
              <option value="prepaid">Prepaid</option>
              <option value="COD">Cash on Delivery</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="variantId"
              className="block text-gray-700 font-bold"
            >
              Variant ID:
            </label>
            <input
              type="text"
              id="variantId"
              name="variantId"
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-gray-700 font-bold">
              Quantity:
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="userStoreId"
              className="block text-gray-700 font-bold"
            >
              User Store ID:
            </label>
            <input
              type="number"
              id="userStoreId"
              name="userStoreId"
              value={userStoreId}
              onChange={(e) => setUserStoreId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Pay Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Subscription;
