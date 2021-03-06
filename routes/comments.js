"strict";

const express = require( "express" ),
  router = express.Router( {
    mergeParams: true
  } ),
  Campground = require( "../models/campground" ),
  Comment = require( "../models/comment" ),
  middleware = require( "../middleware" );

//New comments route
router.get( "/new", middleware.isLoggedIn, function ( req, res ) {
  Campground.findById( req.params.id,
    function ( error, campground ) {
      if ( error ) {
        req.flash( "error", "Something went wrong!" );
      } else {
        res.render( "comments/new", {
          campground: campground
        } );
      }
    } );
} );

//new comment logic
router.post( "/", middleware.isLoggedIn, function ( req, res ) {
  Campground.findById( req.params.id,
    function ( error, campground ) {
      if ( error ) {
        req.flash( "error", error.message );
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
            req.flash( "success", "Thanks for the comment!" );
            res.redirect( "/campgrounds/" + campground._id );
          }
        } );
      }
    } );
} );

//edit comment route
router.get( "/:comment_id/edit", middleware.checkCommentOwnership, function ( req, res ) {
  Comment.findById( req.params.comment_id, function ( err, foundComment ) {
    if ( err ) {
      req.flash( "error", err.message );
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
router.put( "/:comment_id", middleware.checkCommentOwnership, function ( req, res ) {
  Comment.findByIdAndUpdate( req.params.comment_id, req.body.comment,
    function ( err, updatedComment ) {
      if ( err ) {
        req.flash( "error", err.message );
        res.redirect( "back" );
      } else {
        req.flash( "success", "Comment updated" );
        res.redirect( "/campgrounds/" + req.params.id );
      }
    } );
} );

//comment destroy route
router.delete( "/:comment_id", middleware.checkCommentOwnership, function ( req, res ) {
  Comment.findByIdAndRemove( req.params.comment_id, function ( err ) {
    if ( err ) {
      req.flash( "error", err.message );
      res.redirect( "back" );
    } else {
      req.flash( "success", "Comment deleted" );
      res.redirect( "/campgrounds/" + req.params.id );
    }
  } );
} );

module.exports = router;