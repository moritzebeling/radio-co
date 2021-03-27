<script>

  import {onMount}  from 'svelte';
  import {parseTime} from '../utilities/time.js';


  var audioPlayer = null;
  var timestamp = new Date().getTime();

  export let id;
  var radioUrl = `https://${id}.out.airtime.pro`;

  ////////////////////////////////
  // Stream
  ///////////////////////////////

  var radioStreamUrl = radioUrl + `/${id}_a?i` + timestamp; // Port has to be explicit
                                                                   // Time stamp to trick chrome -> Apparently helps freeing audio sockets

  // Audio "object". Can be stream, can be mp3 file, etc.
  function Audio(src, format) {
    this.src = src;
    this.format = format;
      }

  function Stream(src, format){
    Audio.call(this, src, format);
    this.type="stream";
  }

  function File(src, format){
    Audio.call(this, src, format);
    this.type="file";
  }

  var radioAudio = new Stream([radioStreamUrl], ['mp3'] );

  ////////////////////////////////
  // Howler
  ///////////////////////////////

  import {Howl, Howler} from 'howler';

  //Howler buffer behavior switch
  let howlerBufferBehaviorSwitchFlag = false;
  import {Howl as Howl_oncanplaythrough, Howler as Howler_oncanplaythrough} from '../utilities/_legacy/howler-oncanplaythrough.js';
  import {Howl as Howl_oncanplay,Howler as Howler_oncanplay} from '../utilities/_legacy/howler-oncanplay.js';

  if(howlerBufferBehaviorSwitchFlag){
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
    }
    var canPlayEvent = 'oncanplaythrough';
    canPlayEventSwitch(canPlayEvent);
  }

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

  adaptHowlerBehavior();
  adaptHowlBehavior();


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
        preload: audio.type ? "file" : false, // Live stream can't be preloaded
        autoplay: false,
        loop: false,
        volume: 1,
        onplay: handleSoundStart,
        onpause: handleSoundStop
      });

      audioPlayerExists = true;
      console.log('Created radio player');
    }
    else {
      audioPlayer.changeSong(audio);
    }
  }

  function removeAudioPlayer() {
    if(audioPlayer !== null){
    audioPlayer.unload();       // Unload and destroy a Howl object. This will immediately stop all sounds attached to this sound and remove it from the cache.
    audioPlayer = null;         // JS got garbage collector, so throwing away the pointer is enough
    audioPlayerExists = false;
    }
  }

  // Event handlers
  //////////////////////////////

  if(howlerBufferBehaviorSwitchFlag){
    function handleCanPlayEventChange(){
      removeAudioPlayer();
      canPlayEventSwitch(canPlayEvent);
    }
  }
  else{
    let handleCanPlayEventChange = null;
  }

  function handleCreatePlayer(audio){
      console.log('Creating player');
      createAudioPlayer(audio);
  }

  var playLock = false;
  function handlePlay(){
    if(!playLock){
      playLock = true;
      buffering = true;
      audioPlayer.play();
      console.log('Pressed play');
    }
  }

  function handlePause(){
      audioPlayer.pause();
      console.log('Pressed pause');
  }

  function handleSoundStart(){
      buffering = false;
      loaded = true;
      console.log('Sound start');
  }

  function handleSoundStop(){
      playLock = false;
      console.log('Sound stop');
  }

  /*
  playback time
  */
  let seconds = 0;
  $: time = parseTime( seconds );

  /////////////////////
  // OnMount
  ////////////////////

  onMount(() => {
    console.log("Document mounted");
    handleCreatePlayer(radioAudio);
    }
  );

</script>



<style>

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
</style>

{#if howlerBufferBehaviorSwitchFlag}
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
{/if}



<div class="playerContainer">
  {#if howlerBufferBehaviorSwitchFlag && !audioPlayerExists}
    <div class="createPlayerButton">
      <button on:click={handleCreatePlayer}>Create Player</button>
    </div>
  {:else}
    <div class="player">
      <h3>Player</h3>
      <br>
      {#if !playLock}
        <button          on:click={handlePlay}>Play</button>
        <button disabled on:click={handlePause}>Pause</button>
      {:else if playLock}
        <button disabled on:click={handlePlay}>Play</button>
        <button          on:click={handlePause}>Pause</button>
      {/if}

      <br>
      <br>

      {#if buffering}
        <p class="buffer_indicator blinking"> Buffering </p>
      {/if}

    </div>
  {/if}

</div>





<!--
<p>Playtime in seconds {time}</p>
-->
