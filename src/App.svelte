<script>


    import Player from './modules/Player.svelte';

    /* Airtime Pro Widgets */
    import EmbedPlayer from './widgets/EmbedPlayer.svelte';
    import Schedule from './widgets/Schedule.svelte';

    /* API */
    import LiveInfo from './modules/api-examples/LiveInfo.svelte';
    import WeekInfo from './modules/api-examples/WeekInfo.svelte';
    import StationMetaData from './modules/api-examples/StationMetaData.svelte';
    import Shows from './modules/api-examples/Shows.svelte';
    import PlayoutHistoryFeed from './modules/api-examples/PlayoutHistoryFeed.svelte';
    import ShowTracks from './modules/api-examples/ShowTracks.svelte';
    import ShowSchedule from './modules/api-examples/ShowSchedule.svelte';

    import CurrentlyPlaying from './modules/CurrentlyPlaying.svelte';

    /* Custom Player */

    /* Config */
    const id = 'eosradiohidden';
    const host = `https://${id}.airtime.pro`;

</script>

<main>

    <header>
        <h1><i>{host}</i></h1>
        <a class="button" href={host} target="_blank">Radio Station Website</a>
    </header>

    <div class="widgets">
        <EmbedPlayer {host} />
        <Schedule {host} />
    </div>

    <div class="player">
      <Player {id} />
    </div>


    <div class="api">
        <CurrentlyPlaying {host} />

        <!-- general -->
        <LiveInfo {host} />
        <WeekInfo {host} />
        <StationMetaData {host} />
        <Shows {host} />
        <PlayoutHistoryFeed {host} />

        <!-- specific to one show -->
        <ShowTracks {host} show={1} />
        <ShowSchedule {host} show={1} />
    </div>

</main>

<style lang="scss">

    header {
        margin: 1rem;
        display: flex;
        justify-content: space-between;
    }

</style>
