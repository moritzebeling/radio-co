<script>

    import Live from './modules/Live.svelte';
    import Offline from './modules/Offline.svelte';

    let live = true;

</script>

{#if live}
    <div class="container">
        <Live />
    </div>
{:else}
    <Offline />
{/if}

<style lang="scss">

    .container {
        margin: 2rem;
        padding: 2rem;
        border: 1px solid #000;
    }

</style>
