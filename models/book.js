'use strict';
const Sequelize = require('sequelize');
const moment = require('moment');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model {}
    Book.init({
        title: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: 'A title is required.'
                }
            }
        },
        author: {
            type: Sequelize.STRING,
            validate: {
                notEmpty: {
                    msg: 'A title is required.'
                }
            }
        },
        genre: Sequelize.STRING,
        year: sequelize.INTEGER
    }, { sequelize });

    return Book;
};