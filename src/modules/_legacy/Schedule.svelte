<script>

    import Load from './Load.svelte';
    const url = 'http://134.122.90.200:80/api/station/1/schedule';

    let show = false;
    function toggle(){
        show = !show;
    }

</script>

<Load {url} let:prop={data}>

    <section>

        <h1>Schedule</h1>
        <button on:click={toggle}>Toggle</button>
        {#if show}
            <pre>{JSON.stringify( data, null, 2 )}</pre>
        {/if}

    </section>

</Load>
