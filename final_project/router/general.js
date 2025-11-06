const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let { username, password } = req.body;

    if (!username || !password) {
        return res.status(300).json({message: 'No Username and/or password was entered'});
    }


    const userExists = Object.values(users).find(user => user.username === username);
    if (userExists) {
        return res.status(300).json({message: "Error: That Username already Exists!"});
    }
    users.push({"username": username, "password": password});
    return res.status(300).json({message: "User succesfully created"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("No books found");
        }
    })
    .then(bookList => {
        return res.status(200).json({ message: bookList });
    })
    .catch(err => {
        return res.status(500).json({ message: err });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    // Wrap the lookup in a Promise
    const getBookByISBN = new Promise((resolve, reject) => {
        const selection = books[isbn];
        if (selection) {
            resolve(selection);
        } else {
            reject(`Book with ISBN ${isbn} not found`);
        }
    });

    getBookByISBN
        .then(book => {
            res.status(200).json({ message: book });
        })
        .catch(err => {
            res.status(404).json({ message: err });
        });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const reqAuthor = req.params.author;
    let booksToReturn = [];

   Object.values(books).forEach(book => {
        if (reqAuthor == book.author) {
            booksToReturn.push(book);
        }

   })
   return res.status(300).json({message:  booksToReturn});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const reqTitle = req.params.title;
    let booksToReturn = [];

    Object.values(books).forEach(book => {
        if (reqTitle == book.title) {
            booksToReturn.push(book);
        }
    })
  return res.status(300).json({message:  booksToReturn});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbnReq = req.params.isbn;
    const book = books[isbnReq];

  return res.status(300).json({message: book.review});
});

module.exports.general = public_users;
