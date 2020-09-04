var express = require('express');
var router = express.Router();
const Book = require('../../models').Book;
const { Op } = require("sequelize");
// Error helper to create errors
const errorHelper = require('../../errorHandlers');
const {asyncHandler, prepareForPagination} = require('../../helper');

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
  res.redirect(`/books/page/1`)
}));

/* GET books listing. */
router.get('/page', asyncHandler(async (req, res) => {
  res.redirect(`/books/page/1`)
}));

router.get('/page/:pagenumber', asyncHandler(async (req, res, next) => {
  const books = await Book.findAll({ order: [[ "title", "ASC" ]] });
  const currentPage = parseInt(req.params.pagenumber);
  const {currentBooks, pageLinks} = prepareForPagination(books, currentPage)

  if (pageLinks.includes(currentPage)){
    res.render("books/index", { books: currentBooks, title: "Books", pageLinks, currentPage, path: "/books/page/" });
  } else {
      // else create and pass an error with friendly message handleError
      next(errorHelper.createErrorHelper(404, 
        ` maybe you have reached the limits!`));
  }
}));


/* Create a new book form. */
router.get('/new', (req, res) => {
  res.render("books/new-book", { book: {}, title: "New Book", action: "Create New Book" });
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

/* GET individual book. */
router.get("/:id", asyncHandler(async (req, res, next) => {
  const id = parseInt(req.params.id);
  // If id is a number
  if (!isNaN(id)){
    const book = await Book.findByPk(req.params.id);
    if(book) {
      res.render("books/update-book", { book, title: "Update Book", action: "Update Book"});  
    } else {
      // else create and pass an error with friendly message handleError
      next(errorHelper.createErrorHelper(418, 
        ` book with id: ${req.params.id} has not been added... yet`));
    }
  } else {
    // else (not a number) create and pass an friendly error to handleError
    next(errorHelper.createErrorHelper(406, 
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


/* Delete book. */
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
