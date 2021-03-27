<script>

    /* Airtime Pro Widgets */
    import Player from './widgets/Player.svelte';
    import Schedule from './widgets/Schedule.svelte';

    /* API */
    import LiveInfo from './modules/LiveInfo.svelte';

    /* Custom Player */

    /* Config */
    const id = 'eosradiohidden';
    const host = `https://${id}.airtime.pro`;

</script>

<main>

    <a class="button" href={host} target="_blank">Radio Station</a>

    <section class="widgets">
        <Player {host} />
        <Schedule {host} />
    </section>

    <section class="api">
        <LiveInfo {host} />
    </section>

</main>

<style lang="scss">
</style>
