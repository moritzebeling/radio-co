<script>
  import { parseTime } from '../utilities/time.js';


  var audioPlayer = null;
  var timestamp = new Date().getTime();
  var radioUrl ="http://134.122.90.200";


  ////////////////////////////////
  // Stream
  ///////////////////////////////

  var radioStreamUrl = radioUrl + ":8000/radio.mp3?i" + timestamp; // Port has to be explicit
                                                                   // Time stamp to trick chrome -> Apparently helps freeing audio sockets

  // Audio "object". Can be stream, can be mp3 file, etc.
  function Audio(src, format) {
    this.src = src;
    this.format = format;
      }

  var radioAudio = new Audio([radioStreamUrl], ['mp3'] );

  ////////////////////////////////
  // Howler
  ///////////////////////////////

  // Howler buffer behavior switch
  import {Howl as Howl_oncanplaythrough, Howler as Howler_oncanplaythrough} from '../utilities/howler-oncanplaythrough.js';
  import {Howl as Howl_oncanplay,Howler as Howler_oncanplay} from '../utilities/howler-oncanplay.js';

  var Howl, Howler = null;
  function canPlayEventSwitch(canPlayEventString)
  {
    if(canPlayEventString === 'oncanplaythrough'){
      Howl = Howl_oncanplaythrough;
      Howler = Howler_oncanplaythrough;
      console.log('Tis oncanplaythrough');

    }
    else if (canPlayEventString === 'oncanplay'){
      Howl = Howl_oncanplay;
      Howler = Howler_oncanplay;
      console.log('Tis oncanplay');
    }

    adaptHowlerBehavior();
    adaptHowlBehavior();
  }

  var canPlayEvent = 'oncanplaythrough';
  canPlayEventSwitch(canPlayEvent);



  // Adapt Howler & Howl behavior

  function adaptHowlerBehavior(){
    Howler.autoUnlock = false; // Chromium blocks autoplay, so Howler cant't
                               // silently unlock audio playback. To prevent a
                               // warning when the Howler Object is created, this
                               // has to be set to false
  }

  function adaptHowlBehavior(){
    Howl.prototype.changeSong = function(o) {
      var self = this;
      self.unload(); // Apparantly there are issues with IOS if not unloaded before changing track and playing. This is making sure that it works
      self._duration = 0; // init duration
      self._sprite = {};// init sprite
      self._src = typeof o.src !== 'string' ? o.src : [o.src];
      self._format = typeof o.format !== 'string' ? o.format : [o.format];
      self.load(); // => update duration, sprite(var timeout)
      };
    }


  // Audio player with Howler
  var audioPlayerExists = false;
  var buffering = false;
  var loaded = false;
  function createAudioPlayer(audio) {
    if (audioPlayer == null) {
      audioPlayer = new Howl({
        src: audio.src,
        html5: true, // A live stream can only be played through HTML5 Audio. It's 2021, so HTML5 should be standard
        format: audio.format,
        preload: true, // Live stream can't be preloaded
        autoplay: false,
        loop: false,
        volume: 1,
        onplay: handleSoundStart
      });

      audioPlayerExists = true;
      console.log('Created Radio player');
    }
    else {
        audioPlayer.changeSong(audio);
    }
  }

  function removeAudioPlayer() {
    if(audioPlayer !== null){
    audioPlayer.unload();       //Unload and destroy a Howl object. This will immediately stop all sounds attached to this sound and remove it from the cache.
    audioPlayer = null;     // JS got garbage collector, so throwing away the pointer is enough
    audioPlayerExists = false;
    }
  }

  ////////////////////////////////
  // AzuraCast API
  ///////////////////////////////

  // nowPlayingInfo "object". Can be stream, can be mp3 file, etc.
  var nowPlayingInfo = null;
  var nowPlayingInfoLoaded = false;

  function nowPlaying(nowPlayingData)
  {
    this.data = nowPlayingData;

    this.live = this.data.live.is_live;

    this.station_name = this.data.station.name; // Should be "EOSRadio" obv.
    this.station_description = this.data.station.description

    this.current_artist = this.data.now_playing.song.artist;
    this.current_title = this.data.now_playing.song.title;
  }

  // DO NOT HARDCODE!!!!!
  var stationAPIKey = '9fcf2a200ca93f18:222d6ad3e86946f7dbcff249dfe470bc'; // Pretty sure this should be set by ENV and not be hardcoded!!!
  // DO NOT HARDCODE!!!!

  var stationAPIUrl = radioUrl + ':80/api';
  var stationAPIUrl_nowplaying = stationAPIUrl + '/nowplaying/1';

  // talk to api via fetch promise. Chrome support: 04/15, Firefox: 08/15, Safari 03/17
  function fetchStationAPI(url,responseCallback, errorCallback)
  {
    fetch(url, {
      header : {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + stationAPIKey,
      }


    })
    .then((response) => response.json().then((data) => responseCallback(data)))
    .catch((error) => errorCallback(error));
  }

  function getNowPlayingInfo(){

    let responseCallback = function(responseData){
      console.log("Got nowPlaying Info");
      console.log(responseData);

      nowPlayingInfo = new nowPlaying(responseData);

      nowPlayingInfoLoaded = true;
    }

    let errorCallback = function(nowPlayingError){
      console.log("Oh dear, couldn't fetch nowPlaying Info :( Trying again in 30 sec" );
      console.log(nowPlayingError);
    }

    fetchStationAPI(stationAPIUrl_nowplaying, responseCallback, errorCallback);

  }

  getNowPlayingInfo();



  ////////////////////////////////
  // Event handlers
  ///////////////////////////////

  function handleCanPlayEventChange(){
    removeAudioPlayer();
    canPlayEventSwitch(canPlayEvent);
  }

  // Handle button click to create player
  // This way, bc. if player is created right away,
  // the stream starts loading right away. Therefore
  // the different behavior of the oncanplay/oncanplaythrough
  // events wouldn't be so different - the buffer would
  // have a head start
  function handleCreatePlayer(){
      createAudioPlayer(radioAudio);
      console.log('Created player');
  }

  function handlePlay(){
      buffering = true;
      getNowPlayingInfo();
      audioPlayer.play();
      console.log('Pressed play');
  }

  function handlePause(){
      audioPlayer.pause();
      console.log('pause');
  }

  function handleSoundStart(){
      buffering = false;
      loaded = true;
      console.log('Sound start');
  }




  /*
  playback time
  */
  let seconds = 0;
  $: time = parseTime( seconds );
</script>





<style>
  .canPlayEventSwitch{
    margin-top: 5em;
    margin-left: 5em;
  }

  .playerContainer{
    margin-top: 2em;
    margin-left: 5em;
    margin-bottom: 5em;
  }

  .blinking {
            animation: blinkingText 1s infinite;
        }

  @keyframes blinkingText {
      0% {
          opacity: 0;
      }
      50% {
          opacity: .5;
      }
      100% {
          opacity: 1;
      }
  }

  .nowPlayingInfo.live
  {
    color: green;
  }

  .nowPlayingInfo.notlive
  {
    color: red;
  }



</style>






<div class="canPlayEventSwitch">
  <h3>canPlayEvent</h3>
  <br>
  <label>
  	<input type=radio bind:group={canPlayEvent} value={'oncanplaythrough'} on:change={handleCanPlayEventChange}>
  	oncanplaythrough
  </label>
  <label>
  	<input type=radio bind:group={canPlayEvent} value={'oncanplay'} on:change={handleCanPlayEventChange}>
  	oncanplay
  </label>
</div>

<div class="playerContainer">

  {#if !audioPlayerExists}
    <div class="createPlayerButton">
      <button on:click={handleCreatePlayer}>Create Player</button>
    </div>
  {:else if audioPlayerExists}
    <div class="player">
      <h3>Player</h3>
      <br>
      <button on:click={handlePlay}>Play</button>
      <button on:click={handlePause}>Pause</button>
      <br>
      <br>

      {#if buffering}
        <p class="buffer_indicator blinking"> Buffering </p>
      {:else if loaded && !nowPlayingInfoLoaded}
        <p class="nowPlayingInfoLoading_indicator blinking"> Loading Info </p>
      {:else if loaded && nowPlayingInfoLoaded}
        <p class="nowPlayingInfo"> station = {nowPlayingInfo.station_name} </p>
        <p class="nowPlayingInfo"> description = {nowPlayingInfo.station_description} </p>
        <br>
        {#if nowPlayingInfo.live}
          <p class="nowPlayingInfo live">Live</p>
        {:else}
          <p class="nowPlayingInfo notlive">Not live, streamed playlist</p>
        {/if}
        <br>
        <p class="nowPlayingInfo"> artist = {nowPlayingInfo.current_artist} </p>
        <p class="nowPlayingInfo"> song = {nowPlayingInfo.current_title} </p>
      {/if}

    </div>
  {/if}

</div>





<!--
<p>Playtime in seconds {time}</p>
-->
