const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const SECRET_KEY = "DwSlkDca2lrLxJv9hFHOFPKCEDBU5b5s";
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return !!users.find(user => user.username === username);
};

const authenticatedUser = (username,password) => {
  return !!users.find(user => user.username === username && user.password === password);
};

regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  if (isValid(username) && authenticatedUser(username, password)) {
    const token = jwt.sign({ username }, SECRET_KEY);
    req.session.user = { username, token };
    return res.status(200).json({ message: "Logged in successfully", token });
  }
  return res.status(403).json({ message: "Invalid credentials" });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const { username } = req.session.user;

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/updated successfully" });
  }
  return res.status(404).json({ message: `No book found for the ISBN: ${isbn}` });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.session.user;

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully." });
    }
    return res.status(404).json({ message: `No review found for the user: ${username} on ISBN: ${isbn}` });
  }
  return res.status(404).json({ message: `No book found for the ISBN: ${isbn}` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
