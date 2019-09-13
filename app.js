"use strict";

const express = require( "express" ),
  app = express(),
  bodyParser = require( 'body-parser' ),
  mongoose = require( "mongoose" ),
  passport = require( "passport" ),
  methodOverride = require( "method-override" ),
  LocalStrategy = require( "passport-local" ),
  User = require( "./models/user" );
//seedDB = require( "./seeds" );

const commentRoutes = require( "./routes/comments" ),
  campgroundRoutes = require( "./routes/campgrounds" ),
  indexRoutes = require( "./routes/index" );

mongoose.connect( "mongodb://localhost/yelp-camp", {
  useNewUrlParser: true
} );

app.use( bodyParser.urlencoded( {
  extended: true
} ) );
app.set( "view engine", "ejs" );

app.use( express.static( __dirname + "/public" ) );
//seedDB();

// ============================================================================
// Passport configuration
// ============================================================================

app.use( require( "express-session" )( {
  secret: "This will be amazing if we let it be",
  resave: false,
  saveUnitialized: false
} ) );
app.use( passport.initialize() );
app.use( passport.session() );
app.use( function ( req, res, next ) {
  res.locals.currentUser = req.user;
  next();
} );
app.use( methodOverride( "_method" ) );
passport.use( new LocalStrategy( User.authenticate() ) );
passport.serializeUser( User.serializeUser() );
passport.deserializeUser( User.deserializeUser() );

// ============================================================================
// Routes
// ============================================================================

app.use( "/campgrounds", campgroundRoutes );
app.use( "/campgrounds/:id/comments", commentRoutes );
app.use( "/", indexRoutes );

// Tells express to listen for requests (Start server)

app.listen( 3001, function () {
  console.log( "The server started on http://localhost:3001/" );
} );