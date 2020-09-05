var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// Routes
var routes = require('./routes/index');
var books = require('./routes/books');
var search = require('./routes/search')
// Error handlers
const errorHandlers = require('./errorHandlers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Static route to serve the static files in the public folder
app.use('/static', express.static('public'));
//Routes
app.use('/', routes);
app.use('/books', books);
app.use('/search', search)
// Error handler for error 404 not found page
app.use(errorHandlers.handleNotFound);
// Global error handler
app.use(errorHandlers.handleError);


module.exports = app;
