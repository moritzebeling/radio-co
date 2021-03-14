<script>

    import { parseTime } from '../utilities/time.js';

    /*
    event handlers
    */
    function handlePlay(){
        console.log('play');
    }
    function handlePause(){
        console.log('pause');
    }

    /*
    playback time
    */
    let seconds = 0;
    $: time = parseTime( seconds );

</script>

<button on:click={handlePlay}>Play</button>
<button on:click={handlePause}>Pause</button>

<p>Playtime in seconds {time}</p>
