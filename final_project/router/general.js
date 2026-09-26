const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User successfully registered. Now you can login"
  });
});


/* Internal book data endpoint */
public_users.get('/internal/books', function (req, res) {
  res.json(books);
});


/* Task 10 - Get all books using Axios and async/await */
public_users.get('/', async function (req, res) {

  try {
    const response = await axios.get('http://localhost:5000/internal/books');

    res.status(200).json(response.data);

  } catch (error) {
    res.status(500).json({
      message: "Error retrieving books"
    });
  }

});


/* Task 11 - Get book details based on ISBN using Axios and async/await */
public_users.get('/isbn/:isbn', async function (req, res) {

  try {
    const isbn = req.params.isbn;

    const response = await axios.get('http://localhost:5000/internal/books');

    const bookData = response.data;

    if (!bookData[isbn]) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.status(200).json(bookData[isbn]);

  } catch (error) {
    res.status(500).json({
      message: "Error retrieving book"
    });
  }

});


/* Task 12 - Get books based on author using Axios and async/await */
public_users.get('/author/:author', async function (req, res) {

  try {
    const author = req.params.author;

    const response = await axios.get('http://localhost:5000/internal/books');

    const bookData = response.data;

    const result = Object.keys(bookData)
      .filter(isbn => bookData[isbn].author === author)
      .reduce((obj, isbn) => {
        obj[isbn] = bookData[isbn];
        return obj;
      }, {});

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({
      message: "Error retrieving books"
    });
  }

});


/* Task 13 - Get books based on title using Axios and async/await */
public_users.get('/title/:title', async function (req, res) {

  try {
    const title = req.params.title;

    const response = await axios.get('http://localhost:5000/internal/books');

    const bookData = response.data;

    const result = Object.keys(bookData)
      .filter(isbn => bookData[isbn].title === title)
      .reduce((obj, isbn) => {
        obj[isbn] = bookData[isbn];
        return obj;
      }, {});

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({
      message: "Error retrieving books"
    });
  }

});


/* Get book review */
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {
    res.json(books[isbn].reviews);
  } else {
    res.status(404).json({
      message: "Book not found"
    });
  }

});


module.exports.general = public_users;