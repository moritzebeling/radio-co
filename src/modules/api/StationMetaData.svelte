<script>

    import Load from '../Load.svelte';
    import InspectData from '../InspectData.svelte';

    export let host;
    const url = `${host}/api/station-metadata`;

</script>

<section>

    <header>
        <h1>Station MetaData API</h1>
        <p><i>station</i> data, including 2 <i>stream</i> endpoints</p>
    </header>

    <Load {url} let:prop={data}>

        <InspectData {data} />

    </Load>

</section>
