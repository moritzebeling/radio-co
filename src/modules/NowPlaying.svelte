<script>

    import Load from './Load.svelte';
    const url = 'http://stern.rocks/api/nowplaying';

</script>

<Load {url} let:prop={data}>

    <pre>{JSON.stringify( data, null, 2 )}</pre>

</Load>
