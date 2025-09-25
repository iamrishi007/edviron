const mongoose = require("mongoose");
const Order = require("../models/order.model");
const OrderStatus = require("../models/orderStatus.model");

// Get all transactions with role-based filtering
exports.getAllTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const sortField = req.query.sort || "createdAt";
    const sortOrder = req.query.order === "asc" ? 1 : -1;
    const statusFilter = req.query.status;
    const schoolFilter = req.query.school_id;

    const match = {};

    // Role-based school filter
    if (req.user.role !== "admin") {
      match.school_id = req.user.school_id; // user sees only own school
    } else if (schoolFilter) {
      match.school_id = schoolFilter; // admin can filter
    }

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "orderstatuses",
          localField: "_id",
          foreignField: "collect_id",
          as: "status",
        },
      },
      { $unwind: { path: "$status", preserveNullAndEmptyArrays: true } },
    ];

    if (statusFilter) {
      pipeline.push({ $match: { "status.status": statusFilter } });
    }

    pipeline.push({
      $project: {
        _id: 0,
        collect_id: "$_id",
        custom_order_id: 1,
        school_id: 1,
        school_name: 1,
        gateway: "$gateway_name",
        order_amount: 1,
        transaction_amount: "$status.transaction_amount",
        status: "$status.status",
        payment_time: "$status.payment_time",
      },
    });

    pipeline.push({ $sort: { [sortField]: sortOrder } });
    pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

    const data = await Order.aggregate(pipeline);
    res.json({ page, limit, data });
  } catch (err) {
    next(err);
  }
};

// Get transactions by specific school
exports.getTransactionsBySchool = async (req, res, next) => {
  try {
    let { schoolId } = req.params;
    if (req.user.role !== "admin") schoolId = req.user.school_id;

    if (!mongoose.Types.ObjectId.isValid(schoolId)) {
      return res.status(400).json({ message: "Invalid schoolId" });
    }

    const pipeline = [
      { $match: { school_id: schoolId } },
      {
        $lookup: {
          from: "orderstatuses",
          localField: "_id",
          foreignField: "collect_id",
          as: "status",
        },
      },
      { $unwind: { path: "$status", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          collect_id: "$_id",
          custom_order_id: 1,
          school_id: 1,
          gateway: "$gateway_name",
          order_amount: 1,
          transaction_amount: "$status.transaction_amount",
          status: "$status.status",
          payment_time: "$status.payment_time",
        },
      },
    ];

    const data = await Order.aggregate(pipeline);
    res.json({ count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// Get transaction status
exports.getTransactionStatus = async (req, res, next) => {
  try {
    const { custom_order_id } = req.params;

    const order = await Order.findOne({ custom_order_id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "admin" && order.school_id.toString() !== req.user.school_id) {
      return res.status(403).json({ message: "Forbidden: cannot access this transaction" });
    }

    const status = (await OrderStatus.findOne({ collect_id: order._id })) || { status: "pending" };
    res.json({ custom_order_id, collect_id: order._id, status });
  } catch (err) {
    next(err);
  }
};
