<script>

    export let isLive;

</script>

{#if isLive}
    <h1>Station is live</h1>
{:else}
    <h1>Station offline</h1>
{/if}
