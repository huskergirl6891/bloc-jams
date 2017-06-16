var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

     var $row = $(template);

     var clickHandler = function() {
         // clickHandler logic
         var songNumber = parseInt($(this).attr('data-song-number'));

         if (currentlyPlayingSongNumber !== null) {
                //var currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
                var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
                currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
         }

         if (currentlyPlayingSongNumber !== songNumber) {
                setSong(songNumber);
                currentSoundFile.play();
                $(this).html(pauseButtonTemplate);
                currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
                updatePlayerBarSong();
         }

         else if (currentlyPlayingSongNumber === songNumber) {
                if(currentSoundFile.isPaused()) {
                  $(this).html(pauseButtonTemplate);
                  $('.main-controls .play-pause').html(playerBarPauseButton);
                  currentSoundFile.play();
                }
                else {
                  $(this).html(playButtonTemplate);
                  $('.main-controls .play-pause').html(playerBarPlayButton);
                  currentSoundFile.pause();
                }
         }
     };

     var onHover = function(event) {
         //Refactored using jquery
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberCell.attr('data-song-number'));

         if (songNumber !== parseInt(currentlyPlayingSongNumber)) {
             songNumberCell.html(playButtonTemplate);
         }

     };
     var offHover = function(event) {

       var songNumberCell = $(this).find('.song-item-number');
       var songNumber = parseInt(songNumberCell.attr('data-song-number'));

       //console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);

       if (songNumber !== parseInt(currentlyPlayingSongNumber)) {
           songNumberCell.html(songNumber);
       }
     };

     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };

var setCurrentAlbum = function(album) {
     currentAlbum = album;
     // #1
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');

     // #2
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);

     // #3
     $albumSongList.empty();

     // #4
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
 };

 var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
 };

 var nextSong = function() {

   //get index of current song
   var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
   //next song = index + 1
   currentSongIndex += 1;

   var previousSongNumber = currentlyPlayingSongNumber;

   //if index is last song in the list
   if(currentSongIndex == currentAlbum.songs.length) {
     //next song is the first song in the the list
     currentSongIndex = 0;
   }

   //set new current song to currentSongFromAlbum
   setSong(currentSongIndex + 1);
   currentSoundFile.play();

   //update player bar to show new song
   updatePlayerBarSong();

   //var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
   var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
   //var $lastSongNumberCell = $('.song-item-number[data-song-number="' + previousSongNumber + '"]');
   var $lastSongNumberCell = getSongNumberCell(previousSongNumber);

   //update html of new song's .song-item-number with pause button
   $nextSongNumberCell.html(pauseButtonTemplate);

   //update html of previous song .song-item-number element with the song number
   $lastSongNumberCell.html(previousSongNumber);
 };

 var previousSong = function() {

   var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

   currentSongIndex -= 1;

   //if index is first song in the list
   if(currentSongIndex < 0) {
     //previous song is the last song in the the list
     currentSongIndex = currentAlbum.songs.length - 1;
   }

   //store initial song number before changing
   var lastSongNumber = currentlyPlayingSongNumber;

   //set new current song to currentSongFromAlbum
   setSong(currentSongIndex + 1);
   currentSoundFile.play();

   //update player bar to show new song
   updatePlayerBarSong();

   //var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
   var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
   //var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
   var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

   //update html of new song's .song-item-number with pause button
   $previousSongNumberCell.html(pauseButtonTemplate);

   //update html of previous song .song-item-number element with the song number
   $lastSongNumberCell.html(lastSongNumber);

 };

 var setSong = function(songNumber) {
   if (currentSoundFile) {
         currentSoundFile.stop();
   }

   currentlyPlayingSongNumber = songNumber;
   currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
   currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
         // #2
         formats: [ 'mp3' ],
         preload: true
     });

     setVolume(currentVolume);
 };

 var getSongNumberCell = function(number) {
   return $('.song-item-number[data-song-number="' + number + '"]');
 };

 var updatePlayerBarSong = function() {
   $('.currently-playing .song-name').text(currentSongFromAlbum.title);
   $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
   $('.currently-playing .artist-name').text(currentAlbum.artist);
   $('.main-controls .play-pause').html(playerBarPauseButton);

 };

 var setVolume = function(volume) {
   if (currentSoundFile) {
         currentSoundFile.setVolume(volume);
     }
 };

 var togglePlayFromPlayerBar = function() {
   var $currentSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
   if(currentSoundFile.isPaused()) {
     $currentSongNumberCell.html(pauseButtonTemplate);
     $('.main-controls .play-pause').html(playerBarPauseButton);
     currentSoundFile.play();
   }
   else {
     $currentSongNumberCell.html(playButtonTemplate);
     $('.main-controls .play-pause').html(playerBarPlayButton);
     currentSoundFile.pause();
   }
 };

 // Album button templates
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';

 var currentAlbum = null;
 var currentlyPlayingSongNumber = null;
 var currentSongFromAlbum = null;
 var currentSoundFile = null;
 var currentVolume = 80;

 var $previousButton = $('.main-controls .previous');
 var $nextButton = $('.main-controls .next');
 var $toggleButton = $('.main-controls .play-pause');

 $(document).ready(function() {
     setCurrentAlbum(albumPicasso);
     $previousButton.click(previousSong);
     $nextButton.click(nextSong);
     $toggleButton.click(togglePlayFromPlayerBar);

     var temp = 1;
     var albums = [albumPicasso, albumMarconi, albumSandiego];
     document.getElementsByClassName('album-cover-art')[0].addEventListener("click", function(event){
       setCurrentAlbum(albums[temp]);
       if(temp == albums.length - 1){
         temp = 0;
       }
       else {
         temp = temp + 1;
       }

     });

 });
