var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const { Op } = require("sequelize");
// Error helper to create errors
const helper = require('../errorHandlers');


/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

function prepareForPagination(books,currentPage) {
  const limit = books.length;
  const booksPerPage = 5;
  const pageCount = Math.ceil(limit / booksPerPage)
  const pageLinks = Array.from(Array(pageCount), (_, i) => i + 1);
  const start = (currentPage -1) * booksPerPage
  const end = (currentPage * booksPerPage) > limit ? limit : (currentPage * booksPerPage)
  const currentBooks = [...books.slice(start, end)]

  return {currentBooks , pageLinks};
}

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
  res.redirect(`books/page/1`)
}));

router.get('/page/:pagenumber', asyncHandler(async (req, res) => {
  const books = await Book.findAll({ order: [[ "title", "ASC" ]] });
  const currentPage = req.params.pagenumber;
  const {currentBooks, pageLinks} = prepareForPagination(books, currentPage)

  res.render("books/index", { books: currentBooks, title: "Books", pageLinks, currentPage, path: "/books/page/" });
}));


/* Create a new book form. */
router.get('/new', (req, res) => {
  res.render("books/new-book", { book: {}, title: "New Book" });
});

/* POST create Book. */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("books/new-book", { book, errors: error.errors, title: "New Book" , action: "Create New Book"})
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }  
  }

}));

/* Search book. */
router.get("/search/:query?", asyncHandler(async (req, res, next) => {
  const query = req.query.search;
  if (query === "") {
    res.redirect('/')
  }
  try {
    const books = await Book.findAll({
      where: {
        [Op.or]: [
          {title: {[Op.like]: `%${query}%`}},
          {author: {[Op.like]: `%${query}%`}},
          {genre: {[Op.like]: `%${query}%`}},
          {year: {[Op.like]: `%${query}%`}}
        ]
      }
    });

    if(books.length !== 0) {
      res.redirect(`/books/search/${query}/page/1`)
    } else {
      // else create and pass an error with friendly message handleError
      next(helper.createErrorHelper(418, 
        ` book not found`));
    }
  } catch (error) {
    throw error; // error caught in the asyncHandler's catch block
  }

}));

router.get('/search/:query/page/:pagenumber', asyncHandler(async (req, res) => {
  const query = req.params.query;
  console.log(query)
  const books = await Book.findAll({
    where: {
      [Op.or]: [
        {title: {[Op.like]: `%${query}%`}},
        {author: {[Op.like]: `%${query}%`}},
        {genre: {[Op.like]: `%${query}%`}},
        {year: {[Op.like]: `%${query}%`}}
      ]
    }
  });
  const currentPage = req.params.pagenumber;
  const {currentBooks, pageLinks} = prepareForPagination(books, currentPage)

  res.render("books/index", { books: currentBooks, title: "Books", pageLinks, currentPage, path: `/books/search/${query}/page/` });
}));

/* GET individual book. */
router.get("/:id", asyncHandler(async (req, res, next) => {
  const id = parseInt(req.params.id);
  // If id is a number
  if (!isNaN(id)){
    const book = await Book.findByPk(req.params.id);
    if(book) {
      res.render("books/update-book", { book, title: "Update Book", action: "Update Book"});  
    } else {
      // res.sendStatus(404);

      // else create and pass an error with friendly message handleError
      next(helper.createErrorHelper(418, 
        ` book with id: ${req.params.id} has not been added... yet`));
    }
  } else {
    // else (not a number) create and pass an friendly error to handleError
    next(helper.createErrorHelper(406, 
      `Please use a valid id for a book, remenber that you are not in youtube!`));
  }

}));

/* Update an book. */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books/" + book.id); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct book gets updated
      res.render("books/update-book", { book, errors: error.errors, title: "Update Book", action: "Update Book" })
    } else {
      throw error;
    }
  }

}));

/* Delete book form. */
router.get("/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/delete", { book, title: "Delete Book" });
  } else {
    res.sendStatus(404);
  }
}));

/* Delete individual article. */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;
