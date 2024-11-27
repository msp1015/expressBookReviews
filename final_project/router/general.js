const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;  // Extrae username y password del cuerpo de la solicitud

  // Verifica si se proporcionan username y password
  if (!username || !password) {
    return res.status(400).json({ message: "Se requieren nombre de usuario y contraseña." });
  }

  // Comprueba si el usuario ya existe en la lista de usuarios
  const userExists = users.some(user => user.username === username);
  
  if (userExists) {
    return res.status(409).json({ message: "El nombre de usuario ya está en uso." });
  }

  // Si no existe, agrega el nuevo usuario a la lista de usuarios
  users.push({ username, password });
  
  return res.status(201).json({ message: "Usuario registrado con éxito." });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const booksList = JSON.stringify(books, null, 2); // Convierte el objeto a una cadena JSON formateada
  res.status(200).send(booksList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;  // Obtiene el ISBN desde la URL
  const book = books[isbn];      // Busca el libro por ISBN

  if (book) {
    res.status(200).json(book);  // Envía los detalles del libro si existe
  } else {
    res.status(404).json({ message: "Libro no encontrado con ese ISBN." });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();  // Convierte a minúsculas para evitar errores de coincidencia
  const matchingBooks = Object.values(books).filter(
    book => book.author.toLowerCase() === author
  );

  if (matchingBooks.length > 0) {
    res.status(200).json(matchingBooks);  // Envía los libros encontrados
  } else {
    res.status(404).json({ message: "No se encontraron libros de este autor." });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const titleParam = req.params.title.toLowerCase();  // Convierte el título a minúsculas para coincidencias insensibles a mayúsculas
  const matchingBooks = Object.values(books).filter(
    book => book.title.toLowerCase().includes(titleParam)  // Filtra los libros que contengan el título
  );

  if (matchingBooks.length > 0) {
    res.status(200).json(matchingBooks);  // Devuelve los libros coincidentes
  } else {
    res.status(404).json({ message: "No se encontraron libros con ese título." });
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
