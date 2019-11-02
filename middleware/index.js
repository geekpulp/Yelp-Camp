// all middleware

const Campground = require( "../models/campground" );
const Comment = require( "../models/comment" );
const middlewareObj = {}

middlewareObj.isLoggedIn = function ( req, res, next ) {
    if ( req.isAuthenticated() ) {
        return next();
    }
    req.flash( "error", "Please login first!" );
    res.redirect( "/login" );
};

middlewareObj.checkCampgroundOwnership = function ( req, res, next ) {
    // is user logged in?
    if ( req.isAuthenticated() ) {
        Campground.findById( req.params.id, function ( err, foundCampground ) {
            if ( err ) {
                res.redirect( "back" );
            } else {
                //does user own the campground?
                if ( foundCampground.author.id.equals( req.user._id ) ) {
                    next();
                } else {
                    res.redirect( "back" );
                }
            }
        } );
    } else {
        res.redirect( "back" );
    }
};

middlewareObj.checkCommentOwnership = function ( req, res, next ) {
    // is user logged in?
    if ( req.isAuthenticated() ) {
        Comment.findById( req.params.comment_id, function ( err, foundComment ) {
            if ( err ) {
                res.redirect( "back" );
            } else {
                //does user own the comment?
                if ( foundComment.author.id.equals( req.user._id ) ) {
                    next();
                } else {
                    res.redirect( "back" );
                }
            }
        } );
    } else {
        res.redirect( "back" );
    }
};

module.exports = middlewareObj