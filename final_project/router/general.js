const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;
  if(username&&password){
      const present = users.filter((user)=> user.username === username)
      if(present.length===0){
          users.push({"username":req.body.username,"password":req.body.password});
          return res.status(201).json({message:"Ueer created successfully"})
      }
      else{
        return res.status(400).json({message:"Already exists"})
      }
  }
  else if(!username && !password){
    return res.status(400).json({message:"Bad request"})
  }
  else if(!username || !password){
    return res.status(400).json({message:"Recheck username and password"})
  }  


  //return res.status(300).json({message: "Yet to be implemented"});
});

function getBookList() {
    return new Promise((resolve, reject) => {
      resolve(books);
    });
  }

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  getBookList()
  .then((bk) => {
    return res.status(200).json(bk);
  })
  .catch((err) => {
    return res.status(500).json({ message: "Error fetching book list" });
  });

  //res.send(JSON.stringify(books, null, 4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN

function getByISBN(isbn) {
    return new Promise((resolve, reject) => {
      let book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject({ status: 404, message: "Book not found" });
      }
    });
  }


public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  getByISBN(isbn)
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(error.status || 404).json({ message: error.message });
    });
  
  //const ISBN = req.params.isbn;
  //res.send(books[ISBN]);
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author

function getByAuthor(author) {
    return new Promise((resolve, reject) => {
      let booksByAuthor = [];
      let keys = Object.keys(books);
      
      keys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          booksByAuthor.push(books[key]);
        }
      });
  
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject({ status: 404, message: "Author not found" });
      }
    });
  }




public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  
  getByAuthor(author)
    .then((booksByAuthor) => {
      return res.status(200).json(booksByAuthor);
    })
    .catch((error) => {
      return res.status(error.status || 404).json({ message: error.message });
    });

   //let new_books = {}
   //const new_author = req.params.author;
   //let i=1;
   //for(let bookid in books){
     //if(books[bookid].author === new_author ){
      // new_books[i++] = books[bookid];
     //}
    //}
    //res.send(JSON.stringify(new_books))
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title

function getByTitle(title) {
    return new Promise((resolve, reject) => {
      let booksByTitle = [];
      let keys = Object.keys(books);
      
      keys.forEach((key) => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          booksByTitle.push(books[key]);
        }
      });
  
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject({ status: 404, message: "Book not found" });
      }
    });
  }

  
  public_users.get('/title/:title', async function (req, res) {


    const title = req.params.title;
  
    try {
      const booksByTitle = await getByTitle(title);
      return res.status(200).json(booksByTitle);
    } catch (error) {
      return res.status(error.status || 404).json({ message: error.message });
    }

  //Write your code here
   //let new_books = {}
   //const new_title = req.params.title;
   //let i=1;
   //for(let bookid in books){
    // if(books[bookid].title === new_title ){
    //   new_books[i++] = books[bookid];
    // }
    //}
    //res.send(JSON.stringify(new_books))
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].review),null,4);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
