// Import necessary dependencies
import React, { useState } from "react";
import axios from "axios";

// Define the Subscription component
const Subscription = () => {
  const defaultPhoneNumber = "8085705849"; // Set your default phone number here

  const [payment, setPayment] = useState("prepaid");
  const [userStoreId, setUserStoreId] = useState(2);
  const [phoneNumber, setPhoneNumber] = useState(defaultPhoneNumber);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        "http://narayan.localhost:4500/api/orders/checkout/razorpay",
        {
          payment: payment,
          variantQuantities: [
            { VariantId: 3, quantity: 1 },
            { VariantId: 4, quantity: 1 },
          ],
          UserStoreId: userStoreId,
          AddressId: 2,
        },
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzAxNDk5NDI5LCJleHAiOjE3MDIxMDQyMjl9.XCIF7bnAAbHJb35M1FBtOINOlshxnZvAWafACBQjago",
          },
        }
      )
      .then((response) => {
        const order = response.data;

        const options = {
          key: "rzp_test_pqY2CKDdQMYzP5",
          amount: order.id,
          currency: "INR",
          name: "Your Company Name",
          description: "Product Purchase",
          image: "https://dummyimage.com/600x400/000/fff", // Placeholder image URL
          order_id: order.id,
          client: order.client,
          handler: function (response) {
            console.log(order.id);
            console.log(order.client + " this is client ");
            console.log(response.razorpay_payment_id);
            console.log(response.razorpay_signature);

            axios
              .post(
                "http://localhost:4500/api/subscriptions/orders/verify/razorpay",
                {
                  razorpay_order_id: order.id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  client: order.client,
                  totalAmount: order.totalAmount,
                },
                {
                  headers: {
                    Authorization:
                      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzAxNDk5NDI5LCJleHAiOjE3MDIxMDQyMjl9.XCIF7bnAAbHJb35M1FBtOINOlshxnZvAWafACBQjago",
                  },
                }
              )
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
            contact: phoneNumber, // Use the phone number from the state
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
      <div className="bg-white p-8 rounded shadow-lg  max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">Make a Payment</h1>
        <div className="mb-4">
          <img
            src="https://img.tatacliq.com/images/i8/437Wx649H/MP000000014710932_437Wx649H_202209301545141.jpeg"
            alt="Product"
            className="h-60 m-auto rounded mb-4"
          />
        </div>
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
          {/* User Store ID */}
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
              htmlFor="phoneNumber"
              className="block text-gray-700 font-bold"
            >
              Phone Number:
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
          {/* Submit Button */}
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
