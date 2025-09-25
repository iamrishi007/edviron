const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  custom_order_id: { type: String, required: true, unique: true, index: true },
  school_name: { type: String, required: true }, // NEW

  school_id: { type: mongoose.Schema.Types.ObjectId, ref: "School", required: true, index: true },
  trustee_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  student_info: {
    name: { type: String },
    id: { type: String },
    email: { type: String }
  },
  gateway_name: { type: String },
  order_amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
