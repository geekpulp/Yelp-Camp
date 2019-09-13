"strict"

const express = require( "express" ),
  router = express.Router(),
  passport = require( "passport" ),
  User = require( "../models/user" );

router.get( "/", function( req, res ) {
  res.redirect( "/campgrounds" );
} );

// ========================================================================
// Auth routes
// ========================================================================

//show reg form
router.get( "/register", function( req, res ) {
  res.render( "register" );
} );

//handel sign up
router.post( "/register", function( req, res ) {
  const newUser = new User( {
    username: req.body.username
  } );
  User.register( newUser, req.body.password, function( err, user ) {
    if ( err ) {
      console.log( err );
      return res.render( "register" );
    }
    passport.authenticate( "local" )( req, res, function() {
      res.redirect( "/campgrounds" );
    } );
  } );
} );

// show login form
router.get( "/login", function( req, res ) {
  res.render( "login" );
} );

// handle login logic - This uses the passport middleware to handel the authentication logic
router.post( "/login", passport.authenticate( "local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
} ), function( req, res ) {} );


router.get( "/logout", function( req, res ) {
  req.logout();
  res.redirect( "/campgrounds" );
} );

// ============================================================================
// Other routes
// ============================================================================


router.get( "*", function( req, res ) {
  res.send( "404 page not found" );
} );

function isLoggedIn( req, res, next ) {
  if ( req.isAuthenticated() ) {
    return next();
  }
  res.redirect( "/login" );
}

module.exports = router;