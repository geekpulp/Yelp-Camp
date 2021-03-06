"use strict";

const express = require( "express" ),
  app = express(),
  bodyParser = require( 'body-parser' ),
  mongoose = require( "mongoose" ),
  flash = require( "connect-flash" ),
  passport = require( "passport" ),
  methodOverride = require( "method-override" ),
  LocalStrategy = require( "passport-local" ),
  User = require( "./models/user" );
//   seedDB = require( "./seeds" );
// seedDB();

const commentRoutes = require( "./routes/comments" ),
  campgroundRoutes = require( "./routes/campgrounds" ),
  indexRoutes = require( "./routes/index" );


console.log( process.env.DATABASEURL );

mongoose.connect( process.env.DATABASEURL, {
  useNewUrlParser: true,
  useFindAndModify: false
} );

app.use( bodyParser.urlencoded( {
  extended: true
} ) );
app.set( "view engine", "ejs" );

app.use( express.static( __dirname + "/public" ) );

// ============================================================================
// Passport configuration
// ============================================================================

app.use( require( "express-session" )( {
  secret: "This will be amazing if we let it be",
  resave: true,
  saveUninitialized: true
} ) );

app.use( flash() );

app.use( passport.initialize() );
app.use( passport.session() );
app.use( function ( req, res, next ) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash( "error" );
  res.locals.success = req.flash( "success" );
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

app.listen( process.env.PORT, process.env.IP,
  function () {
    console.log( "The YelpCamp server started @ http://" + process.env.IP + ":" + process.env.PORT );
  } );