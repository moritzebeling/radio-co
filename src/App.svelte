<script>

    //import Status from './modules/Status.svelte';
    import Live from './modules/Live.svelte';
    import NowPlaying from './modules/NowPlaying.svelte';

    let isLive = true;

</script>

<!--    <Status isLive={false} /> -->

    {#if isLive}
        <Live />
    {/if}

    <NowPlaying />

<style lang="scss">
</style>
