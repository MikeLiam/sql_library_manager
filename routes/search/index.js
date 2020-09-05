var express = require('express');
var router = express.Router();
// Model
const Book = require('../../models').Book;
// Sequelize operators
const { Op } = require("sequelize");
// Error helper to create errors
const errorHelper = require('../../errorHandlers');
// Helpers
const {asyncHandler, prepareForPagination} = require('../../helper');

/* Search book query based. */
router.get('/:query?', asyncHandler(async (req, res, next) => {
    const query = req.query.search;
    // if input is empty show all books
    if (query === "") {
      res.redirect('/')
    } else {
      res.redirect(`/search/${query}/page/1`)
    }
}));
/* Avoid manually typing page... general page go to first page*/
router.get('/:query/page', asyncHandler(async (req, res) => {
  const query = req.params.query;
  res.redirect(`/search/${query}/page/1`)
}));
/* Pagination for books searched */
router.get('/:query/page/:pagenumber', asyncHandler(async (req, res, next) => {
  const query = req.params.query;
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
    // If any book found
    if(books.length !== 0) {
      // Get page to show from url
      const currentPage = parseInt(req.params.pagenumber);
      // Get array of books to show and array with number of pages
      const {currentBooks, pageLinks} = prepareForPagination(books, currentPage)
      // Avoid showing empty books page with manually typing url
      if (pageLinks.includes(currentPage)){
        res.render("books/index", { books: currentBooks, title: `"${query}" Books`, pageLinks, currentPage, path: `/search/${query}/page/` });
      } else {
        // else create and pass an error with friendly message handleError
        next(errorHelper.createErrorHelper(404, 
          ` maybe you have reached the limits!`));
      }
    } else {
      // else create and pass an error with friendly message handleError
      next(errorHelper.createErrorHelper(418, 
        ` book not found`));
    }
  } catch (error) {
    throw error; // error caught in the asyncHandler's catch block
  }
}));

  module.exports = router;