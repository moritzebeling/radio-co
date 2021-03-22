<script>

    import Load from './Load.svelte';
    const url = 'http://stern.rocks/api/station/1';

</script>

<Load {url} let:prop={data}>

    <h1>Station</h1>
    <pre>{JSON.stringify( data, null, 2 )}</pre>

</Load>
