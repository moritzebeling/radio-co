<script>

    //import Status from './modules/Status.svelte';
    import Live from './modules/Live.svelte';
    import Station from './modules/Station.svelte';
    import NowPlaying from './modules/NowPlaying.svelte';

    let isLive = true;

</script>

<main>

<!--    <Status isLive={false} /> -->

    {#if isLive}
        <Live />
    {/if}

    <Station />
    <NowPlaying />

</main>

<style lang="scss">

</style>
