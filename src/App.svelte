<script>

    import Status from './modules/Status.svelte';
    import Live from './modules/Live.svelte';
    import Shows from './modules/Shows.svelte';

    let isLive = false;

</script>

    <Status isLive={false} />
    {#if isLive}
        <Live />
    {/if}
    <Shows />

<style lang="scss">
</style>
