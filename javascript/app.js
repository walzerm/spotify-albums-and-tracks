// Self envoking function! once the document is ready, bootstrap our application.
// We do this to make sure that all the HTML is rendered before we do things 
// like attach event listeners and any dom manipulation.  
(function(){
  $(document).ready(function(){
    bootstrapSpotifySearch();
  })
})();

/**
  This function bootstraps the spotify request functionality.
*/
function bootstrapSpotifySearch(){

  var userInput, searchUrl, results;
  var outputArea = $("#q-results");

  $('#spotify-q-button').on("click", function(){
      var results = $("<h3>Spotify Search Results:</h3>");
      $(".put-search").append(results);
      var spotifyQueryRequest;
      spotifyQueryString = $('#spotify-q').val();
      searchUrl = "https://api.spotify.com/v1/search?type=artist&q=" + spotifyQueryString;

      // Generate the request object
      spotifyQueryRequest = $.ajax({
          type: "GET",
          dataType: 'json',
          url: searchUrl
      });

      // Attach the callback for success 
      // (We could have used the success callback directly)
      spotifyQueryRequest.done(function (data) {
        var artists = data.artists;

        // Clear the output area
        outputArea.html('');

        // The spotify API sends back an arrat 'items' 
        // Which contains the first 20 matching elements.
        // In our case they are artists.
        artists.items.forEach(function(artist){
          
          var artistLi = $("<li>" + artist.name + "</li>")
          artistLi.attr('data-spotify-id', artist.id);
          
          outputArea.append(artistLi);

          artistLi.click(displayAlbumsAndTracks);
        })
      });

      // Attach the callback for failure 
      // (Again, we could have used the error callback direcetly)
      spotifyQueryRequest.fail(function (error) {
        console.log("Something Failed During Spotify Q Request:")
        console.log(error);
      });
  });
}
/* COMPLETE THIS FUNCTION! */



function displayAlbumsAndTracks(event) {
  $("#albums-and-tracks").empty();
  var appendToMe = $('#albums-and-tracks');

  // These two lines can be deleted. They're mostly for show. 
  var spotifyArtistID = $(event.target).attr('data-spotify-id');//.attr('data-spotify-id'));

  var getArtistsAlbumsURL = 'https://api.spotify.com/v1/artists/' + spotifyArtistID + '/albums';
  var albumName;
  var albumID;
  spotifyAlbumRequest = $.ajax({
    type: "GET",
    dataType: 'json',
    url: getArtistsAlbumsURL
  })
  spotifyAlbumRequest.done( function(data){
    var artistAlbumObject = data;
    artistAlbumObject.items.forEach(function(item){
      albumName = item.name;
      albumID = item.id;
      $('#albums-and-tracks').append('<div class=' + albumID + '><h4>' + albumName + '</h4></div>');
      $("." + albumID).append("<ol id=" + albumID + "></ol>");
        getAlbumReleaseYear(albumID);
        getTrackNames(albumID);


    })
  })
}

function getTrackNames(albumID) {
   var getTracksURL = "https://api.spotify.com/v1/albums/" + albumID + "/tracks";
        var spotifyTrackRequest = $.ajax({
        type: "GET",
        dataType: 'json',
        url: getTracksURL
        })
        spotifyTrackRequest.done(function(data){
          var trackObject = data;
          var trackArray = [trackObject];
          trackArray.forEach(function(album) {
            //console.log(album);
            album.items.forEach(function(track) {
              var trackPopularityFunction = getTrackPopularity(track.id);
              trackPopularityFunction.then(function(trackPopularity){
                $("#" + albumID).append("<li>" + track.name + "  ( Popularity: "+ trackPopularity.popularity + " )</li>");
              });
            });
          });
        });

}

function getAlbumReleaseYear(albumID) {
  var getAlbumURL = "https://api.spotify.com/v1/albums/" + albumID;
        var spotifyAlbumRequest = $.ajax({
        type: "GET",
        dataType: 'json',
        url: getAlbumURL
        })
        spotifyAlbumRequest.done(function(singleAlbum) {
          $("#" + albumID).prepend("<p><h5> Album Release Date - " +singleAlbum.release_date + "</h5></p>");
        })
}

function getTrackPopularity(trackID) {
  getIndivTrackURL = "https://api.spotify.com/v1/tracks/" + trackID;
  var spotifyTrackRequest = $.ajax({
        type: "GET",
        dataType: 'json',
        url: getIndivTrackURL
        })
  return spotifyTrackRequest
}
