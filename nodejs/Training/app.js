const express = require('express');
const morgan = require('morgan');
const userRoutes = require('./Routes/usersRoutes');
let app = new express();

app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('./public'));

app.use('/api/v1/users', userRoutes);

module.exports = app;