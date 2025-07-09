const router = require("express").Router();
const authToken = require("./userAuth");
const Book = require("../models/book");
const User = require("../models/user");
const Order = require("../models/order");

router.post("/place-order", authToken, async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).populate("cart");

    if (!user || user.cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty or user not found" });
    }

    const orders = [];

    for (const book of user.cart) {
      const newOrder = new Order({
        user: user._id,
        book: book._id,
        status: "pending"
      });

      const savedOrder = await newOrder.save();
      orders.push(savedOrder._id);
    }

    user.orders.push(...orders);
    user.cart = []; // clear cart
    await user.save();

    res.status(200).json({
      message: "Order placed successfully",
      orders
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//Order history
router.get("/order-history", authToken, async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book", model: "Book" }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: "Success",
      orders: user.orders,
    });
  } catch (err) {
    console.error("Error fetching order history:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET all orders (Admin or general purpose)
router.get("/get-all-orders", authToken, async (req, res) => {
  try {
    //If you want only admins to access:
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order.find()
      .populate("user", "name email") // only name and email from User
      .populate("book"); // all book details

    res.status(200).json({
      status: "Success",
      total: orders.length,
      orders,
    });
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update the status of the book
router.put("/update-order-status/:orderId", authToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Optional: Only admin can update status
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can update order status" });
    }

    const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({ message: "Order status updated", order });

  } catch (err) {
    console.error("Error updating order status:", err);
    return res.status(500).json({ message: "Server error" });
  }
});





module.exports = router;
