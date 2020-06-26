const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

// Handler function that wraps each route.
function asyncHandler(cb) {
    return async(req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            res.status(500).send(error);
        };
    };
};

// GET the full list of books.
router.get('/', asyncHandler(async (req, res) => {
    const books = await Book.findAll({
        order: [["author", "ASC"]]
    });
    res.render("books/index", { books, title: "Books" });
}));

// GET the create new book form.
router.get('/books/new', (req, res) => {
	res.render("books/new", { book: {}, title: "New Book" });
});
  
// POST new book to database.
router.post('/', asyncHandler(async (req, res) => {
	let book;

	try {
		book = await Book.create(req.body);
		res.redirect("/books/" + book.id);
	} catch (error) {
		if (error.name === "SequelizeValidationError") {
			book = await Book.build(req.body);
			res.render("books/new-book", { book, errors: error.errors, title: "New Book" })
		} else {
			throw error;
		};
	};
}));
  
// GET book details.
router.get("/:id", asyncHandler(async (req, res) => {
	const book = await Book.findByPk(req.params.id);

	if (book) {
		res.render("books/update-book", { book, title: book.title }); 
	} else {
		res.sendStatus(404);
	};
}));
  
// POST updated book details to database.
router.post('/:id', asyncHandler(async (req, res) => {
	let book;

	try {
		book = await Book.findByPk(req.params.id);
		if (book) {
			await book.update(req.body);
			res.redirect("/books" + book.id);
		} else {
			res.sendStatus(404);
		};
	} catch (error) {
		if (error.name === "SequelizeValidationError") {
			book = await Book.build(req.body);
			book.id = req.params.id;
			res.render("books/error", { book, errors: error.errors, title: "Update Book" })
		} else {
			throw error;
		};
	};
}));

// POST deletion of book to database.
router.post('/:id/delete', asyncHandler(async (req ,res) => {
	const book = await Book.findByPk(req.params.id);

	if (book) {
		await book.destroy();
		res.redirect("/books");
	} else {
		res.sendStatus(404);
	};
}));

module.exports = router;