<script>

    import { onMount, onDestroy } from 'svelte';
    import { load } from '../utilities/load.js';
    import { radioStatus, radioStream, radioTrack } from './helpers.js';
    import Player from './Player.svelte';
    import InspectData from './InspectData.svelte';

    /* config */
    export let id;
    const api = `https://public.radio.co/stations/${id}/status`;

    let data = {};
    let timestamp = 0;
    let status = radioStatus();
    let stream = radioStream( id );
    let track = radioTrack();

    /* fetch */
    function handleResult( result ){
        data = result;
        status = radioStatus( result );
        stream = radioStream( result, id );
        track = radioTrack( result );
        if( !stream || !track ){
            status = radioStatus(false);
        }
    }

    async function fetchInfo(){
        let result = await load( api );
        handleResult( result );
        timestamp = (new Date).toTimeString();
    }
    fetchInfo();

    let update = setInterval(()=>{
        fetchInfo();
    }, 10 * 1000);

    onDestroy(()=>{
        clearInterval(update);
    });

</script>

<section class="player">
    {#if status === 'loading'}
        <p class="stretch">Loading</p>
    {:else if status === 'online'}
        <div>
            <Player src={stream} />
        </div>
        <p class="stretch">{track}</p>
    {:else}
        <p class="stretch">Offline</p>
    {/if}
    <a href={stream} target="_blank">Open original audio stream</a>
</section>

<pre>Last updated {timestamp}</pre>

<section>
    <InspectData {data} />
</section>

<style lang="scss">

    .player {
        display: flex;
        align-items: center;
        > div {
            margin-right: 1em;
        }
        .stretch {
            flex: 1;
        }
    }

    a {
        text-decoration: underline;
    }

</style>
