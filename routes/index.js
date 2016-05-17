
  var express = require('express');
  var router = express.Router();
  var MongoClient = require('mongodb').MongoClient;
  var mongo_url = "mongodb://localhost:27017/links";

  router.get('/', function(req, res) {
    res.status( 501 ).json({});
  });

  router.post( '/links', function( req, res, next ) {
    MongoClient.connect(mongo_url, function( err, db ) {
      if ( err ) {
        console.log( err );
      } else {
        var  link = req.body.link;
        var title = req.body.title;
        var collection = db.collection('links');
        var doc1 = { title : title, link : link, clicks : 0 };
        collection.insert( doc1, function( err, result ) {
          if ( err ) {
            console.log( err );
            res.status( 500 ).json( err );
          } else {
            if ( result ) {
              console.log( result );
              res.status( 200 ).json( result );
            } else {
              res.status( 404 ).json( { err: true, message : "Problem adding link."} );
            }
          }
        });
      }
    });
  });

  router.get( '/links', function( req, res, next ) {
    MongoClient.connect(mongo_url, function( err, db ) {
      if ( err ) {
        console.log( err );
        res.status( 500 ).json( err );
      } else {
        var collection = db.collection('links');
        var cursor = collection.find();
        var result = [];
        cursor.each( function( err, item ) {
          if ( err ) {
            console.log( err );
            res.status( 500 ).json( err );
          } else {
            if ( item ) {
              result.push( item );
            } else {
              res.status( 200 ).json( result );
            }
          }
        });
      }
    });
  });

  router.get( '/click/:title', function( req, res, next) {
    var title = req.params.title;
    MongoClient.connect( mongo_url, function( err, db ) {
      if ( err ) {
        console.log( err );
        res.status( 500 ).json( err );
      } else {
        console.log( title );
        var collection = db.collection( 'links' );
        var cursor = collection.findOne( { title : title }, function( err, result ) {
if ( result ) {
          result.clicks++;
          collection.updateOne( { _id : result._id }, result, function( err, result ) {
            res.status(200).json( result );
          });
} else {
res.status(404).json( { err : true, message : 'cannot find ' + title });
}
        });
      }
    });
  });

  module.exports = router;
