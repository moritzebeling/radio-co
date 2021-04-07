<script>

    import Player from '../modules/Player-2.svelte';
    import CurrentlyPlaying from '../modules/CurrentlyPlaying.svelte';
    import InspectData from '../modules/InspectData.svelte';

    /* Config */
    const id = 'sa641441d4';
    const api = `https://public.radio.co/stations/${id}/status`;
    const stream = `https://stream.radio.co/sa641441d4/listen`;

    function track( data ){
        try {
            return `${data.current_track.title}`;
        } catch (error) {
            return 'No track';
        }
    }

</script>

<main>

    <header>
        <h1>Radio.co <i>{id}</i></h1>
        <a class="button" href={stream} target="_blank">Website</a>
    </header>

    <div class="player">
        <Player src={stream} />
    </div>

    <div class="api">
        <CurrentlyPlaying endpoint={api} let:prop={data}>
            <div>
                Currently playing: {track(data)}
            </div>
            <InspectData {data} />
        </CurrentlyPlaying>
    </div>

</main>

<style lang="scss">

    header {
        margin: 1rem;
        display: flex;
        justify-content: space-between;
    }

</style>
