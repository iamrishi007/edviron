const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const roleCheck = require("../middlewares/role.middleware");
const ownSchool = require("../middlewares/ownSchool.middleware");
const asyncHandler = require("../middlewares/asyncHandler");
const txCtrl = require("../controllers/transactions.controller");

// Admin: get all transactions
router.get("/", auth, roleCheck("admin"), asyncHandler(txCtrl.getAllTransactions));

// Admin or user (user restricted to own school)
router.get(
  "/school/:schoolId",
  auth,
  roleCheck(["admin", "user"]),
  ownSchool,
  asyncHandler(txCtrl.getTransactionsBySchool)
);

// Admin or user: check transaction status
router.get(
  "/status/:custom_order_id",
  auth,
  roleCheck(["admin", "user"]),
  asyncHandler(txCtrl.getTransactionStatus)
);

module.exports = router;
