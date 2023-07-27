const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  if (username && password) {
    const userExists = users.find(user => user.username === username);
    if (userExists) {
      return res.status(400).json({message: "Username already exists."});
    }
    users.push({ username, password });
    return res.status(200).json({message: "Registration successful."});
  }
  return res.status(400).json({message: "Username and password are required."});
});

public_users.get('/',function (req, res) {
  res.status(200).json({books: books});
});

public_users.get('/isbn/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  if(book){
    res.status(200).json(book);
  }else{
    res.status(404).json({message: `No book found for the ISBN: ${req.params.isbn}`});
  }
});

public_users.get('/author/:author',function (req, res) {
  const authorBooks = Object.values(books).filter(book => book.author === req.params.author);
  res.status(200).json(authorBooks);
});

public_users.get('/title/:title',function (req, res) {
  const titleBooks = Object.values(books).filter(book => book.title === req.params.title);
  res.status(200).json(titleBooks);
});

public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];
  if(book){
    res.status(200).json(book.reviews);
  }else{
    res.status(404).json({message: `No book found for the ISBN: ${isbn}`});
  }
});

module.exports.general = public_users;
