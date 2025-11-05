const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });

    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const {username, password} = req.body;
    if (!username || !password) {
        return res.status(300).json({message: 'No Username and/or password was entered'});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            "username": username,
            "accessToken": accessToken
        }

        return res.status(300).send("User successfully logged in");
    } else {
        return res.status(300).json({ message: "Invalid Login. Check username and password" });
    }
  
   

  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Find the Book
    const isbn = req.params.isbn;
    const review = req.params.review;
    const book = books[isbn];
    const user = req.username;
    //Check If Review Already Exists under that user






  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
