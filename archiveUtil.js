/* Author:

*/
( function( Popcorn ) {
  document.addEventListener( "DOMContentLoaded", function(){

    var HEADER_HEIGHT = 150,
        switched = false,
        baseURL = "http://archive.org/advancedsearch.php",
        DEMO_TAG = "2012elections",  // local_political_ad
        detailsBaseURL = "http://archive.org/details/";
    function each( list, callback ) {
      var i;
      for( i=0; i<list.length; i++ ) {
        callback( list[ i ] );
      }
    }

    function getArchive( query ) {
      $.ajax({
        url: baseURL,
        "data": query,
        dataType: "jsonP",
        success: function( data ) {
          var response = data.response.docs,
              details;
          for( var i=0; i<2; i++ ) {
            details =  detailsBaseURL + response[ i ].identifier;
            console.log( details );
            $.ajax({
              url: details + "?output=json",
              dataType: "jsonP",
              success: function( data2 ) {
                console.log( data2 );
              }
          });
          }
         
        }
      });
    }

    getArchive({
      q: DEMO_TAG,
      mediatype: "movies",
      subject: "local_political_ad",
      output: "json"
    });

    // POPCORN

    var p = Popcorn( "#video" );
    p.googlemap({
     "start": 1,
      "end": 10,
      "target": "map",
      "zoom": "15",
      "location": "Toronto, Ontario, Canada"
    });



  }, false);

}( window.Popcorn ) );
