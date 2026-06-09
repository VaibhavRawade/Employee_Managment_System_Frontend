import React, { useState } from "react";
import axios from "axios";

const PaymentPage = () => {

    const [amount, setAmount] = useState("");
    
  const payNow = async () => {

    try {

      const response = await axios.post(
  `http://localhost:8082/api/payment/create-order?amount=${amount}`
);

      const order =
  typeof response.data === "string"
    ? JSON.parse(response.data)
    : response.data;

      const options = {

        key: "rzp_test_Sx3F05lztXPqtj",

        amount: order.amount,

        currency: order.currency,

        order_id: order.id,

        name: "Employee Management",

        description: "Razorpay Test Payment",

        handler: async function (response) {

          console.log("Payment Success", response);

          const verifyPayload = {

            razorpayOrderId:
              response.razorpay_order_id,

            razorpayPaymentId:
              response.razorpay_payment_id,

            razorpaySignature:
              response.razorpay_signature
          };

          const verifyResponse =
            await axios.post(
              "http://localhost:8082/api/payment/verify",
              verifyPayload
            );

          alert(verifyResponse.data);
        },

        prefill: {
          name: "Vaibhav",
          email: "test@test.com",
          contact: "9999999999"
        },

        theme: {
          color: "#3399cc"
        }
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();

    } catch (error) {

      console.error(error);

      alert("Payment Failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Razorpay Payment Demo</h2>

        <input
          type="number"
            placeholder="Enter Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
        />

     <button onClick={() => payNow(amount)}>
             Pay
    </button>

    </div>
  );
};

export default PaymentPage;