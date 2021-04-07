<script>

    export let data;

    export let open = false;
    function toggle(){
        open = !open;
    }

</script>

<button on:click={toggle}>Inspect Data</button>
{#if open}
    <pre>{JSON.stringify( data, null, 2 )}</pre>
{/if}
