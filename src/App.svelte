<script>

    //import Status from './modules/Status.svelte';
    import Live from './modules/Live.svelte';
    import Station from './modules/Station.svelte';
    import NowPlaying from './modules/NowPlaying.svelte';

    let isLive = true;

</script>

<!--    <Status isLive={false} /> -->

    {#if isLive}
        <Live />
    {/if}

    <Station />
    <NowPlaying />

<style lang="scss">
</style>
