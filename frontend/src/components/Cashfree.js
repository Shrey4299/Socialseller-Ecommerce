import React, { useState } from "react";
import axios from "axios";

const CashfreeComponent = () => {
  const [planId, setPlanId] = useState("");

  const handleCheckout = async (returnUrl, paymentSessionId, orderId) => {
    try {
      console.log("enter in handle checkout frontend");
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
      const token = localStorage.getItem("jwt"); // Assuming you store the token in localStorage

      const response = await axios.post(
        "http://localhost:4500/api/subscriptions/checkoutCashfree",
        {
          plan_id: planId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Bearer token here
          },
        }
      );

      const { order_meta, payment_session_id, order_id } = response.data; // Destructure the response data

      console.log(JSON.stringify(response.data));
      console.log(order_meta);
      console.log(order_id + "this is order id");
      console.log(payment_session_id);
      handleCheckout(order_meta.returnUrl, payment_session_id, order_id); // Access nested property
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
            <label htmlFor="plan_id" className="block text-gray-700 font-bold">
              Plan ID:
            </label>
            <input
              type="text"
              id="plan_id"
              name="plan_id"
              value={planId}
              onChange={(e) => setPlanId(e.target.value)}
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
