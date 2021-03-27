<script>

    import Load from './Load.svelte';

    export let host;
    const url = `${host}/api/live-info-v2`;

    let show = false;
    function toggle(){
        show = !show;
    }

</script>

<Load {url} let:prop={data}>

    <section>

        <h1>Playlists</h1>
        <button on:click={toggle}>Toggle</button>
        {#if show}
            <pre>{JSON.stringify( data, null, 2 )}</pre>
        {/if}

    </section>

</Load>
