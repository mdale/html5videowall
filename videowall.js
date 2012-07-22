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
			_this.$target.html('loading ...');
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
		$('#vid-wall-title').text( query );
		var query = query.replace(/ /g, ' OR ');
		var vidCount = 0;
		archiveUtil.searchTV( query, function( videoItems ) {
			_this.$target.text('');
			$.each( videoItems, function( inx, doc ){
				if( vidCount > totalVideoCount){
					return ;
				}
				vidCount++;
				_this.$target
					.append( $("<div class=\"video-container\" />")
					.append(
						$('<video />').attr({
							'poster' : doc.thumb,
							'src': doc.video,
							'autoplay': true
						}).data('meta', doc)
					));
			});
		});
	};

    //share mouse position
    var lastMove=0;
    $(document).on('mousemove', function(evt) {
        var now = +new Date;
        if(now-lastMove > 100) {
            console.log(now-lastMove);
            console.log(evt);
            lastMove = now;
            connection.sendMessage({
                position: {x: evt.clientX, y: evt.clientY}
            });
        }
    });

    // websocket connection, bind events with
    //   connection.onMessage(callback)
    //
    //   to send messages to all other users:
    //   connection.sendmessage({a: b})
    //
    // make local
    var connection = global.connection = (function() {
        var that = {},
            userId = Math.round(Math.random() * 10000000000000),
            callbacks = [],
            ws;

        that.sendMessage = function(data) {
            message = JSON.stringify({
                user: userId,
			    hash: location.hash,
                data: data
            })
            ws.send(message)
        }
        that.onMessage = function(callback) {
            callbacks.push(callback);
        }
        connect();
        function connect() {
            ws = new WebSocket('ws://r-w-x.org:8044/');
            ws.onclose = function(evt) {
                console.log('closed', evt)
                connect();
            }
            ws.onmessage = function(evt) {
                var data = JSON.parse(evt.data);
                if (data.user != userId && data.hash == location.hash) {
                    console.log('got message', data);
                    callbacks.forEach(function(callback) {
                        callback(data);
                    })
                }
            }
        }
        return that;
    })();


})( window, window.jQuery )
