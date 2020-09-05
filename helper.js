/**
 * Handler function to wrap each route.
 * @param {Function} cb 
 */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

/**
 * Helper function which given an array of books and the currentpage to show 
 * return the books in the array that must be shown and Array with each page link's number
 * @param {Array} books 
 * @param {Integer} currentPage 
 */
function prepareForPagination(books,currentPage) {

  const limit = books.length;
  const booksPerPage = 5;
  const pageCount = Math.ceil(limit / booksPerPage)
  // Array with each page link's number
  const pageLinks = Array.from(Array(pageCount), (_, i) => i + 1);

  const start = (currentPage -1) * booksPerPage
  const end = (currentPage * booksPerPage) > limit ? limit : (currentPage * booksPerPage)

  const currentBooks = [...books.slice(start, end)]

  return {currentBooks , pageLinks};
}

module.exports = {asyncHandler, prepareForPagination};