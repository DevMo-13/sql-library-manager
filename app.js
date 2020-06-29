/******************************************
Treehouse Techdegree:
FSJS project 8 - SQL Library Manager
--aiming for exceeds expectations--
******************************************/

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const routes = require('./routes/index');
const books = require('./routes/books');
const app = express();

// View engine setup.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware.
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', routes);
app.use('/books', books);

// Catch 404 and forward to error handler.
app.use( (req, res, next) => {
  next(createError(404));
});

// Error handler that renders an error or page-not-found page.
app.use( (err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  if (err.status === 404) {
    console.log(err);
    res.render('books/page-not-found', { err, title: 'Page Not Found' });
  } else {
    const err = new Error();
    err.status = 500;
    console.log(err);
    res.render('books/error', { err, title: 'Server Error' });
  }
});

// Runs the app on local host at port 3000.
app.listen(3000, () => {
    console.log('The application is running on localhost:3000.');
});

module.exports = app;