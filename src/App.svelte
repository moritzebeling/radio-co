<script>

    //import Status from './modules/Status.svelte';
    import Live from './modules/Live.svelte';
    import Station from './modules/Station.svelte';
    import History from './modules/History.svelte';
    import Schedule from './modules/Schedule.svelte';
    import Playlists from './modules/Playlists.svelte';
    import Queue from './modules/Queue.svelte';
    import NowPlaying from './modules/NowPlaying.svelte';

    let isLive = true;

</script>

<main>

    <!-- <Status isLive={false} /> -->

    {#if isLive}
        <Live />
    {/if}

    <Station />
    <Schedule />
    <History />
    <Playlists />
    <Queue />
    <NowPlaying />

</main>

<style lang="scss">

</style>
