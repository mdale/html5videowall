(function($){
	var urls = {
		'gnews' : 'https://ajax.googleapis.com/ajax/services/search/news?v=1.0&topic=el&alt=json-in-script&callback=?',
		'aorg' : 'http://archive.org/advancedsearch.php?q=%28{query}%29%20AND%20format:(Ogg%20video)&fl%5B%5D=downloads&fl%5B%5D=identifier&fl%5B%5D=language&fl%5B%5D=publicdate&fl%5B%5D=publisher&fl%5B%5D=source&fl%5B%5D=subject&fl%5B%5D=title&fl%5B%5D=year&sort%5B%5D=&sort%5B%5D=&sort%5B%5D=&rows=50&page=1&output=json&callback=?',
		'adownloadUrl' : 'http://www.archive.org/download/{id}/format={format}'
	};

	/* builds out a video wall with news */ 
	$.fn.videowall = function(){
		var $target = $( this.selector );
		$target.text('loading...');
		// get election news:
		$.getJSON( urls.gnews, function( data ){
			var articles = data.responseData.results;
			$target.text( '' );
			var videos = [];
 			var numOfVids = 0;
			$.each( articles, function( inx, article ){
				$target.append( '<h3>' + article.titleNoFormatting + '</h3><div id="art_' + inx +'"></div>' );
				getVideos( article.titleNoFormatting, function( doc ){
					if( numOfVids > 10 ){
						return ;
					}
					numOfVids++;

					$target.find('#art_' + inx )
					.append( 
						$('<video />').attr({
							'poster' : doc.thumb,
							'src': doc.video,
							'autoplay': true,
							'controls': true
						}).css({
							'width': '160px'
						})
					);
					
				});
				
			});
		});
		// Get videos from title text
		function getVideos( titleText, callback ){
			var query = titleText.replace(/ /g, ' OR ');
			archiveUtil.searchTV( query, function( docs ) {
				$.each( docs, function( inx, doc ){
					callback( doc );
				});
			});
		}
	};

})(jQuery)
