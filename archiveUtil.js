( function( global, $ ) {

    // URL param
    $.urlParam = function(name){
      var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
      return results && results[ 1 ] || "camels";
    };

    var _this = {},
        windowParam = $.urlParam( "name" ),
        baseUrl = "http://archive.org/",
        searchPath = "advancedsearch.php",
        detailsPath = "details/",
        downloadPath = "download/",
        ogvURL = "http://archive.org/download/" + windowParam + "/format=Ogg+video",
        jsonP = "&output=json&callback=?";

    // Set up reference
    global.archiveUtil = _this;

    // ********************************
    // Searches for a query

    _this.search = function( query, callback ) {
      var url = baseUrl + searchPath;

      // Return the useful data
      function _callback( data ) {
        callback( data.response.docs );
      }
    
      // remove any unsafe query parmas:
      query = query.replace(':', '');
      
      
      // Create object if it's a string
      if ( typeof query === "string" ) {
        query = {
          q: query
        };
      }

      // Archive needs this
      query.output = "json";

      $.ajax({
        url: url,
        dataType: "jsonP",
        data: query,
        success: _callback
      });
    };

    // ********************************
    // Gets detailed info for an identifier, id

    _this.details = function( id, callback ) {
      var url = baseUrl + detailsPath + id;
      $.ajax({
        url: url,
        dataType: "jsonP",
        data: {
          output: "json"
        },
        success: callback
      });
    };

    // ********************************
    // Makes the download link given a format

    _this.downloadFile = function( id, format ) {
      var url = baseUrl + downloadPath + id + "/format=";
      if ( format === "ogv" ) {
        url += "Ogg+video";
        console.log( url );
        return url;
      }
    };

    // ********************************
    // Searches the TV archive given a query

    _this.searchTV =  function( query, callback ) {
      var url = baseUrl + detailsPath + "tv";
      query = {
        q: query,
        output: "json"
      };
      $.ajax({
        url: url,
        dataType: "jsonP",
        data: query,
        success: callback
      });
    };

    // ********************************
    // Gets files of a particular type and returns an array

    _this.getFiles = function( files, type ) {
      var result = [];
      type = "." + type + "$"; //regex
      $.each( files, function( fileURL, fileMetaData ) {
        if ( fileURL.search( type ) !== -1 ) {
          result.push( fileURL );
        }
      });
      return result;
    };


}( window, window.jQuery ) );
