const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const asyncHandler = require("../middlewares/asyncHandler");
const paymentCtrl = require("../controllers/payment.controller");

// Both admin and user can create payments
router.post("/create-payment", auth, asyncHandler(paymentCtrl.createCollect));

// Get payment status
router.get("/status/:collect_request_id", auth, asyncHandler(paymentCtrl.getPaymentStatus));

module.exports = router;
