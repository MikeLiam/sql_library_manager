'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Book', 
    [
      {
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        genre: "Fantasy",
        year: 1997
      },
      {
        title: "Harry Potter and the Chamber of Secrets",
        author: "J.K. Rowling",
        genre: "Fantasy",
        year: 1998
      },
      {
        title: "Harry Potter and the Prisoner of Azkaban",
        author: "J.K. Rowling",
        genre: "Fantasy",
        year: 1999
      },
      {
        title: "Harry Potter and the Goblet of Fire",
        author: "J.K. Rowling",
        genre: "Fantasy",
        year: 2000
      },
      {
        title: "Harry Potter and the Order of the Phoenix",
        author: "J.K. Rowling",
        genre: "Fantasy",
        year: 2003
      },
      {
        title: "Harry Potter and the Half-Blood Prince",
        author: "J.K. Rowling",
        genre: "Fantasy",
        year: 2005
      },
      {
        title: "Harry Potter and the Deathly Hallows",
        author: "J.K. Rowling",
        genre: "Fantasy",
        year: 2007
      },
      {
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        genre: "Non Fiction",
        year: 1988
      },
      {
        title: "A Brief History of Time",
        author: "The Universe in a Nutshell",
        genre: "Non Fiction",
        year: 2001
      },
      {
        title: "Ready Player One",
        author: "Ernest Cline",
        genre: "Science Fiction",
        year: 2011
      },
      {
        title: "Armada",
        author: "Ernest Cline",
        genre: "Science Fiction",
        year: 2015
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        genre: "Classic",
        year: 1813
      },
      {
        title: "Emma",
        author: "Jane Austen",
        genre: "Classic",
        year: 1815
      },
      {
        title: "Frankenstein",
        author: "Mary Shelley",
        genre: "Horror",
        year: 1818
      },
      {
        title: "The Martian",
        author: "Andy Weir",
        genre: "Science Fiction",
        year: 2014
      },
    ]
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Book', null, {})
  }
};
