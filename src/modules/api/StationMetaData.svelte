<script>

    import Load from '../Load.svelte';
    import InspectData from '../InspectData.svelte';

    export let host;
    const url = `${host}/api/station-metadata`;

</script>

<Load {url} let:prop={data}>
    <section>

        <header>
            <h1>Station MetaData API</h1>
            <p><i>station</i> data, including 2 <i>stream</i> endpoints</p>
        </header>

        <InspectData {data} />

    </section>
</Load>
