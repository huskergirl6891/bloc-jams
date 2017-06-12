var albumPicasso = {
    title: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Blue', duration: '4:26' },
        { title: 'Green', duration: '3:14' },
        { title: 'Red', duration: '5:01' },
        { title: 'Pink', duration: '3:21'},
        { title: 'Magenta', duration: '2:15'}
    ]
};

// Another Example Album
var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        { title: 'Hello, Operator?', duration: '1:01' },
        { title: 'Ring, ring, ring', duration: '5:01' },
        { title: 'Fits in your pocket', duration: '3:21'},
        { title: 'Can you hear me now?', duration: '3:14' },
        { title: 'Wrong phone number', duration: '2:15'}
    ]
};

var albumSandiego = {
    title: 'Where Am I?',
    artist: 'Carmen Sandiego',
    label: 'Global',
    year: '1985',
    albumArtUrl: 'assets/images/album_covers/18.png',
    songs: [
        { title: 'China', duration: '3:18' },
        { title: 'Brazil', duration: '2:46' },
        { title: 'France', duration: '4:53'},
        { title: 'Canada', duration: '1:24' },
        { title: 'Norway', duration: '3:37'}
    ]
};

var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;

     return $(template);
 };

var setCurrentAlbum = function(album) {
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

 var findParentByClassName = function(currentElement, targetClass){

   if (currentElement.parentElement == null) {
     console.log("No parent found");
   }

   else if (currentElement) {
     var temp = currentElement.parentElement;

     while (temp.className != targetClass && temp.className != null){

       temp = temp.parentElement;

       if (temp.className == null) {
         console.log("No parent found with that class name");
       }
     }
     return temp;



   }
};

var getSongItem = function(element) {
  switch(element.className) {
    case 'album-song-button':
    case 'ion-play':
    case 'ion-pause':
      return findParentByClassName(element, 'song-item-number');
    case "album-view-song-item":
      return element.querySelector('.song-item-number');
    case 'song-item-title':
    case 'song-item-duration':
      return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
    case 'song-item-number':
      return element;
    default:
      return;
  }
};

var clickHandler = function(targetElement) {
  var songItem = getSongItem(targetElement);

  if (currentlyPlayingSong === null) {
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
  } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
         songItem.innerHTML = playButtonTemplate;
         currentlyPlayingSong = null;
  } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
  }

 };

 var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
 var songRows = document.getElementsByClassName('album-view-song-item');

 // Album button templates
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var currentlyPlayingSong = null;


 window.onload = function() {
     setCurrentAlbum(albumPicasso);

     songListContainer.addEventListener('mouseover', function(event) {

       // Only target individual song rows during event delegation
       if (event.target.parentElement.className === 'album-view-song-item') {
           // Change the content from the number to the play button's HTML
           //event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;

           var songItem = getSongItem(event.target);

           if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
             songItem.innerHTML = playButtonTemplate;
           }
       }
     });

     for (var i = 0; i < songRows.length; i++) {
         songRows[i].addEventListener('mouseleave', function(event) {
             //this.children[0].innerHTML = this.children[0].getAttribute('data-song-number');
             // #1
             //console.log(event.target);
             var songItem = getSongItem(event.target);
             //console.log(songItem);
             var songItemNumber = songItem.getAttribute('data-song-number');

             // #2
             if (songItemNumber !== currentlyPlayingSong) {
               songItem.innerHTML = songItemNumber;
             }
         });

         songRows[i].addEventListener('click', function(event) {
             // Event handler call
             clickHandler(event.target);
         });
     }

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

 };
