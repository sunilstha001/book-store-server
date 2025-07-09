const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
require('./connection/connection'); // Ensure this file is executed to establish the MongoDB connection
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const user = require('./routes/user'); // Import user routes4
const book = require('./routes/book')
const fav = require("./routes/fav")
const cart = require("./routes/cart")
const order = require("./routes/order")


app.use(cors({
  origin: 'http://localhost:5173',  // your frontend URL
  credentials: true                // allow cookies to be sent
}));
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.use('/api/v1', cart);
app.use('/api/v1', fav )
app.use('/api/v1', book )
app.use('/api/v1', order)
app.use('/api/v1', user); // Use user routes

//routes

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});