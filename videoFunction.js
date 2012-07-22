( function( global, $ ) {

  global.videoFunction = function( video ) {
    var p = Popcorn( video ),
        hoverConfig;

    var fadein = setInterval( function() {
        if ( volume < 1) {
          volume += 0.03;
          p.volume( volume );
        }
        else {
          clearInterval( fadein );
        }
      }, interval );

    function videoOver() {
      p.play();
      fadein();
    }

    hoverConfig = {
      over: videoOver,
      interval: 500
    };

    $( video ).hoverIntent( hoverConfig );

  };

}( window, window.jQuery ) );
