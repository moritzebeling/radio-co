<script>

    /* Airtime Pro Widgets */
    import Player from './widgets/Player.svelte';
    import Schedule from './widgets/Schedule.svelte';

    /* API */
    import LiveInfo from './modules/api/LiveInfo.svelte';
    import WeekInfo from './modules/api/WeekInfo.svelte';
    import StationMetaData from './modules/api/StationMetaData.svelte';
    import Shows from './modules/api/Shows.svelte';
    import PlayoutHistoryFeed from './modules/api/PlayoutHistoryFeed.svelte';
    import ShowTracks from './modules/api/ShowTracks.svelte';
    import ShowSchedule from './modules/api/ShowSchedule.svelte';

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
        <Player {host} />
        <Schedule {host} />
    </div>

    <div class="api">
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
