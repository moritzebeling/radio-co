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

    /* Custom Player */

    /* Config */
    const id = 'eosradiohidden';
    const host = `https://${id}.airtime.pro`;

</script>

<main>

    <a class="button" href={host} target="_blank">Radio Station</a>

    <div class="widgets">
        <Player {host} />
        <Schedule {host} />
    </div>

    <div class="api">
        <LiveInfo {host} />
        <WeekInfo {host} />
        <StationMetaData {host} />
        <Shows {host} />
        <PlayoutHistoryFeed {host} />
    </div>

</main>

<style lang="scss">
</style>
