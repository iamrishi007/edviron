const axios = require("axios");
const jwt = require("jsonwebtoken");
const Order = require("../models/order.model");
const OrderStatus = require("../models/orderStatus.model");

// Generate unique order ID
const generateOrderId = () =>
  "ORD-" + Math.random().toString(36).substring(2, 10).toUpperCase();

exports.createCollect = async (req, res, next) => {
  try {
    // Use school_id from JWT for non-admins
    const school_id = req.user.role === "admin" ? req.body.school_id : req.user.school_id;
    const { school_name, order_amount, student_info, custom_order_id, callback_url } = req.body;

    if (!school_id || !order_amount || !callback_url) {
      return res.status(400).json({ message: "school_id, order_amount and callback_url are required" });
    }

    // Unique order ID
    let finalOrderId = custom_order_id || generateOrderId();
    if (await Order.findOne({ custom_order_id: finalOrderId })) {
      finalOrderId = generateOrderId();
    }

    const order = await Order.create({
      custom_order_id: finalOrderId,
      school_id,
      school_name,
      student_info,
      order_amount,
      status: "initiated",
    });

    await OrderStatus.create({ collect_id: order._id, order_amount, status: "pending" });

    // Sign payload
    const signPayload = { school_id, amount: order_amount.toString(), callback_url };
    const sign = jwt.sign(signPayload, process.env.PAYMENT_PG_KEY, { algorithm: "HS256", expiresIn: "10m" });

    // Hit Edviron
    const { data } = await axios.post(
      `${process.env.PAYMENT_API_URL}/create-collect-request`,
      { school_id, amount: order_amount.toString(), callback_url, sign },
      { headers: { Authorization: `Bearer ${process.env.PAYMENT_API_KEY}`, "Content-Type": "application/json" } }
    );

    order.collect_request_id = data.collect_request_id;
    await order.save();

    res.json({
      collect_id: order._id,
      custom_order_id: order.custom_order_id,
      collect_request_id: data.collect_request_id,
      payment_url: data.Collect_request_url,
    });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Duplicate custom_order_id" });
    console.error("createCollect error:", err.response?.data || err.message);
    next(err);
  }
};

exports.getPaymentStatus = async (req, res, next) => {
  try {
    const { collect_request_id } = req.params;
    const school_id = req.query.school_id || req.user.school_id;

    if (!collect_request_id || !school_id) {
      return res.status(400).json({ message: "collect_request_id and school_id are required" });
    }

    const sign = jwt.sign({ school_id, collect_request_id }, process.env.PAYMENT_PG_KEY, { algorithm: "HS256", expiresIn: "10m" });

    const { data } = await axios.get(
      `${process.env.PAYMENT_API_URL}/collect-request/${collect_request_id}?school_id=${school_id}&sign=${sign}`,
      { headers: { Authorization: `Bearer ${process.env.PAYMENT_API_KEY}` } }
    );

    if (data.status === "SUCCESS") {
      await Order.updateOne({ collect_request_id }, { $set: { status: "paid" } });
      await OrderStatus.updateOne({ collect_id: collect_request_id }, { $set: { status: "paid" } });
    }

    res.json(data);
  } catch (err) {
    console.error("getPaymentStatus error:", err.response?.data || err.message);
    next(err);
  }
};
