import React, { useState } from "react";
import axios from "axios";

const CashfreeComponent = () => {
  const [payment, setPayment] = useState("prepaid");
  const [userStoreId, setUserStoreId] = useState(1);
  const [variantId, setVariantId] = useState(3);
  const [quantity, setQuantity] = useState(1);

  const handleCheckout = async (returnUrl, paymentSessionId, orderId) => {
    try {
      console.log("Enter in handle checkout frontend");
      console.log(orderId);

      const cashfree = window.Cashfree({ mode: "sandbox" }); // Initialize Cashfree

      cashfree.checkout({
        paymentSessionId,
        returnUrl,
        redirectTarget: "_blank",
      });

      // After a successful payment, make a GET request to cashfreeVerify
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://narayan.localhost:4500/api/order/cashfreeCheckout",
        {
          payment,
          UserStoreId: userStoreId,
          VariantId: variantId,
          quantity,
        }
      );

      const { order_id, payment_session_id, order_meta } = response.data;

      console.log(JSON.stringify(response.data));
      console.log(order_id + "this is order id");
      console.log(payment_session_id);

      handleCheckout(order_meta.returnUrl, payment_session_id, order_id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Make Cashfree Payment
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="payment" className="block text-gray-700 font-bold">
              Payment Type:
            </label>
            <input
              type="text"
              id="payment"
              name="payment"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
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
          <div className="mb-4">
            <label
              htmlFor="variantId"
              className="block text-gray-700 font-bold"
            >
              Variant ID:
            </label>
            <input
              type="number"
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

export default CashfreeComponent;
