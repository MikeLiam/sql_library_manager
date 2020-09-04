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

module.exports = {asyncHandler, prepareForPagination};