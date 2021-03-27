<script>

    import Load from '../Load.svelte';
    import InspectData from '../InspectData.svelte';

    export let host;
    const url = `${host}/api/item-history-feed`;

</script>

<Load {url} let:prop={data}>
    <section>

        <header>
            <h1>Playout History Feed API</h1>
            <p>list of all played <i>tracks</i></p>
        </header>

        <InspectData {data} />

    </section>
</Load>
