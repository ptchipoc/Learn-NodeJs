const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({path: './config.env'});

const PORT = process.env.PORT;
const DB = process.env.CONN_STR;

mongoose.connect(DB, {
    useNewUrlParser: true
})
.then((conn) => {
    console.log('DB connection successful');
})
.catch((err) => console.log(err));

app.listen(PORT, () => {
    console.log('Server has tarted on PORT: ' + PORT);
})