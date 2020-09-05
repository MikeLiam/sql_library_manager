var express = require('express');
var router = express.Router();
// Model
const Book = require('../../models').Book;
// Error helper to create errors
const errorHelper = require('../../errorHandlers');
// Helpers
const {asyncHandler, prepareForPagination} = require('../../helper');

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
  // To first page of books
  res.redirect(`/books/page/1`)
}));

/* Avoid error with manually typing. GET books listing. */
router.get('/page', asyncHandler(async (req, res) => {
  res.redirect(`/books/page/1`)
}));

/*GET books for each page*/
router.get('/page/:pagenumber', asyncHandler(async (req, res, next) => {
  // Get all books
  const books = await Book.findAll({ order: [[ "title", "ASC" ]] });
  // Get page to show from url
  const currentPage = parseInt(req.params.pagenumber);
  // Get array of books to show and array with number of pages
  const {currentBooks, pageLinks} = prepareForPagination(books, currentPage)
  // Avoid showing empty books page with manually typing url
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
  res.render("books/new-book", { book: {}, title: "New Book", action: "Create New Book" }); // Action for submit input button
});

/* POST create Book. */
router.post('/new', asyncHandler(async (req, res) => {
  // Just in sequelizevalidationerror to save for future modification/save correctly
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if(error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body); // Rerender keeping correct fields
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
    // Get book
    const book = await Book.findByPk(req.params.id);
    // If book found
    if(book) {
      res.render("books/update-book", { book, title: "Update Book", action: "Update Book"});  // Action for submit input button
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

/* Update a book. */
router.post('/:id', asyncHandler(async (req, res) => {
    // Just in sequelizevalidationerror to save for future modification/save correctly
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      // update databse
      await book.update(req.body);
      // show book detail page
      res.redirect("/books/" + book.id); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id; // make sure correct book gets updated and Rerender keeping correct fields
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
    res.redirect("/books"); // to show all books
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;
