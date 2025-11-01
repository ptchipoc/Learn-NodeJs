const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

const Movie = require('./../Model/movieModel');

dotenv.config({path: './config.env'});

async function main() {
    try { 
        // Connect to database first
        await mongoose.connect(process.env.CONN_STR, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log('DB connection successful');

        // READ MOVIES.JSON FILE
        const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'));

        const command = process.argv[2];

        if (command === '--import') {
            console.log('Starting import operation...');
            await Movie.create(movies);
            console.log('Data successfully imported');
        } 
        else if (command === '--delete') {
            console.log('Starting delete operation...');
            const result = await Movie.deleteMany();
            console.log(`Data successfully deleted. Deleted ${result.deletedCount} documents`);
        }
        else {
            console.log('Please use --import or --delete');
        }

    } catch (error) {
        console.log('Error: ' + error.message);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
}

main();