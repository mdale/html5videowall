( function( global, $ ) {

  global.videoFunction = function( video ) {
    var p = Popcorn( video ),
        hoverConfig;

    function videoOver() {
      p.play();
      p.volume( 1 );
    }

    hoverConfig = {
      over: videoOver,
      interval: 500
    };

    $( video ).hoverIntent( hoverConfig );

  };

}( window, window.jQuery ) );
