<svelte:head>

  // !!!!! The jQuery Version used here can be used for XSS!!
  <script src="https://code.jquery.com/jquery-1.11.3.min.js" on:load={jqueryLoaded}></script>
  <script src="https://public.radio.co/playerapi/jquery.radiocoplayer.min.js" on:load={radiocoPlayerAPILoaded}></script>
</svelte:head>


<script>


  import { onMount } from 'svelte';
  import { parseTime } from '../utilities/time.js';

  // FUCK this weird ass piece of shit. Not working
  //import '../utilities/status.js';


  // ..............................................
  // Init Player
  // ..............................................

  // Race Condition of loading jquery, the player API or the DOM elements can occur

  let mounted = false;
  let jqueryReady = false;
  let radiocoPlayerAPIReady = false;

  var radiocoPlayer = null;

  onMount(() => {
          mounted = true;
          console.log("Mounted");

          if (everythingReady()) {
              initRadiocoPlayer();
          }

      });

  function jqueryLoaded(){
          jqueryReady = true;
          console.log("jQuery Loaded");

          if (everythingReady()) {
              initRadiocoPlayer();
          }
      }

  function radiocoPlayerAPILoaded(){
          radiocoPlayerAPIReady = true;
          console.log("RadioCo Player API Loaded");

          if (everythingReady()) {
              initRadiocoPlayer();
          }
      }

  function everythingReady(){
    if (mounted && jqueryReady && radiocoPlayerAPIReady)
      return true;
    else
      return false;
  }


  function initRadiocoPlayer(){
    radiocoPlayer = window.$('.radioplayer').radiocoPlayer(); // $ is reserved for svelte. Use window.$ for jquery instead
    console.log("Init radioplayer");

    createRadiocoPlayerEventHandlers();
  };

  let radiocoStatusAPIReady = false;
  let statusEmbed;

  function radiocoStatusAPILoaded(){
          radiocoStatusAPIReady = true;
          console.log("RadioCo Status API Loaded");
      }



  // ..............................................
  // Create Player Event Handlers
  // ..............................................

  let streamReady = false;
  let audioPlaying = false;

  let seconds = 0;
  $: time = parseTime( seconds );

  let imgSrc = "No Artwork";
  function createRadiocoPlayerEventHandlers(){

    radiocoPlayer.event('audioLoaded', function(){
      streamReady = true;
      imgSrc = radiocoPlayer.getArtwork(500,500,75);
      console.log("Radio stream has loaded")
    });


    radiocoPlayer.event('audioPlay', function(){
      audioPlaying = true;
      console.log("Audio start requested")
    });

    radiocoPlayer.event('audioPause', function(){
      audioPlaying = false;
      console.log("Audio pause requested")
    });

    radiocoPlayer.event('timeUpdate', function(e){
	     seconds = e.newTime;
     });

    window.$('.radioplayer').onplay = function(){
      audioPlaying = false;
      console.log("Audio starting")
    };

  };

  // ..............................................
  // Create Player Interactions
  // ..............................................

  function getStreamStatus(){
      if(streamReady){
        let streamStatus = radiocoPlayer.getStreamState();
        console.log(streamStatus);
      }
  }

  /*
  event handlers
  */
  function handlePlayButton(){
      console.log('Play button clicked');
      if(streamReady){
        radiocoPlayer.play();

      }
  }

  function handlePauseButton(){
    console.log('Pause button clicked');
    if(streamReady){
      radiocoPlayer.pause();
    }
  }



</script>


  <button on:click={handlePlayButton}>Play</button>
  <button on:click={handlePauseButton}>Pause</button>


<span class="radioplayer"
  	data-src="https://s2.radio.co/s71e070cf3/listen"
  	data-playbutton="false"
  	data-volumeslider="false"
  	data-elapsedtime="false"
  	data-nowplaying="false"
  	data-showplayer="false"
  	data-albumArtwork="false"></span>

<br>
<div class="status">Player Status: {#if !streamReady}Initialized{:else}Loaded{/if}</div>
<div class="artwork">Artwork: <a href="{imgSrc}"> {imgSrc} </a></div>


<p>Playtime in seconds: {time}</p>


<br>
<br>
<span>Embed Code</span>
<embedscript></embedscript>
