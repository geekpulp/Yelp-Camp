"strict"

const express = require( "express" ),
  router = express.Router(),
  Campground = require( "../models/campground" ),
  middleware = require( "../middleware" );

//INDEX - Restful route shows all campgrounds
router.get( "/", function ( req, res ) {
  Campground.find( {}, function ( error, allCampgrounds ) {
    if ( error ) {
      console.log( error );
    } else {
      res.render( "campgrounds/index", {
        campgrounds: allCampgrounds
      } );
    }
  } );
} );

//CREATE - Restful route create new campground
router.post( "/", middleware.isLoggedIn, function ( req, res ) {
  // get data from form and add back to campground array
  const name = req.body.name;
  const image = req.body.image;
  const description = req.body.description;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  const newCampground = {
    name: name,
    image: image,
    description: description,
    author: author
  }
  Campground.create( newCampground, function ( error, newlyCreated ) {
    if ( error ) {
      console.log( error );
    } else {
      // redirect back to campgrounds
      res.redirect( "/campgrounds" );
    }
  } )

} );

//NEW - Restful route shows form to create new campground
router.get( "/new", middleware.isLoggedIn, function ( req, res ) {
  res.render( "campgrounds/new" );
} );


//SHOW - Restful route which shows a specific campground
router.get( "/:id", function ( req, res ) {
  Campground.findById( req.params.id ).populate( "comments" ).exec( function ( error, foundCampground ) {
    if ( error ) {
      console.log( error );
    } else {
      res.render( "campgrounds/show", {
        campground: foundCampground
      } );
    }
  } );
} );

// EDIT - campground route
router.get( "/:id/edit", middleware.checkCampgroundOwnership, function ( req, res ) {
  Campground.findById( req.params.id, function ( err, foundCampground ) {
    res.render( "campgrounds/edit", {
      campground: foundCampground
    } );
  } );
} );

// UPDATE - campground route

router.put( "/:id", middleware.checkCampgroundOwnership, function ( req, res ) {
  Campground.findByIdAndUpdate( req.params.id, req.body.campground,
    function ( err, updatedCampground ) {
      if ( err ) {
        res.redirect( "/campgrounds" );
      } else {
        res.redirect( "/campgrounds/" + req.params.id );
      }
    } );
} );

// DESTROY - campground route

router.delete( "/:id", middleware.checkCampgroundOwnership, function ( req, res ) {
  Campground.findByIdAndRemove( req.params.id, function ( err ) {
    if ( err ) {
      res.redirect( "/campgrounds" );
    } else {
      res.redirect( "/campgrounds" );
    }
  } );
} );

module.exports = router;