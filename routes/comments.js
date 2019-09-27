"strict";

const express = require( "express" ),
  router = express.Router( {
    mergeParams: true
  } ),
  Campground = require( "../models/campground" ),
  Comment = require( "../models/comment" );

//New comments route
router.get( "/new", isLoggedIn, function ( req, res ) {
  Campground.findById( req.params.id,
    function ( error, campground ) {
      if ( error ) {
        console.log( error );
      } else {
        res.render( "comments/new", {
          campground: campground
        } );
      }
    } );
} );

//new comment logic
router.post( "/", isLoggedIn, function ( req, res ) {
  Campground.findById( req.params.id,
    function ( error, campground ) {
      if ( error ) {
        console.log( error );
        res.redirect( "/campgrounds/:id/" );
      } else {
        Comment.create( req.body.comment, function ( error, comment ) {
          if ( error ) {
            console.log( error );
          } else {
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            comment.save();
            campground.comments.push( comment );
            campground.save();
            res.redirect( "/campgrounds/" + campground._id );
          }
        } );
      }
    } );
} );

//edit comment route
router.get( "/:comment_id/edit", function ( req, res ) {
  Comment.findById( req.params.comment_id, function ( err, foundComment ) {
    if ( err ) {
      res.redirect( "back" );
    } else {
      res.render( "comments/edit", {
        campground_id: req.params.id,
        comment: foundComment
      } );
    }
  } );
} );

//update comment route
router.put( "/:comment_id", function ( req, res ) {
  Comment.findByIdAndUpdate( req.params.comment_id, req.body.comment,
    function ( err, updatedComment ) {
      if ( err ) {
        res.redirect( "back" );
      } else {
        res.redirect( "/campgrounds/" + req.params.id );
      }
    } );
} );

//comment destroy route
router.delete( "/:comment_id", function ( req, res ) {
  Comment.findByIdAndRemove( req.params.comment_id, function ( err ) {
    if ( err ) {
      res.redirect( "back" );
    } else {
      res.redirect( "/campgrounds/" + req.params.id );
    }
  } );
} );

//Middleware

function isLoggedIn( req, res, next ) {
  if ( req.isAuthenticated() ) {
    return next();
  }
  res.redirect( "/login" );
}

module.exports = router;