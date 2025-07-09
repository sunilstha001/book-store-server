const router = require("express").Router();
const User = require("../models/user");
const authToken = require("./userAuth");
const Book = require("../models/book");

//add book api
router.post("/add-book", authToken, async (req, res) => {
  try {
    const { id, role } = req.user;

    // ✅ Only allow admin
    if (role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });

    await book.save();
    res.status(201).json({ message: "Book added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//update book api
router.put("/update-book/:id", authToken, async (req, res) => {
  try {
    const { role } = req.user;
    if (role != "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const bookId = req.params.id;
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      {
        url: req.body.url,
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        desc: req.body.desc,
        language: req.body.language,
      },
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({
      message: "Book updated successfully",
      updatedBook,
    });
  } catch (err) {
    console.error(err);
  }
});

//delete book api
router.delete("/delete-book/:id", authToken, async (req, res) => {
  try {
    const { role } = req.user;
    if (role != "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const bookId = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error(err);
  }
});

router.get("/all-books", authToken, async (req, res) => {
  try {
    const { role } = req.user;
    if (role != "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const recentBooks = await Book.find().sort({ createdAt: -1 });
    res.status(200).json(recentBooks);
  } catch (err) {
    console.log(err);
  }
});

//get the recent books;
router.get("/recent-books", authToken, async (req, res) => {
  try {
    const { role } = req.user;
    if (role != "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const recentBooks = await Book.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(recentBooks);
  } catch (err) {
    console.log(err);
  }
});


//Public recent books
router.get("/public-recent-books", async (req, res) => {
  try {
    const recentBooks = await Book.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json(recentBooks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong." });
  }
});

//get book by id
router.get("/book/:id", async (req, res) => {
  try {
    // const { role } = req.user;
    // if (role != "admin") {
    //   return res.status(403).json({ message: "Access denied. Admins only." });
    // }
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
