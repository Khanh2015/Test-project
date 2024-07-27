import React, { useState } from "react";
import axios from "axios";

const PaymentForm = () => {
  const [amount, setAmount] = useState("");
  const [orderInfo, setOrderInfo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/create_payment_url", {
        amount,
        orderInfo,
      });
      window.location.href = res.data.paymentUrl;
    } catch (error) {
      console.error("Error creating payment URL:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Số tiền:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div>
        <label>Thông tin đơn hàng:</label>
        <input
          type="text"
          value={orderInfo}
          onChange={(e) => setOrderInfo(e.target.value)}
        />
      </div>
      <button type="submit">Thanh toán</button>
    </form>
  );
};

export default PaymentForm;
