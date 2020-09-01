const http = require('http');

// Helper function to create errors
const createErrorHelper = (status, message) => {
    const error = new Error('err');
    error.status = status;
    error.message = message;
    return error;
};

// Handling non-existent routes
const handleNotFound = ((req, res, next) => { 
    // Create and pass to error handler a new error to non-existent routes
    next(createErrorHelper(404, 
        ' The page that you are looking for does not exist'));
  });

// Handling global errors
const handleError = ((err, req, res, next) => {
    // Only providing error in development
    const error = req.app.get('env') === 'development' ? err : {};
    // Set error status and send error message to the page 
    const message = err.message;
    res.status(err.status || 500);
    // Getting meaning of status code error
    const httpStatusCode = http.STATUS_CODES[res.statusCode];
    // Friendly error to log
    console.error(res.statusCode === 404 ? "Pointed at a URL that doesn't exist as a route in the app" : `${httpStatusCode}`);
    if (res.statusCode === 404 || res.statusCode === 418 || res.statusCode === 406) {
        res.render('page-not-found',{error, message, httpStatusCode})
    } else {
        res.render('error', {error, message, httpStatusCode});
    }
});

module.exports = {createErrorHelper, handleNotFound, handleError};