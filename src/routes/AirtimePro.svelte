<script>

    import Player from '../modules/Player-2.svelte';
    import CurrentlyPlaying from '../modules/CurrentlyPlaying.svelte';
    import InspectData from '../modules/InspectData.svelte';

    /* Config */
    const id = 'eosradiohidden';
    const api = `https://${id}.airtime.pro/api/live-info-v2`;
    const stream = `https://${id}.out.airtime.pro/${id}_a`;
    const website = `https://${id}.airtime.pro`;

    function track( data ){
        try {
            return `${data.tracks.current.metadata.artist_name} – ${data.tracks.current.metadata.track_title}`;
        } catch (error) {
            return 'No track';
        }
    }

</script>

<main>

    <header>
        <h1>Airtime Pro <i>{id}</i></h1>
        <a class="button" href={website} target="_blank">Website</a>
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
