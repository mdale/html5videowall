(function( global, $){
	
	var _this = {},
		urls = {
			'gnews' : 'https://ajax.googleapis.com/ajax/services/search/news?v=1.0&topic=el&alt=json-in-script&callback=?',
			'aorg' : 'http://archive.org/advancedsearch.php?q=%28{query}%29%20AND%20format:(Ogg%20video)&fl%5B%5D=downloads&fl%5B%5D=identifier&fl%5B%5D=language&fl%5B%5D=publicdate&fl%5B%5D=publisher&fl%5B%5D=source&fl%5B%5D=subject&fl%5B%5D=title&fl%5B%5D=year&sort%5B%5D=&sort%5B%5D=&sort%5B%5D=&rows=50&page=1&output=json&callback=?',
			'adownloadUrl' : 'http://www.archive.org/download/{id}/format={format}'
		},
		totalVideoCount = 20
	
	/* setup global ref */ 
	global.videoWall = _this;
	
	_this.build = function( target ){
		
		_this.$target = $( target );
		_this.$target.text('loading...');

		var hashTag = location.hash;
		if( hashTag != "" ){
			_this.buildWallForQuery( hashTag.substr(1) ); 
		} else { 
			_this.getNewsQuery( function( query ){
				location.hash = '#' + query;
				_this.buildWallForQuery( query );
			})
		}
		
		// Setup document bindings: 
		$( window ).bind('hashchange', function( event ) {
			var hashTag = location.hash;
			_this.buildWallForQuery( hashTag.substr(1) ); 
		});
	};
	
	_this.getNewsQuery = function( callback ){
		// get election news:
		$.getJSON( urls.gnews, function( data ){
			try{
				var articles = data.responseData.results;
				if( articles[0] && articles[0].titleNoFormatting ){
					callback( articles[0].titleNoFormatting );
				}
			} catch( e ){
				throw new Error("Sorry, no election news articles :( ( probably api key not valid ) ::" + e );
			}
		});
	};
	
	// handles a query displays a video wall from archive.org search. 
	_this.buildWallForQuery = function( query ){
		var query = query.replace(/ /g, ' OR ');
		var vidCount = 0;
		archiveUtil.searchTV( query, function( videoItems ) {
			$.each( videoItems, function( inx, doc ){
				if( vidCount > totalVideoCount){
					return ;
				}
				vidCount++;
				_this.$target.append(
					$('<video />').attr({
						'poster' : doc.thumb,
						'src': doc.video,
						'autoplay': true,
						'controls': true
					}).css({
						'width': '160px'
					}).data('meta', doc)
				);
			});
		});
	};

})( window, window.jQuery )
