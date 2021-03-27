<script>

    import Load from '../Load.svelte';
    import InspectData from '../InspectData.svelte';

    export let host;
    const url = `${host}/api/item-history-feed`;

</script>

<section>

    <header>
        <h1>Playout History Feed API</h1>
        <p>list of all played <i>tracks</i></p>
    </header>

    <Load {url} let:prop={data}>

        <InspectData {data} />

    </Load>

</section>
