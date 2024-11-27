const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
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


// Simula una operación asíncrona con promesas
const getBooksAsync = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(books), 100);  // Simula un retraso
  });
};

// Task 10: Obtener lista de libros usando async/await
public_users.get('/', async (req, res) => {
  try {
    const booksList = await getBooksAsync();  // Llama a la función asíncrona simulada
    res.status(200).json(booksList);  // Devuelve la lista de libros
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la lista de libros", error: error.message });
  }
});

// Task 11: Obtener detalles de un libro por ISBN usando async/await
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const booksList = await getBooksAsync();  // Llama a la función asíncrona
    const book = booksList[isbn];  // Busca el libro por ISBN

    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Libro no encontrado con ese ISBN." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener detalles del libro", error: error.message });
  }
});
  
// Task 12: Obtener detalles de libros por autor usando async/await
public_users.get('/author/:author', async (req, res) => {
  const authorParam = req.params.author.toLowerCase();
  try {
    const booksList = await getBooksAsync();  // Obtiene la lista asíncronamente
    const matchingBooks = Object.values(booksList).filter(
      book => book.author.toLowerCase() === authorParam
    );

    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      res.status(404).json({ message: "No se encontraron libros de este autor." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener libros por autor", error: error.message });
  }
});

// Task 13: Obtener detalles de libros por título usando async/await
public_users.get('/title/:title', async (req, res) => {
  const titleParam = req.params.title.toLowerCase();
  try {
    const booksList = await getBooksAsync();  // Obtiene la lista asíncronamente
    const matchingBooks = Object.values(booksList).filter(
      book => book.title.toLowerCase().includes(titleParam)
    );

    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      res.status(404).json({ message: "No se encontraron libros con ese título." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener libros por título", error: error.message });
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;  // Extrae el ISBN desde los parámetros de la URL
  const book = books[isbn];      // Busca el libro por ISBN en el objeto books

  if (book) {
    res.status(200).json(book.reviews);  // Envía las reseñas del libro si existe
  } else {
    res.status(404).json({ message: "Libro no encontrado con ese ISBN." });
  }
});

module.exports.general = public_users;
