const router = require("express").Router();
const authToken = require("./userAuth"); // adjust the path
const Book = require("../models/book");
const User = require("../models/user");


//Add to cart
router.put("/add-to-cart", authToken, async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Find user
    const user = await User.findById(userId);

    // Check if already in cart
    if (user.cart.includes(bookId)) {
      return res.status(200).json({ message: "Book already in cart" });
    }

    user.cart.push(bookId);
    await user.save();

    res.status(200).json({ message: "Book added to cart" });

  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// Delete form the cart
router.delete("/remove-from-cart", authToken, async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);

    user.cart = user.cart.filter(
      (cartBookId) => cartBookId.toString() !== bookId
    );

    await user.save();

    res.status(200).json({
      message: "Book removed from cart",
      cart: user.cart
    });
  } catch (err) {
    console.error("Error removing from cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});



// Get all the cart
router.get("/get-cart", authToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("cart");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      status: "Success",
      cartBooks: user.cart
    });
  } catch (err) {
    console.error("Error getting cart:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router