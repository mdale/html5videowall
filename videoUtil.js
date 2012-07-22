( function( global, $ ) {

	$.fn.fadeInAudio = function(){
		$vid = $( this.selector );
		
		var interval = 0;
		var volume = $vid.attr('volume');
		setInterval( function() {
			if ( volume < 1) {
				volume += 0.03;
				$vid.attr('volume', volume );
			} else {
				clearInterval( interval );
			}
		}, interval );
		
		return this;
	}
	
	$.fn.fadeOutAudio = function(){
		$vid = $( this.selector );
		
		var interval = 0;
		var volume = $vid.attr('volume');
		setInterval( function() {
			if ( volume > .5 ) {
				volume -= 0.03;
				$vid.attr('volume', volume );
			} else {
				clearInterval( interval );
			}
		}, interval );
		
		return this;
	}
	
	/*
	$.fn.animateAttr = function ( attrSet, duration ){
		var startTime = new Data();
	}
	*/

}( window, window.jQuery ) );
