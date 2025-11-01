const Movie = require('./../Model/movieModel');
const ApiFeatures = require('./../Utils/ApiFeatures');
const asyncErrorHandler = require('./../Utils/AsyncErrorHandler')
const CustomError = require('./../Utils/CustomError')

exports.getHighestRated = (req, res, next) =>
{
    const newQuery = {
        ...req.query,
        limit: '5',
        sort: '-ratings'
    };

    Object.defineProperty(req, 'query', {
        value: newQuery,
        writAble: true,
        enumerable: true,
        configurable: true
    })

    next();
}

exports.getAllMovies = asyncErrorHandler( async (req, res, next) => {
    const features = new ApiFeatures(Movie.find(), req.query).filter().sort().limitFields().paginate();

    const movies = await features.query;
    res.status(200).json({
        status: 'success',
        count: movies.length,
        data: { movies }
    });
})

exports.getMovie = asyncErrorHandler (async (req, res, next) =>
{
    const movie = await Movie.findById(req.params.id);

    if (!movie)
    {
        const error = new CustomError('Movie not found', 404);
        return next(error);
    }

    res.status(200).json(
    {
        status: 'success',
        data:
        {
            movie
        }
    })
})

exports.addNewMovie = asyncErrorHandler( async (req, res, next) =>
{
    const movie = await Movie.create(req.body);
    
    res.status(201).json(
    {
        status: 'success',
        data: {
            movie
        }
    })
})

exports.updateMovie = asyncErrorHandler (async (req, res, next) =>
{
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

    if (!movie)
    {
        const error = new CustomError('Movie not found', 404);
        return next(error);
    }

    res.status(201).json(
    {
        status: 'success',
        data:
        {
            movie
        }
    })
})

exports.deleteMovie = asyncErrorHandler(async (req, res, next) => 
{
    const movieDeleted = await Movie.findByIdAndDelete(req.params.id);

    if (!movieDeleted)
    {
        const error = new CustomError('Movie not found', 404);
        return next(error);
    }

    res.status(204).json(
    {
        status: 'success', 
        data: null
    })
})

exports.getMovieStats = asyncErrorHandler (async (req, res, next) =>
{
    const stats = await Movie.aggregate([
        {$match: {ratings: {$gt: 7,}}},
        {$group: {
            _id: '$releaseYear',
            avgRating: { $avg: '$ratings' },
            avgPrice: {$avg: '$price' },
            minPrice: {$min: '$price' },
            maxPrice: {$max: '$price' },
            priceTotal: {$sum: '$price' },
            movieCount: {$sum: 1 }
        }},
        {$sort: {minPrice: 1}}
    ])

    res.status(200).json(
    {
        status: 'success',
        count: stats.length,
        data: {
            stats
        }
    })
})

exports.getMovieByGenre = asyncErrorHandler (async (req, res, next) =>
{
    const genre = req.params.genre;

    const movies = await Movie.aggregate([
        {$unwind: '$genres'},
        {$group: {
            _id: '$genres',
            movieCount: {$sum: 1},
            movies: {$push: '$name'}
        }},
        {$addFields: {genre: "$_id"}},
        {$project: {_id: 0}},
        {$sort: {movieCount: -1}},
        // {$limit: 5},
        {$match: {genre: genre}}
    ])

    res.status(200).json(
    {
        status: 'success',
        count: movies.length,
        data: {
            movies
        }
    })
})