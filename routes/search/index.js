var express = require('express');
var router = express.Router();
const Book = require('../../models').Book;
const { Op } = require("sequelize");
// Error helper to create errors
const errorHelper = require('../../errorHandlers');
const {asyncHandler, prepareForPagination} = require('../../helper');

/* Search book. */
router.get("/:query?", asyncHandler(async (req, res, next) => {
    const query = req.query.search;
    if (query === "") {
      res.redirect('/')
    } else {
      res.redirect(`/search/${query}/page/1`)
    }
    
  
  }));
  
  router.get('/:query/page', asyncHandler(async (req, res) => {
    const query = req.params.query;
    res.redirect(`/search/${query}/page/1`)
  }));
  
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
  
      if(books.length !== 0) {
        const currentPage = parseInt(req.params.pagenumber);
        const {currentBooks, pageLinks} = prepareForPagination(books, currentPage)
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