const Razorpay = require('razorpay');
const crypto = require('crypto');
const shortid = require("shortid");
const Transactions = require('../models/transaction');
// require('dotenv').config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
console.log("RZP ID:", process.env.RAZORPAY_KEY_ID);
console.log("RZP SECRET:", process.env.RAZORPAY_KEY_SECRET);

exports.createOrder = async (req, res) => {
  console.log("payment initiated");
  const options = {
    amount: req.body.amount * 100, // convert to paise
    currency: "INR",
    receipt: shortid.generate(),
    notes: {
      key1: "value3",
      key2: "value2"
    }
  };
  try {
    const response = await instance.orders.create(options);
    console.log(response);
    res.json(response);
  } catch (error) {
    console.error("Order creation failed:", error);
    res.status(500).send("Order creation failed");
  }
};

exports.saveTransaction = (req, res) => {
  console.log("Verifying and saving transaction...");

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id)
    .digest('hex');

  if (req.body.razorpay_signature === expectedSignature) {
    const transaction = new Transactions({
      transaction_id: req.body.razorpay_payment_id,
      transaction_amount: req.body.razorpay_amount
    });

    transaction.save((err, saved) => {
      if (err) {
        console.error("DB Save Error:", err);
        return res.status(500).send("Error saving transaction");
      }
      console.log("Transaction saved successfully");
      res.json({ transaction: saved });
    });
  } else {
    console.warn("Signature verification failed");
    res.status(400).send("Invalid signature");
  }
};
