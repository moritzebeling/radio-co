<script>

    import Player from './modules/Player.svelte';

    import EmbedPlayer from './widgets/EmbedPlayer.svelte';
    import Schedule from './widgets/Schedule.svelte';

    const id = 'eosradiohidden';

</script>

<main>

    <div class="modules">
        <Player {id} />
    </div>

    <div class="widgets">
        <EmbedPlayer {id} />
        <Schedule {id} />
    </div>

    <a class="button" href="https://{id}.airtime.pro" target="_blank">Radio Station</a>

</main>

<style lang="scss">
</style>
