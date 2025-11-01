const fs = require('fs');
const mongoose = require('mongoose');
const validator = require('validator')

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Movies Name is required field'],
    maxlength: [100, 'The name cannot pass 100 characters'],
    minlength: [4, 'The name cannot be less than 4'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required field'],
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required field']
  },
  ratings: {
    type: Number,
    validate: {
      validator: function(test){
        return test >= 1 && test <= 10;
      },
      message: "Ratings cannot be ({VALUE})"
    }
  },
  totalRating: {
    type: Number
  },
  releaseYear: {
    type: Number,
    required: [true, 'Duration is required field']
  },
  releaseDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  genres: {
    type: [String],
    required: [true, 'Genres is required field'],
    enum: {
      values: ["Action", "Sci-Fi", "Adventure", "Comedy", "Drama", "Family", "Romance", "Horror"],
      message: "There are invalid genre"
    }
  },
  directors: {
    type: [String],
    required: [true, ['Directors is required field']]
  },
  coverImage: {
    type: String,
    required: [true, 'coverImage is required field']
  },
  actors: {
    type: [String],
    required: [true, 'actors is required field'],
  },
  price: {
    type: Number,
    required: [true, 'price is required field']
  },
  createdBy: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// virtual property -> lesson: 84
movieSchema.virtual('durationInHour', function(){
  return this.duration / 60
})


// Document middleware -> lesson: 85
movieSchema.pre('save', function(next){
  this.createdBy = 'Pedro Tchipoco',
  next();
})

movieSchema.post('save', function(doc, next){
  const content = `A new movie document with name ${this.name} has been created by ${this.createdBy}\n`;

  fs.writeFileSync('./Log/log.txt', content, {flag: 'a'}, (err) =>
  {
    console.log(err.message);
  })

  next();
})

// Query middleware -> lesson: 86
movieSchema.pre(/^find/, function(next){
  this.find({releaseDate: {$lte: Date.now() }});
  this.startTime = Date.now();

  next();
})

movieSchema.post(/^find/, function(docs, next) {
  this.find({releaseDate: { $lte: Date.now() }});
  this.endTime = Date.now();

  const content = `Query took ${this.endTime - this.startTime } milliseconds to fetch the documents.`;
  fs.writeFileSync('./Log/log.txt', content, {flag: 'a'}, (err) =>
  {
    console.log(err.message);
  })
  next();
})

// Aggregation Middleware -> lesson: 87
movieSchema.pre('aggregate', function(next){
  console.log(this.pipeline().unshift({$match: {releaseDate: {$lte: new Date()}}}) );

  next();
})

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie