<script>

    import Status from './modules/Status.svelte';
    import Live from './modules/Live.svelte';
    import Shows from './modules/Shows.svelte';

    let isLive = true;

</script>

    <Status isLive={true} />
    {#if isLive}
        <Live />
    {/if}
    <Shows />

<style lang="scss">
</style>
