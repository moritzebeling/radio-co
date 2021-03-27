<script>

    import Player from './widgets/Player.svelte';
    import Schedule from './widgets/Schedule.svelte';

    const id = 'eosradiohidden';

</script>

<main>

    <div class="widgets">
        <Player />
        <Schedule />
    </div>

    <a class="button" href="https://{id}.airtime.pro" target="_blank">Radio Station</a>

</main>

<style lang="scss">
</style>
