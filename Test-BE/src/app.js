import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import cors from "cors";
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const config = {
  vnp_TmnCode: "9AG8OK96",
  vnp_HashSecret: "L7TTVKFNGIV1F6FI497EH1FWEYRY3CRB",
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_ReturnUrl: "http://localhost:3000/vnpay_return",
};

app.post("/create_payment_url", (req, res) => {
  const { amount, orderInfo } = req.body;
  const date = new Date();
  const vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: config.vnp_TmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: date.getTime().toString(),
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: "other",
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: config.vnp_ReturnUrl,
    vnp_IpAddr: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    vnp_CreateDate: date
      .toISOString()
      .slice(0, 19)
      .replace(/-/g, "")
      .replace(/:/g, "")
      .replace("T", ""),
  };

  // Sắp xếp các tham số theo thứ tự alphabet
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((result, key) => {
      result[key] = vnp_Params[key];
      return result;
    }, {});

  // Tạo chuỗi dữ liệu để băm
  const signData = new URLSearchParams(sortedParams).toString();

  // Tạo chữ ký số
  const secureHash = crypto
    .createHmac("sha512", config.vnp_HashSecret)
    .update(signData)
    .digest("hex");

  // Thêm chữ ký vào tham số
  vnp_Params.vnp_SecureHash = secureHash;

  // Tạo URL thanh toán
  const paymentUrl = `${config.vnp_Url}?${new URLSearchParams(
    vnp_Params
  ).toString()}`;

  res.json({ paymentUrl });
});

app.get("/vnpay_return", (req, res) => {
  const vnp_Params = req.query;
  const secureHash = vnp_Params.vnp_SecureHash;

  delete vnp_Params.vnp_SecureHash;
  delete vnp_Params.vnp_SecureHashType;

  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((result, key) => {
      result[key] = vnp_Params[key];
      return result;
    }, {});

  const signData = new URLSearchParams(sortedParams).toString();
  const checkSum = crypto
    .createHmac("sha512", config.vnp_HashSecret)
    .update(signData)
    .digest("hex");

  if (secureHash === checkSum) {
    res.send("Payment success");
  } else {
    res.send("Payment failed");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
