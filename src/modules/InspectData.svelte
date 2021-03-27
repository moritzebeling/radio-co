<script>

    export let data;

    let show = false;
    function toggle(){
        show = !show;
    }

</script>

<button on:click={toggle}>Inspect Data</button>
{#if show}
    <pre>{JSON.stringify( data, null, 2 )}</pre>
{/if}
