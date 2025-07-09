const router = require("express").Router();
const authToken = require("./userAuth"); // adjust the path
const Book = require("../models/book");
const User = require("../models/user");

router.put("/add-book-to-favourite", authToken, async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user.id;

    // Check if the book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Find user and update favourites
    const user = await User.findById(userId);
    if (user.favourite.includes(bookId)) {
      return res.status(200).json({ message: "Already in favourites" });
    }

    user.favourite.push(bookId);
    await user.save();
    return res.status(200).json({ message: "Book added to favourites" });

    res
      .status(200)
      .json({ message: "Book added to favourites", favourite: user.favourite });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/delete-book-from-favourite", authToken, async (req, res) => {
  const { id } = req.user; // From JWT payload
  const { bookId } = req.body;

  if (!bookId) {
    return res.status(400).json({ message: "Book ID is required" });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const initialLength = user.favourite.length;

    // ⚠ Properly filter by comparing stringified IDs
    user.favourite = user.favourite.filter(
      (favBookId) => favBookId.toString() !== bookId.toString()
    );

    if (user.favourite.length === initialLength) {
      return res.status(404).json({ message: "Book not found in favourites" });
    }

    await user.save();

    return res.status(200).json({
      message: "Book removed from favourites",
      favourite: user.favourite,
    });
  } catch (err) {
    console.error("Error removing favourite:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

//get the fav book for par    ticular user
router.get("/get-favourite-books", authToken, async (req, res) => {
  try {
    const { id } = req.user; // extracted from authToken middleware

    // Populate the favourite field
    const user = await User.findById(id).populate("favourite");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Populated favourites:", user.favourite); // should show book data

    return res.status(200).json({
      status: "Success",
      favouriteBooks: user.favourite,
    });
  } catch (err) {
    console.error("Error getting favourite books:", err);
    return res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
