const mongoose = require( "mongoose" );

// Schema setup
const campgroundSchema = new mongoose.Schema( {
  name: String,
  image: String,
  description: String,
  price: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  comments: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment"
  } ]
} );

// also removed comments connected to a deleted campground
const Comment = require( './comment' );
campgroundSchema.pre( 'remove', async function () {
  await Comment.remove( {
    _id: {
      $in: this.comments
    }
  } );
} );

const Campground = mongoose.model( "Campground", campgroundSchema );

module.exports = Campground;