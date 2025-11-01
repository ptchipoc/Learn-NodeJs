const express = require('express');
const morgan = require('morgan');
const moviesRoute = require('./Routes/moviesRoute');
const authRoute = require('./Routes/authRoute');
const CustomError = require('./Utils/CustomError');
const globalErrorHandler = require('./Controllers/errorController');

let app = new express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Correctly placed
app.use(morgan('dev'))
app.use(express.static('./public'));

app.use('/api/v1/users', authRoute);
app.use('/api/v1/movies', moviesRoute);

// 1. CATCH-ALL MIDDLEWARE (The 404 Handler) -> lesson: 90
app.use((req, res, next) => {
    // const err = new Error(`Can't find ${req.originalUrl} on the server`);
    // err.status = 'fail';
    // err.statusCode = 404;
    const err = new CustomError(`Can't find ${req.originalUrl} on the server`, 404);
    next(err);
});


// 2. GLOBAL ERROR HANDLING MIDDLEWARE -> lesson: 91
app.use(globalErrorHandler);

module.exports = app